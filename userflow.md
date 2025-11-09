# MentorTrack AI - User Flow Documentation

## 🎯 System Overview

MentorTrack AI is an academic mentoring and performance tracking platform that uses AI to predict student performance and manage mentoring relationships in educational institutions.

## 🏗️ System Architecture

```
Frontend (React + TypeScript) ↔ Backend (Node.js + Express) ↔ AI Service (Python + FastAPI)
                                        ↓
                                MongoDB Database
```

## 👥 User Roles & Access Levels

### 1. **Student** 
- View personal academic performance
- Track attendance and grades
- See AI-powered risk assessments
- Access mentoring insights

### 2. **Teacher**
- Enter and manage student marks
- View assigned students
- Track class performance

### 3. **Mentor** (Also works as Teacher)
- Monitor assigned mentees
- Identify at-risk students
- Conduct interventions
- Track mentoring effectiveness

### 4. **HOD (Head of Department)**
- Manage entire department
- Assign students to mentors
- View department analytics
- Generate comprehensive reports

---

## 🔐 Authentication Flow

### Login Process
1. **User Access**: Navigate to `http://localhost:3000/login`
2. **Role Selection**: Choose role tab (Student/Teacher/Mentor/HOD)
3. **Credentials**: Enter email and password
4. **Authentication**: JWT token generated and stored in sessionStorage
5. **Redirection**: Automatic redirect to role-specific dashboard

### Default Login Credentials
| Role | Email | Password |
|------|-------|----------|
| HOD (CS) | hod.cs@college.edu | password123 |
| HOD (EC) | hod.ec@college.edu | password123 |
| Mentor | mentor1@college.edu | password123 |
| Teacher | teacher1@college.edu | password123 |
| Student | student1@college.edu | password123 |

---

## 📊 Student User Flow

### 1. **Login & Dashboard Access**
```
Login → Student Dashboard → Performance Overview
```

### 2. **Dashboard Features**
- **Personal Stats**: Current CGPA, Attendance %, Subjects, Backlogs
- **AI Risk Assessment**: Real-time risk level (Low/Medium/High)
- **Performance Trends**: CGPA progression over semesters
- **Subject Breakdown**: Individual subject performance
- **AI Insights**: Personalized recommendations

### 3. **Navigation Options**
- **Performance**: `/student/performance` - Detailed academic analysis
- **Attendance**: `/student/attendance` - Attendance tracking and trends

### 4. **Performance Page Features**
- Subject-wise detailed breakdown
- Assessment history (Internal/Final exams)
- Performance radar charts
- Grade distribution
- AI-powered insights and recommendations
- Downloadable reports

### 5. **Attendance Page Features**
- Overall attendance percentage
- Subject-wise attendance tracking
- Weekly attendance trends
- Low attendance alerts
- Attendance distribution charts

---

## 👨‍🏫 Teacher User Flow

### 1. **Dashboard Access**
```
Login → Teacher Dashboard → Class Overview
```

### 2. **Dashboard Features**
- **Class Statistics**: Total students, average performance
- **Subject Management**: Assigned subjects overview
- **Recent Activities**: Latest marks entry, assessments
- **Performance Analytics**: Class performance trends

### 3. **Marks Entry Process**
```
Marks Entry → Select Subject → Choose Assessment Type → Enter Marks → Save/Submit
```

### 4. **Marks Entry Features** (`/teacher/marks`)
- **Subject Selection**: Choose from assigned subjects
- **Assessment Types**: IA1, IA2, Final Exam
- **Batch Entry**: Enter marks for entire class
- **Validation**: Automatic mark range validation
- **Status Tracking**: Draft/Submitted status
- **Bulk Operations**: Save drafts, submit final marks

### 5. **Student Management** (`/teacher/students`)
- **Student List**: View all students in assigned subjects
- **Performance Overview**: CGPA, attendance, risk levels
- **Contact Information**: Email, phone details
- **Risk Filtering**: Filter by risk levels
- **Quick Actions**: View details, contact students

---

## 👨‍💼 Mentor User Flow

