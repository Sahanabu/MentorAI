const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const Prediction = require('../models/Prediction');

class ExportController {
  async exportAnalytics(req, res, next) {
    try {
      const { type } = req.params;
      const { format = 'pdf' } = req.query;
      const { department, role } = req.user;

      let data;
      switch (type) {
        case 'student-performance':
          data = await this.getStudentPerformanceData(department);
          break;
        case 'department-analytics':
          data = await this.getDepartmentAnalyticsData(department);
          break;
        case 'risk-assessment':
          data = await this.getRiskAssessmentData(department);
          break;
        default:
          data = await this.getGeneralAnalyticsData(department);
      }

      if (format === 'pdf') {
        await this.generatePDF(res, type, data);
      } else if (format === 'excel') {
        await this.generateExcel(res, type, data);
      } else {
        res.status(400).json({
          success: false,
          message: 'Unsupported format. Use pdf or excel.'
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getStudentPerformanceData(department) {
    const students = await User.find({
      role: 'STUDENT',
      department
    }).populate('studentInfo');

    const assessments = await Assessment.find({
      studentId: { $in: students.map(s => s._id) }
    }).populate('studentId subjectId');

    return {
      students,
      assessments,
      summary: {
        totalStudents: students.length,
        avgCGPA: students.reduce((sum, s) => sum + (s.studentInfo?.cgpa || 0), 0) / students.length,
        avgAttendance: assessments.reduce((sum, a) => sum + (a.attendance?.percentage || 0), 0) / assessments.length
      }
    };
  }

  async getDepartmentAnalyticsData(department) {
    const students = await User.find({ role: 'STUDENT', department });
    const mentors = await User.find({ role: 'MENTOR', department });
    const teachers = await User.find({ role: 'TEACHER', department });
    
    const predictions = await Prediction.find({
      studentId: { $in: students.map(s => s._id) }
    }).populate('studentId');

    const riskDistribution = predictions.reduce((acc, p) => {
      const risk = p.prediction?.riskLevel || 'SAFE';
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, {});

    return {
      students,
      mentors,
      teachers,
      predictions,
      riskDistribution,
      summary: {
        totalStudents: students.length,
        totalMentors: mentors.length,
        totalTeachers: teachers.length,
        atRiskCount: riskDistribution['AT_RISK'] || 0
      }
    };
  }

  async getRiskAssessmentData(department) {
    const students = await User.find({ role: 'STUDENT', department });
    const predictions = await Prediction.find({
      studentId: { $in: students.map(s => s._id) }
    }).populate('studentId');

    const atRiskStudents = predictions.filter(p => p.prediction?.riskLevel === 'AT_RISK');
    const needsAttention = predictions.filter(p => p.prediction?.riskLevel === 'NEEDS_ATTENTION');

    return {
      atRiskStudents,
      needsAttention,
      summary: {
        totalPredictions: predictions.length,
        atRiskCount: atRiskStudents.length,
        needsAttentionCount: needsAttention.length,
        safeCount: predictions.length - atRiskStudents.length - needsAttention.length
      }
    };
  }

  async getGeneralAnalyticsData(department) {
    return await this.getDepartmentAnalyticsData(department);
  }

  async generatePDF(res, type, data) {
    const doc = new PDFDocument();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-report.pdf"`);
    
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('MentorTrack AI - Analytics Report', 50, 50);
    doc.fontSize(14).text(`Report Type: ${type.replace('-', ' ').toUpperCase()}`, 50, 80);
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 100);
    
    let yPosition = 140;

    // Summary Section
    doc.fontSize(16).text('Summary', 50, yPosition);
    yPosition += 30;

    if (data.summary) {
      Object.entries(data.summary).forEach(([key, value]) => {
        doc.fontSize(12).text(`${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`, 70, yPosition);
        yPosition += 20;
      });
    }

    yPosition += 20;

    // Risk Distribution (if available)
    if (data.riskDistribution) {
      doc.fontSize(16).text('Risk Distribution', 50, yPosition);
      yPosition += 30;
      
      Object.entries(data.riskDistribution).forEach(([risk, count]) => {
        doc.fontSize(12).text(`${risk}: ${count} students`, 70, yPosition);
        yPosition += 20;
      });
    }

    // At-Risk Students (if available)
    if (data.atRiskStudents && data.atRiskStudents.length > 0) {
      yPosition += 20;
      doc.fontSize(16).text('At-Risk Students', 50, yPosition);
      yPosition += 30;
      
      data.atRiskStudents.slice(0, 10).forEach((prediction) => {
        const student = prediction.studentId;
        doc.fontSize(10).text(
          `${student.profile?.firstName} ${student.profile?.lastName} (${student.usn}) - Confidence: ${(prediction.prediction?.confidence * 100).toFixed(1)}%`,
          70, yPosition
        );
        yPosition += 15;
      });
    }

    doc.end();
  }

  async generateExcel(res, type, data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Analytics Report');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-report.xlsx"`);

    // Header
    worksheet.addRow(['MentorTrack AI - Analytics Report']);
    worksheet.addRow([`Report Type: ${type.replace('-', ' ').toUpperCase()}`]);
    worksheet.addRow([`Generated on: ${new Date().toLocaleDateString()}`]);
    worksheet.addRow([]);

    // Summary
    if (data.summary) {
      worksheet.addRow(['Summary']);
      Object.entries(data.summary).forEach(([key, value]) => {
        worksheet.addRow([key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), value]);
      });
      worksheet.addRow([]);
    }

    // Students data
    if (data.students && data.students.length > 0) {
      worksheet.addRow(['Student Details']);
      worksheet.addRow(['USN', 'Name', 'CGPA', 'Semester', 'Department']);
      
      data.students.forEach(student => {
        worksheet.addRow([
          student.usn,
          `${student.profile?.firstName} ${student.profile?.lastName}`,
          student.studentInfo?.cgpa || 'N/A',
          student.studentInfo?.currentSemester || 'N/A',
          student.department
        ]);
      });
    }

    await workbook.xlsx.write(res);
    res.end();
  }
}

module.exports = new ExportController();