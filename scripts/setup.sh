#!/bin/bash

# MentorTrack AI - Complete Setup Script
echo "🚀 Setting up MentorTrack AI - Academic Mentoring & Performance Tracking Platform"
echo "=================================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p uploads
mkdir -p nginx/ssl

# Build and start services
echo "🐳 Building and starting Docker containers..."
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check if MongoDB is ready
echo "🔍 Checking MongoDB connection..."
until docker-compose exec -T mongodb mongosh --eval "print('MongoDB is ready')" > /dev/null 2>&1; do
    echo "Waiting for MongoDB..."
    sleep 5
done

# Seed the database
echo "🌱 Seeding database with sample data..."
docker-compose exec -T backend npm run seed

# Display service status
echo ""
echo "🎉 MentorTrack AI setup completed successfully!"
echo "=================================================================="
echo "📊 Service URLs:"
echo "   • Web Application: http://localhost:3000"
echo "   • Backend API: http://localhost:5000"
echo "   • AI Service: http://localhost:8000"
echo "   • MongoDB: mongodb://localhost:27017"
echo "   • Redis: redis://localhost:6379"
echo ""
echo "👥 Default Login Credentials:"
echo "   • HOD (CS): hod.cs@college.edu / password123"
echo "   • Mentor: mentor1@college.edu / password123"
echo "   • Teacher: teacher1@college.edu / password123"
echo "   • Student: student1@college.edu / password123"
echo ""
echo "🔧 Useful Commands:"
echo "   • View logs: docker-compose logs -f [service-name]"
echo "   • Stop services: docker-compose down"
echo "   • Restart services: docker-compose restart"
echo "   • Seed database: docker-compose exec backend npm run seed"
echo ""
echo "📚 Documentation: Check the docs/ folder for detailed guides"
echo "=================================================================="