### 1. **Dashboard Access**
```
Login → Mentor Dashboard → Mentee Overview
```

### 2. **Dashboard Features**
- **Mentee Statistics**: Total assigned students, at-risk count
- **Performance Metrics**: Average CGPA, attendance rates
- **Risk Distribution**: Low/Medium/High risk breakdown
- **Recent Interventions**: Latest mentoring activities

### 3. **Student Management** (`/mentor/students`)
- **Assigned Students**: Complete list of mentees
- **Performance Tracking**: Individual student progress
- **Contact Management**: Communication tools
- **Intervention Logging**: Record mentoring sessions

### 4. **At-Risk Student Management** (`/mentor/at-risk`)
- **Critical Alerts**: High-priority students requiring immediate attention
- **Risk Analysis**: Detailed risk factors and predictions
- **Intervention Strategies**: Recommended actions
- **Progress Tracking**: Monitor improvement over time

### 5. **Mentoring Process**
```
Identify At-Risk Student → Analyze Risk Factors → Plan Intervention → 
Execute Mentoring → Log Session → Monitor Progress → Follow-up
```

---

## 👨‍💼 HOD User Flow

### 1. **Dashboard Access**
```
Login → HOD Dashboard → Department Overview
```

### 2. **Dashboard Features**
- **Department Stats**: Total students, faculty, subjects
- **Performance Metrics**: Department CGPA, pass rates
- **Risk Analytics**: Department-wide risk assessment
- **AI Insights**: Predictive analytics and trends

### 3. **Department Management** (`/hod/department`)
- **Faculty Workload**: Teacher-student distribution
- **Subject Performance**: Subject-wise analytics
- **Placement Trends**: Yearly placement statistics
- **Resource Management**: Faculty and subject allocation

### 4. **Mentor Assignment Process** (`/hod/mentor-assignment`)
```
View Unassigned Students → Select Distribution Parameters → 
Auto-Distribute OR Manual Assignment → Review Assignments → Confirm
```

#### Auto-Distribution Features:
- **Even Distribution**: Automatically balance student load
- **Semester Filtering**: Assign by specific semester
- **Capacity Limits**: Set max students per mentor
- **Department Scope**: Only within same department
- **Real-time Updates**: Immediate assignment reflection

#### Manual Assignment Features:
- **Individual Assignment**: Assign specific students to mentors
- **Reassignment**: Move students between mentors
- **Bulk Operations**: Assign multiple students at once
- **Assignment History**: Track assignment changes

### 5. **Advanced Analytics** (`/hod/analytics`)
- **Performance Trends**: Multi-semester analysis
- **Predictive Metrics**: AI-powered forecasting
- **Risk Correlation**: Attendance-performance relationships
- **Placement Analytics**: Career outcome tracking
- **Cohort Analysis**: Batch-wise performance comparison

---

## 🤖 AI Integration Flow

### 1. **Data Collection**
```
Student Data → Assessment Records → Attendance → Behavior Scores → AI Features
```

### 2. **AI Processing**
- **Feature Extraction**: Convert raw data to ML features
- **Model Prediction**: Risk assessment and performance prediction
- **Confidence Scoring**: Prediction reliability metrics
- **Explanation Generation**: Feature importance analysis

### 3. **AI Outputs**
- **Risk Levels**: SAFE, NEEDS_ATTENTION, AT_RISK
- **Performance Predictions**: Expected scores and SGPA
- **Intervention Recommendations**: Personalized suggestions
- **Trend Analysis**: Performance trajectory forecasting

### 4. **AI Service Endpoints**
- `POST /predict/semester` - Generate semester predictions
- `GET /analytics/department/{dept}` - Department analytics
- `POST /batch-predict` - Bulk prediction generation

---

## 📊 Data Flow Architecture

### 1. **User Authentication**
```
Login Request → JWT Generation → Token Storage → Role-based Routing
```

### 2. **Dashboard Data Loading**
```
Dashboard Request → Database Query → AI Service Call → Data Aggregation → UI Rendering
```

### 3. **Marks Entry Flow**
```
Teacher Input → Validation → Database Storage → AI Feature Update → Prediction Refresh
```

