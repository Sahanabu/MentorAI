const mongoose = require('mongoose');

const semesterResultSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  academicYear: {
    type: String,
    required: true
  },
  subjects: [{
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    subjectCode: String,
    subjectName: String,
    credits: {
      type: Number,
      required: true
    },
    grade: {
      type: String,
      enum: ['S', 'A', 'B', 'C', 'D', 'E', 'F', 'Absent'],
      required: true
    },
    gradePoints: {
      type: Number,
      required: true,
      min: 0,
      max: 10
    },
    creditPoints: {
      type: Number,
      required: true
    },
    totalMarks: Number,
    internalMarks: Number,
    externalMarks: Number,
    isBacklog: {
      type: Boolean,
      default: false
    }
  }],
  totalCredits: {
    type: Number,
    required: true
  },
  earnedCredits: {
    type: Number,
    required: true
  },
  totalCreditPoints: {
    type: Number,
    required: true
  },
  sgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  resultDate: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
semesterResultSchema.index({ studentId: 1, semester: 1 });
semesterResultSchema.index({ academicYear: 1 });

// Calculate SGPA
semesterResultSchema.methods.calculateSGPA = function() {
  const passedSubjects = this.subjects.filter(s => s.grade !== 'F' && s.grade !== 'Absent');
  const totalEarnedCredits = passedSubjects.reduce((sum, s) => sum + s.credits, 0);
  const totalCreditPoints = passedSubjects.reduce((sum, s) => sum + s.creditPoints, 0);
  
  this.earnedCredits = totalEarnedCredits;
  this.totalCreditPoints = totalCreditPoints;
  this.sgpa = totalEarnedCredits > 0 ? totalCreditPoints / totalEarnedCredits : 0;
  
  return this.sgpa;
};

module.exports = mongoose.model('SemesterResult', semesterResultSchema);