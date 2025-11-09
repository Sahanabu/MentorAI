const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subjectCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    match: /^\d{2}[A-Z]{2}\d{2}$/
  },
  subjectName: {
    type: String,
    required: true,
    trim: true
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
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  department: {
    type: String,
    required: true,
    uppercase: true
  },
  schemeYear: {
    type: Number,
    required: true
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
  },
  syllabus: {
    modules: [{
      moduleNumber: Number,
      title: String,
      topics: [String],
      hours: Number
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
subjectSchema.index({ subjectCode: 1 });
subjectSchema.index({ department: 1, semester: 1 });
subjectSchema.index({ teacherId: 1 });
subjectSchema.index({ schemeYear: 1, department: 1 });

// Static method to get subjects by semester
subjectSchema.statics.getSubjectsBySemester = function(department, semester, schemeYear) {
  return this.find({
    department: department.toUpperCase(),
    semester,
    schemeYear,
    isActive: true
  }).populate('teacherId', 'profile.firstName profile.lastName');
};

module.exports = mongoose.model('Subject', subjectSchema);