const mongoose = require('mongoose');
const { GRADES } = require('../config/constants');

const assessmentSchema = new mongoose.Schema({
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
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  academicYear: {
    type: String,
    required: true,
    match: /^\d{4}-\d{2}$/
  },
  internals: {
    internal1: {
      type: Number,
      min: 0,
      max: 25
    },
    internal2: {
      type: Number,
      min: 0,
      max: 25
    },
    internal3: {
      type: Number,
      min: 0,
      max: 25
    },
    bestOfTwo: {
      type: Number,
      min: 0,
      max: 25
    },
    averageScore: {
      type: Number,
      min: 0,
      max: 25
    }
  },
  assignments: {
    totalMarks: {
      type: Number,
      min: 0,
      max: 20,
      default: 0
    },
    submissions: [{
      assignmentName: String,
      marks: {
        type: Number,
        min: 0
      },
      submittedDate: Date
    }]
  },
  labPerformance: {
    totalMarks: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    practicals: [{
      practicalName: String,
      marks: {
        type: Number,
        min: 0
      },
      date: Date
    }]
  },
  attendance: {
    totalClasses: {
      type: Number,
      default: 0,
      min: 0
    },
    attendedClasses: {
      type: Number,
      default: 0,
      min: 0
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  behaviorScore: {
    type: Number,
    min: 0,
    max: 10,
    default: 8
  },
  finalExamMarks: {
    type: Number,
    min: 0,
    max: 100
  },
  totalMarks: {
    type: Number,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
    enum: Object.keys(GRADES)
  },
  gradePoints: {
    type: Number,
    min: 0,
    max: 10
  },
  isPassed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
assessmentSchema.index({ studentId: 1, subjectId: 1, semester: 1 }, { unique: true });
assessmentSchema.index({ semester: 1, academicYear: 1 });
assessmentSchema.index({ isPassed: 1 });

// Pre-save middleware to calculate derived fields
assessmentSchema.pre('save', function(next) {
  // Calculate best of two internals
  if (this.internals.internal1 !== undefined && 
      this.internals.internal2 !== undefined && 
      this.internals.internal3 !== undefined) {
    
    const internals = [
      this.internals.internal1 || 0,
      this.internals.internal2 || 0,
      this.internals.internal3 || 0
    ].sort((a, b) => b - a);
    
    this.internals.bestOfTwo = (internals[0] + internals[1]) / 2;
    this.internals.averageScore = this.internals.bestOfTwo;
  }

  // Calculate attendance percentage
  if (this.attendance.totalClasses > 0) {
    this.attendance.percentage = Math.round(
      (this.attendance.attendedClasses / this.attendance.totalClasses) * 100
    );
  }

  // Calculate total marks and grade
  if (this.finalExamMarks !== undefined) {
    const internalMarks = this.internals.bestOfTwo || 0;
    const assignmentMarks = this.assignments.totalMarks || 0;
    const labMarks = this.labPerformance.totalMarks || 0;
    
    // Total = 50% final + 25% internals + 20% assignments + 5% lab (for theory subjects)
    this.totalMarks = Math.round(
      (this.finalExamMarks * 0.5) + 
      (internalMarks * 1) + 
      (assignmentMarks * 1) + 
      (labMarks * 1)
    );

    // Determine grade
    for (const [grade, config] of Object.entries(GRADES)) {
      if (this.totalMarks >= config.min) {
        this.grade = grade;
        this.gradePoints = config.points;
        this.isPassed = grade !== 'F';
        break;
      }
    }
  }

  next();
});

// Method to calculate CIE marks (Continuous Internal Evaluation)
assessmentSchema.methods.calculateCIE = function() {
  const internalMarks = this.internals.bestOfTwo || 0;
  const assignmentMarks = this.assignments.totalMarks || 0;
  const labMarks = this.labPerformance.totalMarks || 0;
  
  return internalMarks + assignmentMarks + labMarks;
};

// Static method to get semester performance
assessmentSchema.statics.getSemesterPerformance = function(studentId, semester) {
  return this.find({
    studentId,
    semester,
    isPassed: { $exists: true }
  }).populate('subjectId', 'subjectName subjectCode credits');
};

module.exports = mongoose.model('Assessment', assessmentSchema);