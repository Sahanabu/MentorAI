const SemesterResult = require('../models/SemesterResult');
const User = require('../models/User');

class CGPAService {
  // Grade to points mapping
  static GRADE_POINTS = {
    'S': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6, 'E': 5, 'F': 0, 'Absent': 0
  };

  // Calculate CGPA for a student
  static async calculateCGPA(studentId) {
    const student = await User.findById(studentId);
    if (!student) throw new Error('Student not found');

    const results = await SemesterResult.find({ 
      studentId, 
      isCompleted: true 
    }).sort({ semester: 1 });

    if (results.length === 0) return 0;

    // For lateral entry, start from semester 3
    const startSemester = student.studentInfo.entryType === 'LATERAL' ? 3 : 1;
    const validResults = results.filter(r => r.semester >= startSemester);

    const totalEarnedCredits = validResults.reduce((sum, r) => sum + r.earnedCredits, 0);
    const totalCreditPoints = validResults.reduce((sum, r) => sum + r.totalCreditPoints, 0);

    const cgpa = totalEarnedCredits > 0 ? totalCreditPoints / totalEarnedCredits : 0;
    
    // Update student CGPA
    await User.findByIdAndUpdate(studentId, { 
      'studentInfo.cgpa': parseFloat(cgpa.toFixed(2))
    });

    return parseFloat(cgpa.toFixed(2));
  }

  // Add semester result
  static async addSemesterResult(studentId, semesterData) {
    const { semester, academicYear, subjects } = semesterData;

    // Calculate grade points and credit points for each subject
    const processedSubjects = subjects.map(subject => ({
      ...subject,
      gradePoints: this.GRADE_POINTS[subject.grade] || 0,
      creditPoints: (this.GRADE_POINTS[subject.grade] || 0) * subject.credits
    }));

    const totalCredits = processedSubjects.reduce((sum, s) => sum + s.credits, 0);

    const result = new SemesterResult({
      studentId,
      semester,
      academicYear,
      subjects: processedSubjects,
      totalCredits,
      isCompleted: true
    });

    result.calculateSGPA();
    await result.save();

    // Recalculate CGPA
    await this.calculateCGPA(studentId);

    return result;
  }

  // Get student academic summary
  static async getAcademicSummary(studentId) {
    const student = await User.findById(studentId).populate('studentInfo.mentorId');
    const results = await SemesterResult.find({ studentId }).sort({ semester: 1 });

    const cgpa = await this.calculateCGPA(studentId);
    
    // Check graduation status
    const isGraduated = student.studentInfo.entryType === 'LATERAL' 
      ? results.filter(r => r.semester >= 3 && r.isCompleted).length >= 6
      : results.filter(r => r.isCompleted).length >= 8;

    return {
      student: {
        usn: student.usn,
        name: `${student.profile.firstName} ${student.profile.lastName}`,
        department: student.department,
        entryType: student.studentInfo.entryType,
        admissionYear: student.studentInfo.admissionYear,
        currentSemester: student.studentInfo.currentSemester
      },
      semesterResults: results,
      cgpa,
      isGraduated,
      totalCreditsEarned: results.reduce((sum, r) => sum + r.earnedCredits, 0),
      totalCreditsRequired: student.studentInfo.entryType === 'LATERAL' ? 120 : 160
    };
  }

  // Mark student as graduated
  static async markAsGraduated(studentId) {
    const summary = await this.getAcademicSummary(studentId);
    
    if (summary.isGraduated) {
      await User.findByIdAndUpdate(studentId, {
        'studentInfo.isGraduated': true,
        'studentInfo.graduationDate': new Date(),
        isActive: false
      });
      return true;
    }
    return false;
  }

  // Get graduated students
  static async getGraduatedStudents(department = null) {
    const query = { 
      role: 'STUDENT',
      'studentInfo.isGraduated': true 
    };
    
    if (department) {
      query.department = department.toUpperCase();
    }

    return User.find(query)
      .populate('studentInfo.mentorId', 'profile.firstName profile.lastName')
      .sort({ 'studentInfo.graduationDate': -1 });
  }

  // Get current students
  static async getCurrentStudents(department = null) {
    const query = { 
      role: 'STUDENT',
      isActive: true,
      $or: [
        { 'studentInfo.isGraduated': { $exists: false } },
        { 'studentInfo.isGraduated': false }
      ]
    };
    
    if (department) {
      query.department = department.toUpperCase();
    }

    return User.find(query)
      .populate('studentInfo.mentorId', 'profile.firstName profile.lastName')
      .sort({ usn: 1 });
  }
}

module.exports = CGPAService;