const User = require('../models/User');
const MentorAssignment = require('../models/MentorAssignment');
const { USER_ROLES } = require('../config/constants');

class MentorAssignmentController {
  /**
   * Get all students and mentors for assignment
   */
  async getAssignmentData(req, res, next) {
    try {
      const { department } = req.user;
      
      // Get unassigned students
      const students = await User.find({
        role: USER_ROLES.STUDENT,
        department,
        'studentInfo.mentorId': { $exists: false }
      }).select('usn profile studentInfo department');
      
      // Get available mentors
      const mentors = await User.find({
        role: USER_ROLES.MENTOR,
        department
      }).select('profile teacherInfo');
      
      // Get current assignments
      const assignments = await MentorAssignment.find({ department })
        .populate('mentorId', 'profile')
        .populate('assignedStudents', 'usn profile');
      
      res.json({
        success: true,
        data: {
          students,
          mentors,
          assignments
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Auto-distribute students evenly among mentors
   */
  async autoDistribute(req, res, next) {
    try {
      const { department } = req.user;
      const { semester, maxStudentsPerMentor = 20 } = req.body;
      
      // Get students to assign
      const students = await User.find({
        role: USER_ROLES.STUDENT,
        department,
        ...(semester && { 'studentInfo.currentSemester': semester }),
        'studentInfo.mentorId': { $exists: false }
      });
      
      // Get available mentors
      const mentors = await User.find({
        role: USER_ROLES.MENTOR,
        department
      });
      
      if (mentors.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No mentors available for assignment'
        });
      }
      
      // Calculate distribution
      const studentsPerMentor = Math.ceil(students.length / mentors.length);
      const actualLimit = Math.min(studentsPerMentor, maxStudentsPerMentor);
      
      // Clear existing assignments for this department
      await MentorAssignment.deleteMany({ department });
      
      // Distribute students
      const assignments = [];
      let studentIndex = 0;
      
      for (const mentor of mentors) {
        const assignedStudents = students.slice(studentIndex, studentIndex + actualLimit);
        
        if (assignedStudents.length > 0) {
          // Create assignment record
          const assignment = new MentorAssignment({
            mentorId: mentor._id,
            department,
            assignedStudents: assignedStudents.map(s => s._id),
            maxStudentCount: actualLimit,
            regularStudents: assignedStudents.filter(s => s.studentInfo.entryType === 'REGULAR').map(s => s._id),
            lateralStudents: assignedStudents.filter(s => s.studentInfo.entryType === 'LATERAL').map(s => s._id)
          });
          
          await assignment.save();
          assignments.push(assignment);
          
          // Update students with mentor reference
          await User.updateMany(
            { _id: { $in: assignedStudents.map(s => s._id) } },
            { 'studentInfo.mentorId': mentor._id }
          );
          
          studentIndex += actualLimit;
        }
      }
      
      res.json({
        success: true,
        message: `Successfully assigned ${studentIndex} students to ${assignments.length} mentors`,
        data: { assignments: assignments.length, studentsAssigned: studentIndex }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Manual assignment of students to mentor
   */
  async manualAssign(req, res, next) {
    try {
      const { mentorId, studentIds } = req.body;
      const { department } = req.user;
      
      // Validate mentor
      const mentor = await User.findOne({
        _id: mentorId,
        role: USER_ROLES.MENTOR,
        department
      });
      
      if (!mentor) {
        return res.status(400).json({
          success: false,
          message: 'Invalid mentor selected'
        });
      }
      
      // Update or create assignment
      let assignment = await MentorAssignment.findOne({ mentorId, department });
      
      if (assignment) {
        assignment.assignedStudents = [...new Set([...assignment.assignedStudents, ...studentIds])];
      } else {
        assignment = new MentorAssignment({
          mentorId,
          department,
          assignedStudents: studentIds,
          maxStudentCount: 20
        });
      }
      
      await assignment.save();
      
      // Update students with mentor reference
      await User.updateMany(
        { _id: { $in: studentIds } },
        { 'studentInfo.mentorId': mentorId }
      );
      
      res.json({
        success: true,
        message: 'Students assigned successfully',
        data: assignment
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove student from mentor
   */
  async removeAssignment(req, res, next) {
    try {
      const { studentId, mentorId } = req.body;
      
      // Remove from assignment
      await MentorAssignment.updateOne(
        { mentorId },
        { $pull: { assignedStudents: studentId } }
      );
      
      // Remove mentor reference from student
      await User.updateOne(
        { _id: studentId },
        { $unset: { 'studentInfo.mentorId': 1 } }
      );
      
      res.json({
        success: true,
        message: 'Student removed from mentor successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MentorAssignmentController();