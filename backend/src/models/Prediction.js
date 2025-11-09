const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  predictionType: {
    type: String,
    required: true,
    enum: ['SUBJECT', 'SEMESTER']
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  inputFeatures: {
    attendance: Number,
    bestOfTwo: Number,
    assignments: Number,
    behaviorScore: Number,
    backlogCount: Number,
    previousSgpa: Number,
    labPerformance: Number
  },
  prediction: {
    riskLevel: {
      type: String,
      required: true,
      enum: ['SAFE', 'NEEDS_ATTENTION', 'AT_RISK']
    },
    probability: {
      type: Number,
      min: 0,
      max: 1
    },
    predictedScore: {
      type: Number,
      min: 0,
      max: 100
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    }
  },
  explanation: {
    topFeatures: [{
      feature: String,
      impact: Number,
      description: String
    }]
  },
  modelVersion: {
    type: String,
    required: true
  },
  isValid: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
predictionSchema.index({ studentId: 1, predictionType: 1 });
predictionSchema.index({ 'prediction.riskLevel': 1 });
predictionSchema.index({ semester: 1 });
predictionSchema.index({ createdAt: -1 });

// Static method to get latest prediction
predictionSchema.statics.getLatestPrediction = function(studentId, predictionType, subjectId = null) {
  const query = {
    studentId,
    predictionType,
    isValid: true
  };
  
  if (subjectId) {
    query.subjectId = subjectId;
  }
  
  return this.findOne(query).sort({ createdAt: -1 });
};

// Static method to get at-risk students
predictionSchema.statics.getAtRiskStudents = function(mentorId, riskLevels = ['AT_RISK', 'NEEDS_ATTENTION']) {
  return this.aggregate([
    {
      $match: {
        'prediction.riskLevel': { $in: riskLevels },
        isValid: true
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: '$studentId',
        latestPrediction: { $first: '$$ROOT' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'student'
      }
    },
    {
      $unwind: '$student'
    },
    {
      $match: {
        'student.studentInfo.mentorId': new mongoose.Types.ObjectId(mentorId)
      }
    }
  ]);
};

module.exports = mongoose.model('Prediction', predictionSchema);