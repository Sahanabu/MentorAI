const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { USER_ROLES, ENTRY_TYPES } = require('../config/constants');

const userSchema = new mongoose.Schema({
  usn: {
    type: String,
    unique: true,
    sparse: true, // Only for students
    uppercase: true,
    match: /^2KA\d{2}[A-Z]{2}\d{3}$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    required: true,
    enum: Object.values(USER_ROLES)
  },
  profile: {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      match: /^[6-9]\d{9}$/
    },
    avatar: String
  },
  department: {
    type: String,
    required: true,
    uppercase: true
  },
  // Student-specific fields
  studentInfo: {
    admissionYear: {
      type: Number,
      min: 2020,
      max: new Date().getFullYear()
    },
    entryType: {
      type: String,
      enum: Object.values(ENTRY_TYPES)
    },
    currentSemester: {
      type: Number,
      min: 1,
      max: 8
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    activeBacklogCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  // Teacher-specific fields
  teacherInfo: {
    employeeId: {
      type: String,
      unique: true,
      sparse: true
    },
    specialization: [String],
    subjectsTeaching: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  refreshToken: String
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ usn: 1 });
userSchema.index({ role: 1, department: 1 });
userSchema.index({ 'studentInfo.mentorId': 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to validate USN format
userSchema.methods.validateUSN = function() {
  if (this.role !== USER_ROLES.STUDENT) return true;
  
  const usnRegex = /^2KA(\d{2})([A-Z]{2})(\d{3})$/;
  return usnRegex.test(this.usn);
};

// Static method to find students by mentor
userSchema.statics.findStudentsByMentor = function(mentorId) {
  return this.find({
    role: USER_ROLES.STUDENT,
    'studentInfo.mentorId': mentorId,
    isActive: true
  }).populate('studentInfo.mentorId', 'profile.firstName profile.lastName');
};

module.exports = mongoose.model('User', userSchema);