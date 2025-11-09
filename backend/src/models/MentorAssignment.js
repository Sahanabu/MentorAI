const mongoose = require('mongoose');

const mentorAssignmentSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    required: true,
    uppercase: true
  },
  assignedStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxStudentCount: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  regularStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  lateralStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
mentorAssignmentSchema.index({ mentorId: 1 }, { unique: true });
mentorAssignmentSchema.index({ department: 1 });
mentorAssignmentSchema.index({ isActive: 1 });

// Virtual for current student count
mentorAssignmentSchema.virtual('currentStudentCount').get(function() {
  return this.assignedStudents.length;
});

// Method to add student
mentorAssignmentSchema.methods.addStudent = function(studentId, entryType) {
  if (this.assignedStudents.length >= this.maxStudentCount) {
    throw new Error('Mentor has reached maximum student capacity');
  }
  
  if (!this.assignedStudents.includes(studentId)) {
    this.assignedStudents.push(studentId);
    
    if (entryType === 'REGULAR') {
      this.regularStudents.push(studentId);
    } else if (entryType === 'LATERAL') {
      this.lateralStudents.push(studentId);
    }
  }
  
  return this.save();
};

// Method to remove student
mentorAssignmentSchema.methods.removeStudent = function(studentId) {
  this.assignedStudents = this.assignedStudents.filter(id => !id.equals(studentId));
  this.regularStudents = this.regularStudents.filter(id => !id.equals(studentId));
  this.lateralStudents = this.lateralStudents.filter(id => !id.equals(studentId));
  
  return this.save();
};

// Static method to find available mentors
mentorAssignmentSchema.statics.findAvailableMentors = function(department) {
  return this.find({
    department: department.toUpperCase(),
    isActive: true,
    $expr: { $lt: [{ $size: '$assignedStudents' }, '$maxStudentCount'] }
  }).populate('mentorId', 'profile.firstName profile.lastName');
};

module.exports = mongoose.model('MentorAssignment', mentorAssignmentSchema);