### 4. **Mentor Assignment Flow**
```
HOD Action → Student Query → Mentor Availability → Distribution Algorithm → Database Update
```

### 5. **AI Prediction Flow**
```
Student Data → Feature Engineering → ML Model → Prediction Storage → Dashboard Display
```

---

## 🔄 Key System Processes

### 1. **Student Performance Tracking**
- Continuous assessment data collection
- Real-time risk assessment updates
- Automated alert generation for at-risk students
- Performance trend analysis

### 2. **Mentoring Workflow**
- Automated student-mentor assignment
- Risk-based prioritization
- Intervention tracking and effectiveness measurement
- Progress monitoring and reporting

### 3. **Academic Management**
- Marks entry and validation
- Attendance tracking
- Backlog management
- Academic scheme compliance

### 4. **Predictive Analytics**
- Performance prediction models
- Risk assessment algorithms
- Intervention recommendation engine
- Outcome forecasting

---

## 🛠️ Technical Implementation

### Frontend (React + TypeScript)
- **Components**: Reusable UI components with Shadcn/ui
- **State Management**: Redux for global state
- **Routing**: React Router for navigation
- **API Integration**: Axios for backend communication
- **Charts**: Recharts for data visualization

### Backend (Node.js + Express)
- **Authentication**: JWT-based auth with role-based access
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis for session management
- **API Design**: RESTful endpoints with proper error handling
- **Security**: Input validation, rate limiting, CORS protection

### AI Service (Python + FastAPI)
- **ML Models**: Scikit-learn for predictions
- **Feature Engineering**: Automated data preprocessing
- **Model Serving**: FastAPI for real-time predictions
- **Explainability**: SHAP for model interpretability

### Database Schema
- **Users**: Student, Teacher, Mentor, HOD profiles
- **Assessments**: Marks, attendance, behavior scores
- **Predictions**: AI model outputs and explanations
- **Assignments**: Mentor-student relationships
- **Academic**: Subjects, schemes, backlogs

---

## 🚀 Getting Started

### 1. **System Setup**
```bash
# Clone repository
git clone <repository-url>
cd MentorAI

# Run setup script
./scripts/setup.sh  # Linux/Mac
scripts\setup.bat   # Windows
```

### 2. **Access Points**
- **Web App**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:8000
- **Database**: mongodb://localhost:27017

### 3. **First Login**
1. Navigate to http://localhost:3000/login
2. Select role tab (Student/Teacher/Mentor/HOD)
3. Use default credentials (password: password123)
4. Explore role-specific features

### 4. **Data Seeding**
```bash
# Seed sample data
cd backend
npm run seed
```

---

## 📈 Key Features Summary

### ✅ **Implemented Features**
- Role-based authentication and dashboards
- Student performance tracking and analytics
- AI-powered risk assessment and predictions
- Mentor-student assignment system
- Marks entry and attendance management
- Comprehensive reporting and analytics
- Real-time data visualization

### 🔄 **AI Integration Status**
- ✅ Prediction models and storage
- ✅ Risk assessment algorithms
- ✅ Feature engineering pipeline
- ⚠️ Partial real-time integration (fallback data used)
- ⚠️ Manual prediction generation

### 🎯 **Business Value**
- **Early Risk Detection**: Identify struggling students proactively
- **Personalized Mentoring**: Data-driven intervention strategies
- **Performance Optimization**: Continuous improvement tracking
- **Resource Management**: Efficient mentor-student allocation
- **Predictive Insights**: Forecast academic outcomes

---

## 🔧 Troubleshooting

### Common Issues
1. **Login Issues**: Check credentials and ensure backend is running
2. **Data Loading**: Verify database connection and seeded data
3. **AI Predictions**: Ensure AI service is running on port 8000
4. **Chart Errors**: Check data structure and component props

### Support
- Check logs in browser console and backend terminal
- Verify all services are running (frontend, backend, AI service)
- Ensure database is properly seeded with sample data
- Review API responses for error details

---

*This documentation provides a comprehensive overview of the MentorTrack AI system. For technical details, refer to the codebase and API documentation.*