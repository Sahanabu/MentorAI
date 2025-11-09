const academicService = require('../services/academicService');
const Assessment = require('../models/Assessment');

class AssessmentController {
  // Create or update internal marks
  async updateInternalMarks(req, res, next) {
    try {
      const { studentId, subjectId, semester, internal1, internal2, internal3 } = req.body;

      // Validate required fields
      if (!studentId || !subjectId || !semester) {
        return res.status(400).json({
          success: false,
          message: 'Student ID, Subject ID, and Semester are required'
        });
      }

      // Calculate internal marks
      const internalMarks = academicService.calculateInternalMarks([
        internal1, internal2, internal3
      ]);

      // Create or update assessment
      const assessment = await academicService.createOrUpdateAssessment({
        studentId,
        subjectId,
        semester,
        internals: internalMarks
      });

      res.json({
        success: true,
        message: 'Internal marks updated successfully',
        data: {
          assessment,
          internalMarks
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get internal marks
  async getInternalMarks(req, res, next) {
    try {
      const { studentId, subjectId } = req.params;
      const { semester } = req.query;

      const assessment = await Assessment.findOne({
        studentId,
        subjectId,
        semester: semester ? parseInt(semester) : undefined
      }).populate('subjectId', 'subjectName subjectCode');

      if (!assessment) {
        return res.status(404).json({
          success: false,
          message: 'Assessment not found'
        });
      }

      res.json({
        success: true,
        data: assessment
      });
    } catch (error) {
      next(error);
    }
  }

  // Update assignment marks
  async updateAssignmentMarks(req, res, next) {
    try {
      const { studentId, subjectId, semester, totalMarks, submissions } = req.body;

      const assessment = await academicService.createOrUpdateAssessment({
        studentId,
        subjectId,
        semester,
        assignments: {
          totalMarks,
          submissions: submissions || []
        }
      });

      res.json({
        success: true,
        message: 'Assignment marks updated successfully',
        data: assessment
      });
    } catch (error) {
      next(error);
    }
  }

  // Get assignment marks
  async getAssignmentMarks(req, res, next) {
    try {
      const { studentId, subjectId } = req.params;
      const { semester } = req.query;

      const assessment = await Assessment.findOne({
        studentId,
        subjectId,
        semester: semester ? parseInt(semester) : undefined
      }).populate('subjectId', 'subjectName subjectCode');

      if (!assessment) {
        return res.status(404).json({
          success: false,
          message: 'Assessment not found'
        });
      }

      res.json({
        success: true,
        data: {
          assignments: assessment.assignments,
          subject: assessment.subjectId
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Update attendance
  async updateAttendance(req, res, next) {
    try {
      const { studentId, subjectId, semester, totalClasses, attendedClasses } = req.body;

      const assessment = await academicService.createOrUpdateAssessment({
        studentId,
        subjectId,
        semester,
        attendance: {
          totalClasses,
          attendedClasses
        }
      });

      res.json({
        success: true,
        message: 'Attendance updated successfully',
        data: assessment
      });
    } catch (error) {
      next(error);
    }
  }

  // Get attendance
  async getAttendance(req, res, next) {
    try {
      const { studentId, subjectId } = req.params;
      const { semester } = req.query;

      const assessment = await Assessment.findOne({
        studentId,
        subjectId,
        semester: semester ? parseInt(semester) : undefined
      }).populate('subjectId', 'subjectName subjectCode');

      if (!assessment) {
        return res.status(404).json({
          success: false,
          message: 'Assessment not found'
        });
      }

      res.json({
        success: true,
        data: {
          attendance: assessment.attendance,
          subject: assessment.subjectId
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Update final exam marks
  async updateFinalExamMarks(req, res, next) {
    try {
      const { studentId, subjectId, semester, finalExamMarks } = req.body;

      const assessment = await academicService.createOrUpdateAssessment({
        studentId,
        subjectId,
        semester,
        finalExamMarks
      });

      res.json({
        success: true,
        message: 'Final exam marks updated successfully',
        data: assessment
      });
    } catch (error) {
      next(error);
    }
  }

  // Get final exam marks
  async getFinalExamMarks(req, res, next) {
    try {
      const { studentId, subjectId } = req.params;
      const { semester } = req.query;

      const assessment = await Assessment.findOne({
        studentId,
        subjectId,
        semester: semester ? parseInt(semester) : undefined
      }).populate('subjectId', 'subjectName subjectCode');

      if (!assessment) {
        return res.status(404).json({
          success: false,
          message: 'Assessment not found'
        });
      }

      res.json({
        success: true,
        data: {
          finalExamMarks: assessment.finalExamMarks,
          totalMarks: assessment.totalMarks,
          grade: assessment.grade,
          isPassed: assessment.isPassed,
          subject: assessment.subjectId
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Bulk update marks (for teachers)
  async bulkUpdateMarks(req, res, next) {
    try {
      const { updates } = req.body; // Array of assessment updates
      
      if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Updates array is required'
        });
      }

      const results = [];
      const errors = [];

      for (const update of updates) {
        try {
          const assessment = await academicService.createOrUpdateAssessment(update);
          results.push(assessment);
        } catch (error) {
          errors.push({
            update,
            error: error.message
          });
        }
      }

      res.json({
        success: true,
        message: `Bulk update completed. ${results.length} successful, ${errors.length} failed`,
        data: {
          successful: results,
          failed: errors
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get subject-wise performance for teacher
  async getSubjectPerformance(req, res, next) {
    try {
      const { subjectId } = req.params;
      const { semester, academicYear } = req.query;

      let query = { subjectId };
      if (semester) query.semester = parseInt(semester);
      if (academicYear) query.academicYear = academicYear;

      const assessments = await Assessment.find(query)
        .populate('studentId', 'usn profile.firstName profile.lastName')
        .populate('subjectId', 'subjectName subjectCode')
        .sort({ 'studentId.usn': 1 });

      // Calculate statistics
      const totalStudents = assessments.length;
      const passedStudents = assessments.filter(a => a.isPassed).length;
      const failedStudents = totalStudents - passedStudents;
      
      const averageMarks = assessments.reduce((sum, a) => sum + (a.totalMarks || 0), 0) / totalStudents;
      const averageAttendance = assessments.reduce((sum, a) => sum + (a.attendance.percentage || 0), 0) / totalStudents;

      res.json({
        success: true,
        data: {
          assessments,
          statistics: {
            totalStudents,
            passedStudents,
            failedStudents,
            passPercentage: totalStudents > 0 ? (passedStudents / totalStudents) * 100 : 0,
            averageMarks: Math.round(averageMarks * 100) / 100,
            averageAttendance: Math.round(averageAttendance * 100) / 100
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AssessmentController();