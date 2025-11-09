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

- **Frontend**: React.js + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express.js + MongoDB
- **AI Service**: Python + FastAPI + scikit-learn
- **Database**: MongoDB Atlas
- **Deployment**: Docker + Nginx

## 📋 Prerequisites

- Node.js 18+
- Python 3.9+
- MongoDB 5.0+
- Docker & Docker Compose
- Git

## 🛠️ Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd mentortrack-ai-web
```

2. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start with Docker Compose**
```bash
docker-compose up -d
```

4. **Access the application**
- Web App: http://localhost:3000
- API: http://localhost:5000
- AI Service: http://localhost:8000

## 📁 Project Structure

```
mentortrack-ai-web/
├── backend/          # Node.js Express API
├── ai-service/       # Python FastAPI AI Service
├── web-app/          # React.js Web Application
├── nginx/            # Nginx Configuration
├── shared/           # Shared utilities
└── docs/             # Documentation
```

## 🔧 Development

### Backend Development
```bash
cd backend
npm install
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

## 🧪 Testing

```bash
# Run all tests
npm run test:all

# Backend tests
cd backend && npm test

# AI service tests
cd ai-service && pytest

# Web app tests
cd web-app && npm test
```

## 📚 Documentation

- [API Documentation](docs/api/)
- [User Guides](docs/user-guides/)
- [Deployment Guide](docs/deployment/)
- [Development Guide](docs/development/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.