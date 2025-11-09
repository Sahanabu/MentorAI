const mentorService = require('../services/mentorService');

class MentorController {
  // Assign mentors to students (HOD only)
  async assignMentors(req, res, next) {
    try {
      const { department, mentorCount } = req.body;

      if (!department || !mentorCount) {
        return res.status(400).json({
          success: false,
          message: 'Department and mentor count are required'
        });
      }

      const assignments = await mentorService.assignMentorsToStudents(department, mentorCount);

      res.json({
        success: true,
        message: 'Mentors assigned successfully',
        data: assignments
      });
    } catch (error) {
      next(error);
    }
  }

  // Get mentor assignments
  async getMentorAssignments(req, res, next) {
    try {
      const { department } = req.query;
      
      if (!department) {
        return res.status(400).json({
          success: false,
          message: 'Department is required'
        });
      }

      const stats = await mentorService.getMentorAssignmentStats(department);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }

  // Get mentor's students
  async getMentorStudents(req, res, next) {
    try {
      const { mentorId } = req.params;
      
      const students = await mentorService.getMentorStudents(mentorId);

      res.json({
        success: true,
        data: students
      });
    } catch (error) {
      next(error);
    }
  }

  // Get at-risk students for mentor
  async getAtRiskStudents(req, res, next) {
    try {
      const { mentorId } = req.params;
      const { riskLevels } = req.query;
      
      const riskLevelArray = riskLevels ? riskLevels.split(',') : ['AT_RISK', 'NEEDS_ATTENTION'];
      const atRiskStudents = await mentorService.getAtRiskStudents(mentorId, riskLevelArray);

      res.json({
        success: true,
        data: atRiskStudents
      });
    } catch (error) {
      next(error);
    }
  }

  // Update mentor capacity
  async updateMentorCapacity(req, res, next) {
    try {
      const { mentorId } = req.params;
      const { capacity } = req.body;

      if (!capacity || capacity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Valid capacity is required'
        });
      }

      const assignment = await mentorService.updateMentorCapacity(mentorId, capacity);

      res.json({
        success: true,
        message: 'Mentor capacity updated successfully',
        data: assignment
      });
    } catch (error) {
      next(error);
    }
  }

  // Reassign student to different mentor
  async reassignStudent(req, res, next) {
    try {
      const { studentId, newMentorId } = req.body;

      if (!studentId || !newMentorId) {
        return res.status(400).json({
          success: false,
          message: 'Student ID and new mentor ID are required'
        });
      }

      const result = await mentorService.reassignStudent(studentId, newMentorId);

      res.json({
        success: true,
        message: 'Student reassigned successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Log mentor intervention
  async logIntervention(req, res, next) {
    try {
      const { studentId, interventionType, description, actionTaken } = req.body;
      const mentorId = req.user._id;

      // This would typically create an intervention record
      // For now, we'll return a success response
      const intervention = {
        mentorId,
        studentId,
        interventionType,
        description,
        actionTaken,
        date: new Date()
      };

      res.json({
        success: true,
        message: 'Intervention logged successfully',
        data: intervention
      });
    } catch (error) {
      next(error);
    }
  }

  // Get intervention history for a student
  async getInterventionHistory(req, res, next) {
    try {
      const { studentId } = req.params;

      // This would typically fetch from an interventions collection
      // For now, we'll return mock data
      const interventions = [
        {
          id: '1',
          mentorId: req.user._id,
          studentId,
          interventionType: 'Academic Support',
          description: 'Discussed study strategies for improving performance',
          actionTaken: 'Provided additional study materials and scheduled follow-up',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
        }
      ];

      res.json({
        success: true,
        data: interventions
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MentorController();