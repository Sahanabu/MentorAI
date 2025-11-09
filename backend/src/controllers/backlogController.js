const backlogService = require('../services/backlogService');

class BacklogController {
  // Get student backlogs
  async getStudentBacklogs(req, res, next) {
    try {
      const { studentId } = req.params;
      const { includeCleared } = req.query;

      const result = await backlogService.getStudentBacklogs(
        studentId, 
        includeCleared === 'true'
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Create backlog entry
  async createBacklog(req, res, next) {
    try {
      const { studentId, subjectId, semester } = req.body;

      if (!studentId || !subjectId || !semester) {
        return res.status(400).json({
          success: false,
          message: 'Student ID, Subject ID, and Semester are required'
        });
      }

      const backlog = await backlogService.createBacklog(studentId, subjectId, semester);

      res.status(201).json({
        success: true,
        message: 'Backlog created successfully',
        data: backlog
      });
    } catch (error) {
      next(error);
    }
  }

  // Add backlog attempt
  async addBacklogAttempt(req, res, next) {
    try {
      const { backlogId } = req.params;
      const attemptData = req.body;

      if (!attemptData.examDate || attemptData.marksObtained === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Exam date and marks are required'
        });
      }

      const backlog = await backlogService.addBacklogAttempt(backlogId, attemptData);

      res.json({
        success: true,
        message: 'Backlog attempt added successfully',
        data: backlog
      });
    } catch (error) {
      next(error);
    }
  }

  // Clear backlog
  async clearBacklog(req, res, next) {
    try {
      const { backlogId } = req.params;

      const backlog = await backlogService.clearBacklog(backlogId);

      res.json({
        success: true,
        message: 'Backlog cleared successfully',
        data: backlog
      });
    } catch (error) {
      next(error);
    }
  }

  // Get department backlog statistics (HOD only)
  async getDepartmentBacklogStats(req, res, next) {
    try {
      const { department } = req.params;

      const stats = await backlogService.getDepartmentBacklogStats(department);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Get backlog trends
  async getBacklogTrends(req, res, next) {
    try {
      const { department } = req.params;
      const { months } = req.query;

      const trends = await backlogService.getBacklogTrends(
        department, 
        months ? parseInt(months) : 12
      );

      res.json({
        success: true,
        data: trends
      });
    } catch (error) {
      next(error);
    }
  }

  // Auto-create backlogs from failed assessments
  async autoCreateBacklogs(req, res, next) {
    try {
      const backlogs = await backlogService.autoCreateBacklogsFromAssessments();

      res.json({
        success: true,
        message: `${backlogs.length} backlogs created automatically`,
        data: backlogs
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BacklogController();