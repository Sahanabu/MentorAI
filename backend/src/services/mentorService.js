const User = require('../models/User');
const MentorAssignment = require('../models/MentorAssignment');
const Prediction = require('../models/Prediction');
const { USER_ROLES, ENTRY_TYPES } = require('../config/constants');

class MentorService {
  // Assign mentors to students using balanced distribution algorithm
  async assignMentorsToStudents(department, mentorCount) {
    try {
      // Get all mentors in the department
      const mentors = await User.find({
        role: USER_ROLES.MENTOR,
        department: department.toUpperCase(),
        isActive: true
      }).limit(mentorCount);

      if (mentors.length === 0) {
        throw new Error(`No mentors found in ${department} department`);
      }

      // Get all unassigned students in the department
      const students = await User.find({
        role: USER_ROLES.STUDENT,
        department: department.toUpperCase(),
        'studentInfo.mentorId': { $exists: false },
        isActive: true
      });

      if (students.length === 0) {
        throw new Error('No unassigned students found');
      }

      // Calculate students per mentor
      const studentsPerMentor = Math.ceil(students.length / mentors.length);

      // Create or update mentor assignments
      const assignments = [];
      for (let i = 0; i < mentors.length; i++) {
        const mentor = mentors[i];
        
        let assignment = await MentorAssignment.findOne({ mentorId: mentor._id });
        if (!assignment) {
          assignment = new MentorAssignment({
            mentorId: mentor._id,
            department: department.toUpperCase(),
            maxStudentCount: studentsPerMentor,
            assignedStudents: [],
            regularStudents: [],
            lateralStudents: []
          });
        }

        assignments.push(assignment);
      }

      // Distribute students using round-robin algorithm
      let mentorIndex = 0;
      for (const student of students) {
        const assignment = assignments[mentorIndex];
        
        try {
          await assignment.addStudent(student._id, student.studentInfo.entryType);
          
          // Update student's mentor reference
          student.studentInfo.mentorId = assignment.mentorId;
          await student.save();
          
          mentorIndex = (mentorIndex + 1) % assignments.length;
        } catch (error) {
          console.error(`Failed to assign student ${student.usn} to mentor: ${error.message}`);
        }
      }

      // Save all assignments
      await Promise.all(assignments.map(assignment => assignment.save()));

      return assignments;
    } catch (error) {
      throw new Error(`Failed to assign mentors: ${error.message}`);
    }
  }

  // Get mentor's assigned students
  async getMentorStudents(mentorId) {
    try {
      const students = await User.findStudentsByMentor(mentorId);
      
      // Get latest predictions for each student
      const studentsWithPredictions = await Promise.all(
        students.map(async (student) => {
          const latestPrediction = await Prediction.getLatestPrediction(
            student._id, 
            'SEMESTER'
          );
          
          return {
            ...student.toObject(),
            latestPrediction
          };
        })
      );

      return studentsWithPredictions;
    } catch (error) {
      throw new Error(`Failed to get mentor students: ${error.message}`);
    }
  }

  // Get at-risk students for a mentor
  async getAtRiskStudents(mentorId, riskLevels = ['AT_RISK', 'NEEDS_ATTENTION']) {
    try {
      const atRiskStudents = await Prediction.getAtRiskStudents(mentorId, riskLevels);
      
      return atRiskStudents.map(item => ({
        student: item.student,
        prediction: item.latestPrediction.prediction,
        riskFactors: this.identifyRiskFactors(item.latestPrediction.inputFeatures),
        lastUpdated: item.latestPrediction.createdAt
      }));
    } catch (error) {
      throw new Error(`Failed to get at-risk students: ${error.message}`);
    }
  }

  // Identify risk factors based on input features
  identifyRiskFactors(features) {
    const riskFactors = [];
    
    if (features.attendance < 75) {
      riskFactors.push('Low attendance');
    }
    
    if (features.bestOfTwo < 15) {
      riskFactors.push('Poor internal marks');
    }
    
    if (features.assignments < 12) {
      riskFactors.push('Low assignment scores');
    }
    
    if (features.backlogCount > 0) {
      riskFactors.push(`${features.backlogCount} active backlogs`);
    }
    
    if (features.behaviorScore < 6) {
      riskFactors.push('Behavioral concerns');
    }
    
    if (features.previousSgpa && features.previousSgpa < 6) {
      riskFactors.push('Low previous SGPA');
    }
    
    return riskFactors;
  }

  // Get mentor assignment statistics
  async getMentorAssignmentStats(department) {
    try {
      const assignments = await MentorAssignment.find({
        department: department.toUpperCase(),
        isActive: true
      }).populate('mentorId', 'profile.firstName profile.lastName');

      const stats = assignments.map(assignment => ({
        mentor: assignment.mentorId,
        assignedCount: assignment.assignedStudents.length,
        maxCapacity: assignment.maxStudentCount,
        utilizationRate: (assignment.assignedStudents.length / assignment.maxStudentCount) * 100,
        regularStudents: assignment.regularStudents.length,
        lateralStudents: assignment.lateralStudents.length
      }));

      const totalAssigned = stats.reduce((sum, stat) => sum + stat.assignedCount, 0);
      const totalCapacity = stats.reduce((sum, stat) => sum + stat.maxCapacity, 0);
      const averageUtilization = totalCapacity > 0 ? (totalAssigned / totalCapacity) * 100 : 0;

      return {
        mentorStats: stats,
        summary: {
          totalMentors: assignments.length,
          totalAssignedStudents: totalAssigned,
          totalCapacity,
          averageUtilization: Math.round(averageUtilization * 100) / 100
        }
      };
    } catch (error) {
      throw new Error(`Failed to get mentor assignment stats: ${error.message}`);
    }
  }

  // Update mentor capacity
  async updateMentorCapacity(mentorId, newCapacity) {
    try {
      const assignment = await MentorAssignment.findOne({ mentorId });
      if (!assignment) {
        throw new Error('Mentor assignment not found');
      }

      if (newCapacity < assignment.assignedStudents.length) {
        throw new Error('New capacity cannot be less than currently assigned students');
      }

      assignment.maxStudentCount = newCapacity;
      await assignment.save();

      return assignment;
    } catch (error) {
      throw new Error(`Failed to update mentor capacity: ${error.message}`);
    }
  }

  // Reassign student to different mentor
  async reassignStudent(studentId, newMentorId) {
    try {
      const student = await User.findById(studentId);
      if (!student || student.role !== USER_ROLES.STUDENT) {
        throw new Error('Student not found');
      }

      const oldMentorId = student.studentInfo.mentorId;
      
      // Remove from old mentor
      if (oldMentorId) {
        const oldAssignment = await MentorAssignment.findOne({ mentorId: oldMentorId });
        if (oldAssignment) {
          await oldAssignment.removeStudent(studentId);
        }
      }

      // Add to new mentor
      const newAssignment = await MentorAssignment.findOne({ mentorId: newMentorId });
      if (!newAssignment) {
        throw new Error('New mentor assignment not found');
      }

      await newAssignment.addStudent(studentId, student.studentInfo.entryType);
      
      // Update student record
      student.studentInfo.mentorId = newMentorId;
      await student.save();

      return {
        student,
        oldMentorId,
        newMentorId
      };
    } catch (error) {
      throw new Error(`Failed to reassign student: ${error.message}`);
    }
  }
}

module.exports = new MentorService();