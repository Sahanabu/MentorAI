const Backlog = require('../models/Backlog');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Assessment = require('../models/Assessment');

class BacklogService {
  // Create backlog entry
  async createBacklog(studentId, subjectId, semester) {
    try {
      const student = await User.findById(studentId);
      if (!student || student.role !== 'STUDENT') {
        throw new Error('Student not found');
      }

      const subject = await Subject.findById(subjectId);
      if (!subject) {
        throw new Error('Subject not found');
      }

      // Check if backlog already exists
      const existingBacklog = await Backlog.findOne({ studentId, subjectId });
      if (existingBacklog) {
        throw new Error('Backlog already exists for this subject');
      }

      const backlog = new Backlog({
        studentId,
        subjectId,
        subjectCode: subject.subjectCode,
        subjectName: subject.subjectName,
        semester
      });

      await backlog.save();

      // Update student's active backlog count
      await this.updateStudentBacklogCount(studentId);

      return backlog;
    } catch (error) {
      throw new Error(`Failed to create backlog: ${error.message}`);
    }
  }

  // Add backlog attempt
  async addBacklogAttempt(backlogId, attemptData) {
    try {
      const backlog = await Backlog.findById(backlogId);
      if (!backlog) {
        throw new Error('Backlog not found');
      }

      // Validate attempt data
      if (!attemptData.examDate || attemptData.marksObtained === undefined) {
        throw new Error('Exam date and marks are required');
      }

      // Determine if passed based on marks
      const isPassed = attemptData.marksObtained >= 40; // Assuming 40 is pass threshold
      
      const attempt = {
        ...attemptData,
        isPassed,
        grade: this.calculateGrade(attemptData.marksObtained)
      };

      await backlog.addAttempt(attempt);

      // Update student's backlog count if cleared
      if (isPassed) {
        await this.updateStudentBacklogCount(backlog.studentId);
      }

      return backlog;
    } catch (error) {
      throw new Error(`Failed to add backlog attempt: ${error.message}`);
    }
  }

  // Clear backlog manually
  async clearBacklog(backlogId) {
    try {
      const backlog = await Backlog.findById(backlogId);
      if (!backlog) {
        throw new Error('Backlog not found');
      }

      backlog.isCleared = true;
      backlog.clearedDate = new Date();
      await backlog.save();

      // Update student's backlog count
      await this.updateStudentBacklogCount(backlog.studentId);

      return backlog;
    } catch (error) {
      throw new Error(`Failed to clear backlog: ${error.message}`);
    }
  }

  // Get student backlogs
  async getStudentBacklogs(studentId, includeCleared = false) {
    try {
      const backlogs = await Backlog.getStudentBacklogs(studentId, includeCleared);
      
      return {
        backlogs,
        summary: {
          totalBacklogs: backlogs.length,
          activeBacklogs: backlogs.filter(b => !b.isCleared).length,
          clearedBacklogs: backlogs.filter(b => b.isCleared).length
        }
      };
    } catch (error) {
      throw new Error(`Failed to get student backlogs: ${error.message}`);
    }
  }

  // Get department backlog statistics
  async getDepartmentBacklogStats(department) {
    try {
      const pipeline = [
        {
          $lookup: {
            from: 'users',
            localField: 'studentId',
            foreignField: '_id',
            as: 'student'
          }
        },
        {
          $unwind: '$student'
        },
        {
          $match: {
            'student.department': department.toUpperCase()
          }
        },
        {
          $group: {
            _id: {
              semester: '$semester',
              isCleared: '$isCleared'
            },
            count: { $sum: 1 },
            subjects: { $addToSet: '$subjectCode' }
          }
        },
        {
          $group: {
            _id: '$_id.semester',
            active: {
              $sum: {
                $cond: [{ $eq: ['$_id.isCleared', false] }, '$count', 0]
              }
            },
            cleared: {
              $sum: {
                $cond: [{ $eq: ['$_id.isCleared', true] }, '$count', 0]
              }
            },
            total: { $sum: '$count' }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ];

      const semesterStats = await Backlog.aggregate(pipeline);

      // Get subject-wise backlog distribution
      const subjectStats = await Backlog.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'studentId',
            foreignField: '_id',
            as: 'student'
          }
        },
        {
          $unwind: '$student'
        },
        {
          $match: {
            'student.department': department.toUpperCase(),
            isCleared: false
          }
        },
        {
          $group: {
            _id: '$subjectCode',
            count: { $sum: 1 },
            subjectName: { $first: '$subjectName' }
          }
        },
        {
          $sort: { count: -1 }
        },
        {
          $limit: 10
        }
      ]);

      return {
        semesterStats,
        subjectStats,
        summary: {
          totalActive: semesterStats.reduce((sum, stat) => sum + stat.active, 0),
          totalCleared: semesterStats.reduce((sum, stat) => sum + stat.cleared, 0)
        }
      };
    } catch (error) {
      throw new Error(`Failed to get department backlog stats: ${error.message}`);
    }
  }

  // Update student's active backlog count
  async updateStudentBacklogCount(studentId) {
    try {
      const activeBacklogCount = await Backlog.countDocuments({
        studentId,
        isCleared: false
      });

      await User.findByIdAndUpdate(studentId, {
        'studentInfo.activeBacklogCount': activeBacklogCount
      });

      return activeBacklogCount;
    } catch (error) {
      throw new Error(`Failed to update student backlog count: ${error.message}`);
    }
  }

  // Calculate grade based on marks
  calculateGrade(marks) {
    if (marks >= 90) return 'S';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 40) return 'D';
    return 'F';
  }

  // Auto-create backlogs from failed assessments
  async autoCreateBacklogsFromAssessments() {
    try {
      const failedAssessments = await Assessment.find({
        isPassed: false,
        finalExamMarks: { $exists: true }
      }).populate('studentId subjectId');

      const backlogsCreated = [];

      for (const assessment of failedAssessments) {
        try {
          const existingBacklog = await Backlog.findOne({
            studentId: assessment.studentId._id,
            subjectId: assessment.subjectId._id
          });

          if (!existingBacklog) {
            const backlog = await this.createBacklog(
              assessment.studentId._id,
              assessment.subjectId._id,
              assessment.semester
            );
            backlogsCreated.push(backlog);
          }
        } catch (error) {
          console.error(`Failed to create backlog for assessment ${assessment._id}: ${error.message}`);
        }
      }

      return backlogsCreated;
    } catch (error) {
      throw new Error(`Failed to auto-create backlogs: ${error.message}`);
    }
  }

  // Get backlog trends over time
  async getBacklogTrends(department, months = 12) {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const pipeline = [
        {
          $lookup: {
            from: 'users',
            localField: 'studentId',
            foreignField: '_id',
            as: 'student'
          }
        },
        {
          $unwind: '$student'
        },
        {
          $match: {
            'student.department': department.toUpperCase(),
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            created: { $sum: 1 },
            cleared: {
              $sum: {
                $cond: [
                  { $and: ['$isCleared', { $gte: ['$clearedDate', startDate] }] },
                  1,
                  0
                ]
              }
            }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ];

      const trends = await Backlog.aggregate(pipeline);
      return trends;
    } catch (error) {
      throw new Error(`Failed to get backlog trends: ${error.message}`);
    }
  }
}

module.exports = new BacklogService();