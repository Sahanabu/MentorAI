const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Scheme = require('../models/Scheme');
const SemesterResult = require('../models/SemesterResult');
const CGPAService = require('../services/cgpaService');

class RealDataSeeder {
  async seedAll() {
    try {
      console.log('🌱 Starting real data seeding...');
      
      // Clear existing data
      await this.clearData();
      
      // Seed in order
      await this.seedHOD();
      await this.seedTeachers();
      await this.seedSubjects();
      await this.seedStudents();
      await this.seedSampleAcademicData();
      
      console.log('✅ Real data seeding completed successfully!');
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      throw error;
    }
  }

  async clearData() {
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Subject.deleteMany({});
    await Scheme.deleteMany({});
    await SemesterResult.deleteMany({});
    
    // Clear other collections if they exist
    const collections = ['assessments', 'backlogs', 'predictions', 'mentorassignments', 'attendances'];
    for (const collection of collections) {
      try {
        await mongoose.connection.db.collection(collection).deleteMany({});
      } catch (error) {
        // Collection might not exist, ignore error
      }
    }
    console.log('✅ All existing data cleared');
  }

  async seedHOD() {
    console.log('👨‍💼 Creating HOD...');
    
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const hod = new User({
      email: 'arun.kumbi@college.edu',
      password: hashedPassword,
      role: 'HOD',
      profile: {
        firstName: 'Dr. Arun',
        lastName: 'Kumbi'
      },
      department: 'CS',
      isActive: true,
      profileCompleted: true
    });
    
    await hod.save();
    console.log('✅ HOD created');
  }

  async seedTeachers() {
    console.log('👩‍🏫 Creating teachers...');
    
    const teachers = [
      { name: 'Dr. Arun Kumbi', email: 'arun.kumbi@college.edu' },
      { name: 'Dr. Arunkumar Joshi', email: 'arunkumar.joshi@college.edu' },
      { name: 'Mr. Prakash Hongal', email: 'prakash.hongal@college.edu' },
      { name: 'Mr. Shrikanth Jogar', email: 'shrikanth.jogar@college.edu' },
      { name: 'Mr. Nagraj Bardeli', email: 'nagraj.bardeli@college.edu' },
      { name: 'Mr. Aneel Narayanpur', email: 'aneel.narayanpur@college.edu' },
      { name: 'Mr. Basavarj Muragod', email: 'basavarj.muragod@college.edu' },
      { name: 'Mr. Shrikant Malligwad', email: 'shrikant.malligwad@college.edu' },
      { name: 'Miss Rajeshwari G', email: 'rajeshwari.g@college.edu' },
      { name: 'Miss Sahana B', email: 'sahana.b@college.edu' },
      { name: 'Mr. Kartik Kulkarni', email: 'kartik.kulkarni@college.edu' },
      { name: 'Mr. Jagadish Kotagi', email: 'jagadish.kotagi@college.edu' }
    ];

    const hashedPassword = await bcrypt.hash('password123', 10);

    for (const teacher of teachers) {
      const [firstName, ...lastNameParts] = teacher.name.split(' ');
      
      const user = new User({
        email: teacher.email,
        password: hashedPassword,
        role: Math.random() > 0.5 ? 'MENTOR' : 'TEACHER', // Randomly assign some as mentors
        profile: {
          firstName,
          lastName: lastNameParts.join(' ')
        },
        department: 'CS',
        teacherInfo: {
          employeeId: `EMP${Math.floor(Math.random() * 9000) + 1000}`,
          specialization: ['Computer Science', 'Software Engineering']
        },
        isActive: true,
        profileCompleted: true
      });
      
      await user.save();
    }
    
    console.log(`✅ ${teachers.length} teachers created`);
  }

