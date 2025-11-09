const User = require('../models/User');
const { USER_ROLES, ENTRY_TYPES } = require('../config/constants');

const sampleUsers = [
  // HOD
  {
    email: 'hod.cs@university.edu',
    password: 'password123',
    role: USER_ROLES.HOD,
    profile: {
      firstName: 'Dr. Rajesh',
      lastName: 'Kumar',
      phone: '9876543210'
    },
    department: 'CS'
  },
  {
    email: 'hod.ec@university.edu',
    password: 'password123',
    role: USER_ROLES.HOD,
    profile: {
      firstName: 'Dr. Priya',
      lastName: 'Sharma',
      phone: '9876543211'
    },
    department: 'EC'
  },

  // Mentors
  {
    email: 'mentor.cs@university.edu',
    password: 'password123',
    role: USER_ROLES.MENTOR,
    profile: {
      firstName: 'Prof. Amit',
      lastName: 'Singh',
      phone: '9876543212'
    },
    department: 'CS'
  },
  {
    email: 'mentor.ec@university.edu',
    password: 'password123',
    role: USER_ROLES.MENTOR,
    profile: {
      firstName: 'Prof. Meera',
      lastName: 'Patel',
      phone: '9876543213'
    },
    department: 'EC'
  },

  // Teachers
  {
    email: 'teacher.cs@university.edu',
    password: 'password123',
    role: USER_ROLES.TEACHER,
    profile: {
      firstName: 'Dr. Vikram',
      lastName: 'Gupta',
      phone: '9876543214'
    },
    department: 'CS',
    teacherInfo: {
      employeeId: 'TCS001',
      specialization: ['Data Structures', 'Algorithms', 'Machine Learning']
    }
  },
  {
    email: 'teacher.ec@university.edu',
    password: 'password123',
    role: USER_ROLES.TEACHER,
    profile: {
      firstName: 'Dr. Anjali',
      lastName: 'Verma',
      phone: '9876543215'
    },
    department: 'EC',
    teacherInfo: {
      employeeId: 'TEC001',
      specialization: ['Digital Electronics', 'Microprocessors', 'VLSI Design']
    }
  },

  // Students
  {
    usn: '2KA22CS001',
    email: 'student1.cs@university.edu',
    password: 'password123',
    role: USER_ROLES.STUDENT,
    profile: {
      firstName: 'Rahul',
      lastName: 'Sharma',
      phone: '9876543216'
    },
    department: 'CS',
    studentInfo: {
      admissionYear: 2022,
      entryType: ENTRY_TYPES.REGULAR,
      currentSemester: 4,
      cgpa: 8.5,
      activeBacklogCount: 0
    }
  },
  {
    usn: '2KA22CS002',
    email: 'student2.cs@university.edu',
    password: 'password123',
    role: USER_ROLES.STUDENT,
    profile: {
      firstName: 'Priya',
      lastName: 'Patel',
      phone: '9876543217'
    },
    department: 'CS',
    studentInfo: {
      admissionYear: 2022,
      entryType: ENTRY_TYPES.REGULAR,
      currentSemester: 4,
      cgpa: 7.8,
      activeBacklogCount: 1
    }
  },
  {
    usn: '2KA22EC001',
    email: 'student1.ec@university.edu',
    password: 'password123',
    role: USER_ROLES.STUDENT,
    profile: {
      firstName: 'Arun',
      lastName: 'Kumar',
      phone: '9876543218'
    },
    department: 'EC',
    studentInfo: {
      admissionYear: 2022,
      entryType: ENTRY_TYPES.REGULAR,
      currentSemester: 4,
      cgpa: 8.2,
      activeBacklogCount: 0
    }
  },
  {
    usn: '2KA22EC002',
    email: 'student2.ec@university.edu',
    password: 'password123',
    role: USER_ROLES.STUDENT,
    profile: {
      firstName: 'Sneha',
      lastName: 'Gupta',
      phone: '9876543219'
    },
    department: 'EC',
    studentInfo: {
      admissionYear: 2022,
      entryType: ENTRY_TYPES.REGULAR,
      currentSemester: 4,
      cgpa: 6.9,
      activeBacklogCount: 2
    }
  }
];

async function seedUsers() {
  try {
    console.log('Seeding users...');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create new users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.email} (${user.role})`);
    }

    // Assign mentors to students
    const mentors = createdUsers.filter(u => u.role === USER_ROLES.MENTOR);
    const students = createdUsers.filter(u => u.role === USER_ROLES.STUDENT);

    // Assign mentors based on department
    for (const student of students) {
      const departmentMentor = mentors.find(m => m.department === student.department);
      if (departmentMentor) {
        student.studentInfo.mentorId = departmentMentor._id;
        await student.save();
        console.log(`Assigned mentor ${departmentMentor.email} to student ${student.email}`);
      }
    }

    console.log(`Successfully seeded ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

module.exports = { seedUsers, sampleUsers };
