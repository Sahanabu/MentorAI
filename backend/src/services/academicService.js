const Scheme = require('../models/Scheme');
const Subject = require('../models/Subject');
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const { parseUSN } = require('../utils/usnParser');

class AcademicService {
  // Get scheme by department and year
  async getSchemeByDepartment(department, year) {
    try {
      const scheme = await Scheme.getActiveScheme(department, year);
      if (!scheme) {
        throw new Error(`No active scheme found for ${department} department in ${year}`);
      }
      return scheme;
    } catch (error) {
      throw new Error(`Failed to get scheme: ${error.message}`);
    }
  }

  // Assign subjects to student based on semester
  async assignSubjectsToStudent(studentId, semester) {
    try {
      const student = await User.findById(studentId);
      if (!student || student.role !== 'STUDENT') {
        throw new Error('Student not found');
      }

      const { department, admissionYear } = student.studentInfo;
      const subjects = await Subject.getSubjectsBySemester(department, semester, admissionYear);
      
      // Create assessment records for each subject
      const assessments = [];
      for (const subject of subjects) {
        const existingAssessment = await Assessment.findOne({
          studentId,
          subjectId: subject._id,
          semester
        });

        if (!existingAssessment) {
          const assessment = new Assessment({
            studentId,
            subjectId: subject._id,
            semester,
            academicYear: this.getCurrentAcademicYear()
          });
          assessments.push(await assessment.save());
        }
      }

      return { subjects, assessments };
    } catch (error) {
      throw new Error(`Failed to assign subjects: ${error.message}`);
    }
  }

  // Create or update assessment
  async createOrUpdateAssessment(assessmentData) {
    try {
      const { studentId, subjectId, semester } = assessmentData;
      
      let assessment = await Assessment.findOne({
        studentId,
        subjectId,
        semester
      });

      if (assessment) {
        Object.assign(assessment, assessmentData);
      } else {
        assessment = new Assessment({
          ...assessmentData,
          academicYear: this.getCurrentAcademicYear()
        });
      }

      return await assessment.save();
    } catch (error) {
      throw new Error(`Failed to create/update assessment: ${error.message}`);
    }
  }

  // Calculate internal marks (best of 2)
  calculateInternalMarks(internals) {
    if (!Array.isArray(internals) || internals.length !== 3) {
      throw new Error('Three internal marks are required');
    }

    const validInternals = internals.filter(mark => mark !== null && mark !== undefined);
    if (validInternals.length < 2) {
      throw new Error('At least two internal marks are required');
    }

    const sortedInternals = validInternals.sort((a, b) => b - a);
    const bestOfTwo = (sortedInternals[0] + sortedInternals[1]) / 2;

    return {
      internal1: internals[0],
      internal2: internals[1],
      internal3: internals[2],
      bestOfTwo: Math.round(bestOfTwo * 100) / 100,
      averageScore: Math.round(bestOfTwo * 100) / 100
    };
  }

  // Get student's semester performance
  async getStudentSemesterPerformance(studentId, semester) {
    try {
      const assessments = await Assessment.getSemesterPerformance(studentId, semester);
      
      let totalCredits = 0;
      let totalGradePoints = 0;
      let passedSubjects = 0;
      let failedSubjects = 0;

      for (const assessment of assessments) {
        const credits = assessment.subjectId.credits;
        totalCredits += credits;
        
        if (assessment.isPassed) {
          totalGradePoints += assessment.gradePoints * credits;
          passedSubjects++;
        } else {
          failedSubjects++;
        }
      }

      const sgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

      return {
        assessments,
        summary: {
          totalSubjects: assessments.length,
          passedSubjects,
          failedSubjects,
          totalCredits,
          sgpa: Math.round(sgpa * 100) / 100
        }
      };
    } catch (error) {
      throw new Error(`Failed to get semester performance: ${error.message}`);
    }
  }

  // Get current academic year
  getCurrentAcademicYear() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 0-indexed

    // Academic year starts in June (month 6)
    if (currentMonth >= 6) {
      return `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;
    } else {
      return `${currentYear - 1}-${currentYear.toString().slice(-2)}`;
    }
  }

  // Update student's current semester and CGPA
  async updateStudentProgress(studentId) {
    try {
      const student = await User.findById(studentId);
      if (!student) {
        throw new Error('Student not found');
      }

      // Get all semester performances
      const allAssessments = await Assessment.find({
        studentId,
        isPassed: { $exists: true }
      }).populate('subjectId', 'credits');

      // Group by semester and calculate SGPA for each
      const semesterPerformance = {};
      let totalCredits = 0;
      let totalGradePoints = 0;

      for (const assessment of allAssessments) {
        const semester = assessment.semester;
        if (!semesterPerformance[semester]) {
          semesterPerformance[semester] = {
            credits: 0,
            gradePoints: 0
          };
        }

        const credits = assessment.subjectId.credits;
        semesterPerformance[semester].credits += credits;
        
        if (assessment.isPassed) {
          semesterPerformance[semester].gradePoints += assessment.gradePoints * credits;
          totalCredits += credits;
          totalGradePoints += assessment.gradePoints * credits;
        }
      }

      // Calculate CGPA
      const cgpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

      // Update student record
      student.studentInfo.cgpa = Math.round(cgpa * 100) / 100;
      await student.save();

      return {
        cgpa: student.studentInfo.cgpa,
        semesterPerformance
      };
    } catch (error) {
      throw new Error(`Failed to update student progress: ${error.message}`);
    }
  }
}

module.exports = new AcademicService();