  async seedSubjects() {
    console.log('📚 Creating subjects...');
    
    const subjects = [
      // 1st Semester
      { code: 'CS101', name: 'Programming in C', semester: 1, credits: 4 },
      { code: 'MA101', name: 'Engineering Mathematics I', semester: 1, credits: 4 },
      { code: 'PH101', name: 'Engineering Physics', semester: 1, credits: 3 },
      { code: 'CH101', name: 'Engineering Chemistry', semester: 1, credits: 3 },
      { code: 'ME101', name: 'Engineering Graphics', semester: 1, credits: 3 },
      
      // 2nd Semester
      { code: 'CS201', name: 'Data Structures', semester: 2, credits: 4 },
      { code: 'MA201', name: 'Engineering Mathematics II', semester: 2, credits: 4 },
      { code: 'EC201', name: 'Basic Electronics', semester: 2, credits: 3 },
      { code: 'CS202', name: 'Digital Logic Design', semester: 2, credits: 3 },
      { code: 'EN201', name: 'Technical Communication', semester: 2, credits: 2 },
      
      // 3rd Semester
      { code: 'CS301', name: 'Object Oriented Programming', semester: 3, credits: 4 },
      { code: 'CS302', name: 'Computer Organization', semester: 3, credits: 4 },
      { code: 'MA301', name: 'Discrete Mathematics', semester: 3, credits: 3 },
      { code: 'CS303', name: 'Database Management Systems', semester: 3, credits: 4 },
      { code: 'CS304', name: 'Operating Systems', semester: 3, credits: 4 },
      
      // 4th Semester
      { code: 'CS401', name: 'Design and Analysis of Algorithms', semester: 4, credits: 4 },
      { code: 'CS402', name: 'Computer Networks', semester: 4, credits: 4 },
      { code: 'CS403', name: 'Software Engineering', semester: 4, credits: 3 },
      { code: 'CS404', name: 'Web Technologies', semester: 4, credits: 3 },
      { code: 'MA401', name: 'Probability and Statistics', semester: 4, credits: 3 },
      
      // 5th Semester
      { code: 'CS501', name: 'Machine Learning', semester: 5, credits: 4 },
      { code: 'CS502', name: 'Compiler Design', semester: 5, credits: 4 },
      { code: 'CS503', name: 'Computer Graphics', semester: 5, credits: 3 },
      { code: 'CS504', name: 'Information Security', semester: 5, credits: 3 },
      { code: 'CS505', name: 'Mobile Application Development', semester: 5, credits: 3 }
    ];

    for (const subject of subjects) {
      const subjectDoc = new Subject({
        subjectCode: subject.code,
        subjectName: subject.name,
        credits: subject.credits,
        semester: subject.semester,
        department: 'CS',
        subjectType: 'THEORY',
        isActive: true
      });
      
      await subjectDoc.save();
    }
    
    console.log(`✅ ${subjects.length} subjects created`);
  }

  async seedStudents() {
    console.log('👨‍🎓 Creating students...');
    
    const students = [
      { usn: '2KA23CS001', name: 'ABHISHEKSINGH' },
      { usn: '2KA23CS002', name: 'AKSHATA HADAPAD' },
      { usn: '2KA23CS003', name: 'ANUSH KANAVI' },
      { usn: '2KA23CS004', name: 'ARCHANA MURADI' },
      { usn: '2KA23CS005', name: 'ARUN N LAMANI' },
      { usn: '2KA23CS006', name: 'ARUNDHATI NEKAR' },
      { usn: '2KA23CS007', name: 'BHOOMIKA KAMANNAVAR' },
      { usn: '2KA23CS008', name: 'CHETANKUMAR KORI' },
      { usn: '2KA23CS009', name: 'CHINMAYI S KULAKARNI' },
      { usn: '2KA23CS010', name: 'GANESH M BANNIMATTI' },
      { usn: '2KA23CS011', name: 'GOVINDARADDI H H' },
      { usn: '2KA23CS012', name: 'ISHWARI M KOTAGI' },
      { usn: '2KA23CS013', name: 'KALAL DAVAL NARAYAN' },
      { usn: '2KA23CS014', name: 'KAVYA M ANGADI' },
      { usn: '2KA23CS015', name: 'KIRAN LAKKANNAVAR' },
      { usn: '2KA23CS016', name: 'LAXMI G METTIN' },
      { usn: '2KA23CS017', name: 'M A AISHWARYA' },
      { usn: '2KA23CS018', name: 'MAHESH YALIGAR' },
      { usn: '2KA23CS019', name: 'MALATESH Y BAGAL' },
      { usn: '2KA23CS020', name: 'MALIK URF M KAIF Y' },
      { usn: '2KA23CS022', name: 'MEGHA M HIREMATH' },
      { usn: '2KA23CS023', name: 'MEGHA RAJAKASA BAKALE' },
      { usn: '2KA23CS024', name: 'MEGHANA M KOTAMBARI' },
      { usn: '2KA23CS025', name: 'MERCY NAIKAR' },
      { usn: '2KA23CS026', name: 'MOHAMMADRIHAN A T' },
      { usn: '2KA23CS027', name: 'N U DARSHITA' },
      { usn: '2KA23CS028', name: 'NIVEDITA D PURAD' },
      { usn: '2KA23CS029', name: 'NIVEDITA MUDIGOUDAR' },
      { usn: '2KA23CS030', name: 'NOUSHAD A NADAF' },
      { usn: '2KA23CS031', name: 'ONKAR S BEVINAKATTI' },
      { usn: '2KA23CS032', name: 'PRAHLAD H JADAR' },
      { usn: '2KA23CS033', name: 'PREETHI U CHEKKI' },
      { usn: '2KA23CS034', name: 'PRIYA PARASHURAM K' },
      { usn: '2KA23CS035', name: 'PURVIKA N HANJAGI' },
      { usn: '2KA23CS036', name: 'PURVITHA S BALLOLLI' },
      { usn: '2KA23CS037', name: 'RAGHAVENDRASING B' },
      { usn: '2KA23CS038', name: 'RAHUL BYAHATTI' },
      { usn: '2KA23CS039', name: 'RAKSHITA G HALAGATTI' },
      { usn: '2KA23CS040', name: 'RAKSHITA N PATIL' },
      { usn: '2KA23CS041', name: 'RAKSHITA RAICHUR' },
      { usn: '2KA23CS042', name: 'RANJITA S M' },
      { usn: '2KA23CS043', name: 'RANJITA TOPANNAVAR' },
      { usn: '2KA23CS044', name: 'RAVI M D' },
      { usn: '2KA23CS045', name: 'REKHA NADUVINAHALLI' },
      { usn: '2KA23CS046', name: 'SAHANA B KALAL' },
      { usn: '2KA23CS047', name: 'SAHANA B ULLAGADDI' },
      { usn: '2KA23CS048', name: 'SANJANA PATIL' },
      { usn: '2KA23CS049', name: 'SHREEGOURI R PATIL' },
      { usn: '2KA23CS050', name: 'SNEHA DAVAGI' },
      { usn: '2KA23CS051', name: 'SNEHA MARABANNAVAR' },
      { usn: '2KA23CS052', name: 'SOURABH DESAI' },
      { usn: '2KA23CS053', name: 'SPANDAN MADAREPPA SATAPUTE' },
      { usn: '2KA23CS054', name: 'SPOORTI KALAKAPPA DYAMPUR' },
      { usn: '2KA23CS055', name: 'SRUSHTI DANAPPA SINDHUR' },
      { usn: '2KA23CS056', name: 'SRUSHTI KALE' },
      { usn: '2KA23CS057', name: 'SWATI MUTTANNAVAR' },
      { usn: '2KA23CS058', name: 'TEJASHWINI TOGATAGERI' },
      { usn: '2KA23CS059', name: 'VIJAYENDRA ARUNKUMAR GOUDAR' },
      { usn: '2KA23CS060', name: 'VINAY RAVI GUDASALAMANI' },
      { usn: '2KA23CS061', name: 'VINAYAKAGOUDA SIDDANAGOUDRA' },
      { usn: '2KA23CS062', name: 'VINEETH GUDUR' },
      { usn: '2KA23CS063', name: 'VINUTA CHIKKOPPA' },
      { usn: '2KA23CS064', name: 'HARISH' },
      { usn: '2KA24CS400', name: 'DANESHWARI' },
      { usn: '2KA24CS401', name: 'NAMRATA' },
      { usn: '2KA24CS402', name: 'SANKETH GANJI' },
      { usn: '2KA24CS403', name: 'SHANKAR' },
      { usn: '2KA24CS404', name: 'SWAYAM' },
      { usn: '2KA24CS405', name: 'YOGITA' }
    ];

    const hashedPassword = await bcrypt.hash('password123', 10);

    for (const student of students) {
      const [firstName, ...lastNameParts] = student.name.split(' ');
      const isLateral = student.usn.includes('24CS4');
      
      const user = new User({
        usn: student.usn,
        email: `temp_${student.usn}@temp.edu`,
        password: hashedPassword,
        role: 'STUDENT',
        profile: {
          firstName,
          lastName: lastNameParts.join(' ') || firstName
        },
        department: 'CS',
        studentInfo: {
          admissionYear: isLateral ? 2024 : 2023,
          entryType: isLateral ? 'LATERAL' : 'REGULAR',
          currentSemester: 5,
          cgpa: Math.random() * 3 + 6.5 // Random CGPA between 6.5-9.5
        },
        isActive: true,
        profileCompleted: false
      });
      
      await user.save();
    }
    
    console.log(`✅ ${students.length} students created`);
  }

