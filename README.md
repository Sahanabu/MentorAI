# MentorTrack AI - Academic Mentoring & Performance Tracking Platform

A comprehensive web-based academic mentoring and performance tracking platform with AI-powered predictions for educational institutions.

## 🚀 Features

- **Role-based Dashboards**: HOD, Mentor, Teacher, and Student interfaces
- **AI-Powered Predictions**: Subject performance and semester SGPA predictions
- **Dynamic Mentor Assignment**: Automated balanced distribution algorithm
- **Assessment Management**: Internal marks, assignments, attendance tracking
- **Backlog Management**: Automatic tracking and attempt management
- **Real-time Analytics**: Performance insights and risk assessment

## 🏗️ Architecture

- **Frontend**: React.js + TypeScript + Tailwind CSS + Shadcn/ui
- **Backend**: Node.js + Express.js + MongoDB + Redis
- **AI Service**: Python + FastAPI + scikit-learn + SHAP
- **Database**: MongoDB with comprehensive indexing
- **Deployment**: Docker + Nginx + SSL

## 📋 Prerequisites

- Docker & Docker Compose (Recommended)
- OR Manual setup: Node.js 18+, Python 3.9+, MongoDB 5.0+, Redis
- Git

## 🛠️ Quick Start (Docker - Recommended)

1. **Clone the repository**
```bash
git clone <repository-url>
cd MentorAI
```

2. **Run the setup script**
```bash
# Linux/Mac
chmod +x scripts/setup.sh
./scripts/setup.sh

# Windows
scripts\setup.bat
```

3. **Access the application**
- Web App: http://localhost:3000
- Backend API: http://localhost:5000
- AI Service: http://localhost:8000
- MongoDB: mongodb://localhost:27017
- Redis: redis://localhost:6379

## 👥 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| HOD (CS) | hod.cs@college.edu | password123 |
| HOD (EC) | hod.ec@college.edu | password123 |
| Mentor | mentor1@college.edu | password123 |
| Teacher | teacher1@college.edu | password123 |
| Student | student1@college.edu | password123 |

## 📁 Project Structure

```
MentorAI/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── models/            # MongoDB schemas
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth, validation, etc.
│   │   └── seeders/           # Database seeders
│   └── Dockerfile
├── ai-service/                 # Python FastAPI AI Service
│   ├── src/
│   │   ├── models/            # ML models
│   │   ├── api/               # FastAPI routes
│   │   └── services/          # AI logic
│   └── Dockerfile
├── web-app/                    # React.js Web Application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   └── store/             # Redux store
│   └── Dockerfile
├── nginx/                      # Nginx Configuration
├── scripts/                    # Setup scripts
└── docs/                       # Documentation
```

## 🔧 Development Setup

### Backend Development
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB and Redis URLs
npm run dev
```

### AI Service Development
```bash
cd ai-service
pip install -r requirements.txt
python src/main.py
```

### Web App Development
```bash
cd web-app
npm install
npm run dev
```

### Database Seeding
```bash
# Seed with comprehensive sample data
cd backend
npm run seed
```

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# AI service tests
cd ai-service && pytest

# Web app tests
cd web-app && npm test
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose down && docker-compose build --no-cache && docker-compose up -d

# Seed database
docker-compose exec backend npm run seed
```

## 📊 Key Features Implemented

### Backend (Node.js + Express)
- ✅ Complete user authentication & authorization
- ✅ Role-based access control (HOD, Mentor, Teacher, Student)
- ✅ Academic scheme and subject management
- ✅ Assessment tracking (internals, assignments, attendance)
- ✅ Dynamic mentor assignment algorithm
- ✅ Backlog management with attempt tracking
- ✅ Comprehensive analytics and reporting
- ✅ AI service integration

### Frontend (React + TypeScript)
- ✅ Modern UI with Shadcn/ui components
- ✅ Role-specific dashboards
- ✅ Interactive charts and visualizations
- ✅ Responsive design for all devices
- ✅ Real-time data updates
- ✅ Form validation and error handling

### AI Service (Python + FastAPI)
- ✅ Subject performance prediction
- ✅ Semester SGPA prediction
- ✅ Risk assessment and classification
- ✅ Feature importance explanation
- ✅ Batch prediction capabilities

### Database (MongoDB)
- ✅ Comprehensive data models
- ✅ Optimized indexes for performance
- ✅ Data validation and constraints
- ✅ Sample data seeding

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based authorization
- Rate limiting
- CORS protection
- Input validation and sanitization
- Security headers

## 📈 Performance Optimizations

- Database indexing
- Redis caching
- Gzip compression
- Image optimization
- Lazy loading
- Code splitting

## 🌐 Deployment

### Production Deployment
```bash
# Use production docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables
Copy `.env.example` to `.env` and configure:
- Database URLs
- JWT secrets
- CORS origins
- Email configuration
- File upload settings

## 📚 API Documentation

The API follows RESTful conventions with comprehensive endpoints:

- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Academic**: `/api/academic/*`
- **Assessments**: `/api/assessments/*`
- **Mentors**: `/api/mentors/*`
- **Backlogs**: `/api/backlogs/*`
- **Analytics**: `/api/analytics/*`
- **Predictions**: `/api/predictions/*`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation in the `docs/` folder
- Review the system design document: `MentorTrack_AI_System_Design.md`

---

**Built with ❤️ for educational institutions to enhance student mentoring and academic performance tracking.**