const mongoose = require('mongoose');

const backlogSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  subjectCode: {
    type: String,
    required: true,
    uppercase: true
  },
  subjectName: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  attempts: [{
    attemptNumber: {
      type: Number,
      required: true,
      min: 1
    },
    examDate: {
      type: Date,
      required: true
    },
    marksObtained: {
      type: Number,
      min: 0,
      max: 100
    },
    isPassed: {
      type: Boolean,
      default: false
    },
    grade: {
      type: String,
      enum: ['S', 'A', 'B', 'C', 'D', 'F']
    }
  }],
  isCleared: {
    type: Boolean,
    default: false
  },
  clearedDate: Date,
  totalAttempts: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes
backlogSchema.index({ studentId: 1 });
backlogSchema.index({ studentId: 1, subjectId: 1 }, { unique: true });
backlogSchema.index({ isCleared: 1 });

// Pre-save middleware to update totalAttempts
backlogSchema.pre('save', function(next) {
  this.totalAttempts = this.attempts.length;
  
  // Check if any attempt is passed
  const passedAttempt = this.attempts.find(attempt => attempt.isPassed);
  if (passedAttempt && !this.isCleared) {
    this.isCleared = true;
    this.clearedDate = new Date();
  }
  
  next();
});

// Method to add new attempt
backlogSchema.methods.addAttempt = function(attemptData) {
  const attemptNumber = this.attempts.length + 1;
  this.attempts.push({
    ...attemptData,
    attemptNumber
  });
  return this.save();
};

// Static method to get student backlogs
backlogSchema.statics.getStudentBacklogs = function(studentId, includeCleared = false) {
  const query = { studentId };
  if (!includeCleared) {
    query.isCleared = false;
  }
  
  return this.find(query)
    .populate('subjectId', 'subjectName subjectCode credits')
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Backlog', backlogSchema);