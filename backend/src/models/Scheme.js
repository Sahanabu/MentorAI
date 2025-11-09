const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  schemeYear: {
    type: Number,
    required: true,
    min: 2020,
    max: new Date().getFullYear() + 5
  },
  department: {
    type: String,
    required: true,
    uppercase: true
  },
  semesters: [{
    semesterNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },
    subjects: [{
      subjectCode: {
        type: String,
        required: true,
        uppercase: true
      },
      subjectName: {
        type: String,
        required: true
      },
      credits: {
        type: Number,
        required: true,
        min: 1,
        max: 6
      },
      subjectType: {
        type: String,
        required: true,
        enum: ['THEORY', 'LAB', 'IPCC', 'PROJECT']
      },
      teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      passThreshold: {
        type: Number,
        default: 40,
        min: 0,
        max: 100
      }
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
schemeSchema.index({ schemeYear: 1, department: 1 }, { unique: true });
schemeSchema.index({ isActive: 1 });

// Static method to get active scheme
schemeSchema.statics.getActiveScheme = function(department, year) {
  return this.findOne({
    department: department.toUpperCase(),
    schemeYear: year,
    isActive: true
  });
};

module.exports = mongoose.model('Scheme', schemeSchema);