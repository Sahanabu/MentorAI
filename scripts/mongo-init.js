// MongoDB initialization script
db = db.getSiblingDB('mentortrack');

// Create collections with indexes
db.createCollection('users');
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "usn": 1 }, { unique: true, sparse: true });
db.users.createIndex({ "role": 1, "department": 1 });
db.users.createIndex({ "studentInfo.mentorId": 1 });

db.createCollection('schemes');
db.schemes.createIndex({ "schemeYear": 1, "department": 1 }, { unique: true });

db.createCollection('subjects');
db.subjects.createIndex({ "subjectCode": 1 }, { unique: true });
db.subjects.createIndex({ "department": 1, "semester": 1 });
db.subjects.createIndex({ "teacherId": 1 });

db.createCollection('assessments');
db.assessments.createIndex({ "studentId": 1, "subjectId": 1, "semester": 1 }, { unique: true });
db.assessments.createIndex({ "semester": 1, "academicYear": 1 });

db.createCollection('backlogs');
db.backlogs.createIndex({ "studentId": 1 });
db.backlogs.createIndex({ "studentId": 1, "subjectId": 1 }, { unique: true });

db.createCollection('mentorassignments');
db.mentorassignments.createIndex({ "mentorId": 1 }, { unique: true });
db.mentorassignments.createIndex({ "department": 1 });

db.createCollection('predictions');
db.predictions.createIndex({ "studentId": 1, "predictionType": 1 });
db.predictions.createIndex({ "prediction.riskLevel": 1 });
db.predictions.createIndex({ "createdAt": -1 });

print('Database initialized successfully!');