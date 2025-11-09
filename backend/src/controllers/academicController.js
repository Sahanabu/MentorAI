const academicService = require('../services/academicService');
const Scheme = require('../models/Scheme');
const Subject = require('../models/Subject');

class AcademicController {
  // Get schemes
  async getSchemes(req, res, next) {
    try {
      const { department, year } = req.query;
      
      let query = { isActive: true };
      if (department) query.department = department.toUpperCase();
      if (year) query.schemeYear = parseInt(year);

      const schemes = await Scheme.find(query).sort({ schemeYear: -1 });
      
      res.json({
        success: true,
        data: schemes
      });
    } catch (error) {
      next(error);
    }
  }

  // Create scheme (HOD only)
  async createScheme(req, res, next) {
    try {
      const scheme = new Scheme(req.body);
      await scheme.save();

      res.status(201).json({
        success: true,
        message: 'Scheme created successfully',
        data: scheme
      });
    } catch (error) {
      next(error);
    }
  }

  // Get scheme by ID
  async getSchemeById(req, res, next) {
    try {
      const scheme = await Scheme.findById(req.params.schemeId);
      if (!scheme) {
        return res.status(404).json({
          success: false,
          message: 'Scheme not found'
        });
      }

      res.json({
        success: true,
        data: scheme
      });
    } catch (error) {
      next(error);
    }
  }

  // Update scheme (HOD only)
  async updateScheme(req, res, next) {
    try {
      const scheme = await Scheme.findByIdAndUpdate(
        req.params.schemeId,
        req.body,
        { new: true, runValidators: true }
      );

      if (!scheme) {
        return res.status(404).json({
          success: false,
          message: 'Scheme not found'
        });
      }

      res.json({
        success: true,
        message: 'Scheme updated successfully',
        data: scheme
      });
    } catch (error) {
      next(error);
    }
  }

  // Get subjects
  async getSubjects(req, res, next) {
    try {
      const { department, semester, schemeYear, teacherId } = req.query;
      
      let query = { isActive: true };
      if (department) query.department = department.toUpperCase();
      if (semester) query.semester = parseInt(semester);
      if (schemeYear) query.schemeYear = parseInt(schemeYear);
      if (teacherId) query.teacherId = teacherId;

      const subjects = await Subject.find(query)
        .populate('teacherId', 'profile.firstName profile.lastName')
        .sort({ semester: 1, subjectCode: 1 });

      res.json({
        success: true,
        data: subjects
      });
    } catch (error) {
      next(error);
    }
  }

  // Create subject (HOD only)
  async createSubject(req, res, next) {
    try {
      const subject = new Subject(req.body);
      await subject.save();

      res.status(201).json({
        success: true,
        message: 'Subject created successfully',
        data: subject
      });
    } catch (error) {
      next(error);
    }
  }

  // Get subject by ID
  async getSubjectById(req, res, next) {
    try {
      const subject = await Subject.findById(req.params.subjectId)
        .populate('teacherId', 'profile.firstName profile.lastName');
      
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        });
      }

      res.json({
        success: true,
        data: subject
      });
    } catch (error) {
      next(error);
    }
  }

  // Update subject
  async updateSubject(req, res, next) {
    try {
      const subject = await Subject.findByIdAndUpdate(
        req.params.subjectId,
        req.body,
        { new: true, runValidators: true }
      ).populate('teacherId', 'profile.firstName profile.lastName');

      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        });
      }

      res.json({
        success: true,
        message: 'Subject updated successfully',
        data: subject
      });
    } catch (error) {
      next(error);
    }
  }

  // Get student subjects
  async getStudentSubjects(req, res, next) {
    try {
      const { studentId } = req.params;
      const { semester } = req.query;

      const result = await academicService.assignSubjectsToStudent(
        studentId, 
        semester ? parseInt(semester) : undefined
      );

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  // Get student semester performance
  async getStudentSemesterPerformance(req, res, next) {
    try {
      const { studentId } = req.params;
      const { semester } = req.query;

      if (!semester) {
        return res.status(400).json({
          success: false,
          message: 'Semester is required'
        });
      }

      const performance = await academicService.getStudentSemesterPerformance(
        studentId,
        parseInt(semester)
      );

      res.json({
        success: true,
        data: performance
      });
    } catch (error) {
      next(error);
    }
  }

  // Update student progress
  async updateStudentProgress(req, res, next) {
    try {
      const { studentId } = req.params;
      
      const progress = await academicService.updateStudentProgress(studentId);

      res.json({
        success: true,
        message: 'Student progress updated successfully',
        data: progress
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AcademicController();