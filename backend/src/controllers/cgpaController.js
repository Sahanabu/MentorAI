const CGPAService = require('../services/cgpaService');

class CGPAController {
  // Add semester result
  async addSemesterResult(req, res, next) {
    try {
      const { studentId } = req.params;
      const semesterData = req.body;

      const result = await CGPAService.addSemesterResult(studentId, semesterData);

      res.json({
        success: true,
        message: 'Semester result added successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Get student academic summary
  async getAcademicSummary(req, res, next) {
    try {
      const { studentId } = req.params;

      const summary = await CGPAService.getAcademicSummary(studentId);

      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }

  // Calculate CGPA
  async calculateCGPA(req, res, next) {
    try {
      const { studentId } = req.params;

      const cgpa = await CGPAService.calculateCGPA(studentId);

      res.json({
        success: true,
        data: { cgpa }
      });
    } catch (error) {
      next(error);
    }
  }

  // Mark student as graduated
  async markAsGraduated(req, res, next) {
    try {
      const { studentId } = req.params;

      const isGraduated = await CGPAService.markAsGraduated(studentId);

      res.json({
        success: true,
        message: isGraduated ? 'Student marked as graduated' : 'Student not eligible for graduation',
        data: { isGraduated }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current students
  async getCurrentStudents(req, res, next) {
    try {
      const { department } = req.query;

      const students = await CGPAService.getCurrentStudents(department);

      res.json({
        success: true,
        data: students,
        count: students.length
      });
    } catch (error) {
      next(error);
    }
  }

  // Get graduated students
  async getGraduatedStudents(req, res, next) {
    try {
      const { department } = req.query;

      const students = await CGPAService.getGraduatedStudents(department);

      res.json({
        success: true,
        data: students,
        count: students.length
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CGPAController();