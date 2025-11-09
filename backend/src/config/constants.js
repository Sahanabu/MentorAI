// User Roles
const USER_ROLES = {
  HOD: 'HOD',
  MENTOR: 'MENTOR', 
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT'
};

// Entry Types
const ENTRY_TYPES = {
  REGULAR: 'REGULAR',
  LATERAL: 'LATERAL'
};

// Subject Types
const SUBJECT_TYPES = {
  THEORY: 'THEORY',
  LAB: 'LAB',
  IPCC: 'IPCC'
};

// Grade Scale
const GRADES = {
  S: { points: 10, min: 90 },
  A: { points: 9, min: 80 },
  B: { points: 8, min: 70 },
  C: { points: 7, min: 60 },
  D: { points: 6, min: 50 },
  E: { points: 5, min: 40 },
  F: { points: 0, min: 0 }
};

// Risk Levels
const RISK_LEVELS = {
  SAFE: 'SAFE',
  NEEDS_ATTENTION: 'NEEDS_ATTENTION',
  AT_RISK: 'AT_RISK'
};

// Prediction Types
const PREDICTION_TYPES = {
  SUBJECT: 'SUBJECT',
  SEMESTER: 'SEMESTER'
};

// Departments
const DEPARTMENTS = {
  CS: 'Computer Science',
  EC: 'Electronics & Communication',
  ME: 'Mechanical Engineering',
  CV: 'Civil Engineering',
  EE: 'Electrical Engineering',
  IS: 'Information Science',
  TE: 'Telecommunication Engineering'
};

// USN Parsing Constants
const USN_PATTERNS = {
  COLLEGE_CODE: '2KA',
  YEAR_DIGITS: 2,
  DEPT_DIGITS: 2,
  SERIAL_DIGITS: 3,
  REGULAR_RANGE: { min: 1, max: 399 },
  LATERAL_RANGE: { min: 400, max: 490 }
};

// Assessment Constants
const ASSESSMENT_CONSTANTS = {
  INTERNAL_MAX_MARKS: 25,
  ASSIGNMENT_MAX_MARKS: 20,
  LAB_MAX_MARKS: 10,
  BEHAVIOR_MAX_SCORE: 10,
  FINAL_EXAM_MAX_MARKS: 100,
  MIN_ATTENDANCE_PERCENTAGE: 75
};

module.exports = {
  USER_ROLES,
  ENTRY_TYPES,
  SUBJECT_TYPES,
  GRADES,
  RISK_LEVELS,
  PREDICTION_TYPES,
  DEPARTMENTS,
  USN_PATTERNS,
  ASSESSMENT_CONSTANTS
};