  async seedSampleAcademicData() {
    console.log('📊 Creating sample academic data...');
    
    const students = await User.find({ role: 'STUDENT' });
    const subjects = await Subject.find({});
    
    for (const student of students) {
      const isLateral = student.studentInfo.entryType === 'LATERAL';
      const startSem = isLateral ? 3 : 1;
      
      // Create semester results for completed semesters
      for (let sem = startSem; sem < 5; sem++) {
        const semesterSubjects = subjects.filter(s => s.semester === sem);
        const semesterData = {
          semester: sem,
          academicYear: sem <= 2 ? '2023-24' : '2024-25',
          subjects: semesterSubjects.map(subject => {
            const marks = Math.floor(Math.random() * 40) + 60; // 60-100 marks
            const grade = this.getGrade(marks);
            
            return {
              subjectId: subject._id,
              subjectCode: subject.subjectCode,
              subjectName: subject.subjectName,
              credits: subject.credits,
              grade,
              gradePoints: CGPAService.GRADE_POINTS[grade],
              creditPoints: CGPAService.GRADE_POINTS[grade] * subject.credits,
              totalMarks: marks,
              internalMarks: Math.floor(marks * 0.3),
              externalMarks: Math.floor(marks * 0.7)
            };
          })
        };
        
        await CGPAService.addSemesterResult(student._id, semesterData);
      }
    }
    
    console.log('✅ Sample academic data created');
  }

  getGrade(marks) {
    if (marks >= 90) return 'S';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 50) return 'D';
    if (marks >= 40) return 'E';
    return 'F';
  }
}

module.exports = new RealDataSeeder();