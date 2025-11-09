const { USER_ROLES } = require('../config/constants');

/**
 * Role-based access control middleware
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

/**
 * Check if user is HOD
 */
const requireHOD = requireRole(USER_ROLES.HOD);

/**
 * Check if user is Mentor
 */
const requireMentor = requireRole(USER_ROLES.MENTOR);

/**
 * Check if user is Teacher (includes HOD and Mentor)
 */
const requireTeacher = requireRole(USER_ROLES.HOD, USER_ROLES.MENTOR, USER_ROLES.TEACHER);

/**
 * Check if user is Student
 */
const requireStudent = requireRole(USER_ROLES.STUDENT);

/**
 * Check if user is HOD or Mentor
 */
const requireHODOrMentor = requireRole(USER_ROLES.HOD, USER_ROLES.MENTOR);

/**
 * Check if user is Teacher or Mentor
 */
const requireTeacherOrMentor = requireRole(USER_ROLES.TEACHER, USER_ROLES.MENTOR, USER_ROLES.HOD);

/**
 * Check if user can access student data
 * - Students can access their own data
 * - Teachers can access their students' data
 * - Mentors can access their mentees' data
 * - HOD can access all students in their department
 */
const canAccessStudentData = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { userId, role, department } = req.user;

    // HOD can access all students in their department
    if (role === USER_ROLES.HOD) {
      return next();
    }

    // Students can only access their own data
    if (role === USER_ROLES.STUDENT) {
      if (studentId && studentId !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only access your own data'
        });
      }
      return next();
    }

    // For mentors and teachers, additional checks would be needed
    // This would require checking mentor assignments and subject teachings
    // For now, allow access for mentors and teachers
    if (role === USER_ROLES.MENTOR || role === USER_ROLES.TEACHER) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Insufficient permissions'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Permission check failed',
      error: error.message
    });
  }
};

/**
 * Check if user belongs to the same department
 */
const requireSameDepartment = (req, res, next) => {
  const { department: userDepartment } = req.user;
  const { department: targetDepartment } = req.params;

  if (targetDepartment && userDepartment !== targetDepartment) {
    return res.status(403).json({
      success: false,
      message: 'You can only access data from your department'
    });
  }

  next();
};

/**
 * Check if user can modify assessment data
 */
const canModifyAssessment = (req, res, next) => {
  const { role } = req.user;

  // Only teachers, mentors, and HOD can modify assessments
  if (![USER_ROLES.TEACHER, USER_ROLES.MENTOR, USER_ROLES.HOD].includes(role)) {
    return res.status(403).json({
      success: false,
      message: 'Only teachers can modify assessment data'
    });
  }

  next();
};

module.exports = {
  requireRole,
  requireHOD,
  requireMentor,
  requireTeacher,
  requireStudent,
  requireHODOrMentor,
  requireTeacherOrMentor,
  canAccessStudentData,
  requireSameDepartment,
  canModifyAssessment
};