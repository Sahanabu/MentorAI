# MentorTrack AI - Web Application File Structure

## Complete Project Directory Structure

```
mentortrack-ai-web/
├── README.md
├── LICENSE
├── .gitignore
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
├── package.json
├── 
├── backend/                              # Node.js Express API Server
│   ├── src/
│   │   ├── app.js                        # Main application entry point
│   │   ├── server.js                     # Server configuration and startup
│   │   ├── 
│   │   ├── config/                       # Configuration files
│   │   │   ├── database.js               # MongoDB connection config
│   │   │   ├── redis.js                  # Redis cache configuration
│   │   │   ├── environment.js            # Environment variables handler
│   │   │   ├── jwt.js                    # JWT configuration
│   │   │   ├── websocket.js              # WebSocket configuration
│   │   │   └── constants.js              # Application constants
│   │   ├── 
│   │   ├── controllers/                  # Request handlers
│   │   │   ├── authController.js         # Authentication endpoints
│   │   │   ├── userController.js         # User management endpoints
│   │   │   ├── academicController.js     # Academic data endpoints
│   │   │   ├── assessmentController.js   # Assessment management
│   │   │   ├── mentorController.js       # Mentor assignment endpoints
│   │   │   ├── backlogController.js      # Backlog management
│   │   │   ├── analyticsController.js    # Analytics and reporting
│   │   │   └── predictionController.js   # AI prediction endpoints
│   │   ├── 
│   │   ├── models/                       # Mongoose schemas
│   │   │   ├── User.js                   # User model with role-based fields
│   │   │   ├── Scheme.js                 # Academic scheme model
│   │   │   ├── Subject.js                # Subject model
│   │   │   ├── Assessment.js             # Assessment model
│   │   │   ├── Backlog.js                # Backlog tracking model
│   │   │   ├── MentorAssignment.js       # Mentor-student mapping
│   │   │   ├── Prediction.js             # AI prediction results
│   │   │   ├── Intervention.js           # Mentor intervention logs
│   │   │   ├── AttendanceRecord.js       # Daily attendance records
│   │   │   ├── Assignment.js             # Assignment details
│   │   │   └── AssignmentSubmission.js   # Student submissions
│   │   ├── 
│   │   ├── services/                     # Business logic layer
│   │   │   ├── authService.js            # Authentication business logic
│   │   │   ├── userService.js            # User management logic
│   │   │   ├── academicService.js        # Academic operations
│   │   │   ├── assessmentService.js      # Assessment calculations
│   │   │   ├── mentorService.js          # Mentor assignment logic
│   │   │   ├── backlogService.js         # Backlog management logic
│   │   │   ├── aiService.js              # AI service integration
│   │   │   ├── analyticsService.js       # Analytics generation
│   │   │   ├── emailService.js           # Email notifications
│   │   │   ├── websocketService.js       # Real-time notifications
│   │   │   └── cacheService.js           # Redis caching operations
│   │   ├── 
│   │   ├── middleware/                   # Express middleware
│   │   │   ├── auth.js                   # JWT authentication middleware
│   │   │   ├── roleCheck.js              # Role-based access control
│   │   │   ├── validation.js             # Request validation middleware
│   │   │   ├── rateLimiter.js            # API rate limiting
│   │   │   ├── errorHandler.js           # Global error handling
│   │   │   ├── cors.js                   # CORS configuration
│   │   │   └── logger.js                 # Request logging middleware
│   │   ├── 
│   │   ├── routes/                       # API route definitions
│   │   │   ├── index.js                  # Main router
│   │   │   ├── auth.js                   # Authentication routes
│   │   │   ├── users.js                  # User management routes
│   │   │   ├── academic.js               # Academic data routes
│   │   │   ├── assessments.js            # Assessment routes
│   │   │   ├── mentors.js                # Mentor management routes
│   │   │   ├── backlogs.js               # Backlog routes
│   │   │   ├── analytics.js              # Analytics routes
│   │   │   └── predictions.js            # AI prediction routes
│   │   ├── 
│   │   ├── utils/                        # Utility functions
│   │   │   ├── usnParser.js              # USN parsing and validation
│   │   │   ├── gradeCalculator.js        # Grade calculation utilities
│   │   │   ├── mentorAssigner.js         # Mentor assignment algorithm
│   │   │   ├── dateHelper.js             # Date manipulation utilities
│   │   │   ├── validators.js             # Data validation functions
│   │   │   ├── encryption.js             # Password hashing utilities
│   │   │   └── responseFormatter.js      # API response formatting
│   │   ├── 
│   │   └── seeders/                      # Database seeding scripts
│   │       ├── userSeeder.js             # Sample users data
│   │       ├── schemeSeeder.js           # Academic schemes data
│   │       ├── subjectSeeder.js          # Subjects data
│   │       └── seedDatabase.js           # Main seeding script
│   ├── 
│   ├── tests/                            # Test suites
│   │   ├── unit/                         # Unit tests
│   │   │   ├── services/
│   │   │   ├── utils/
│   │   │   └── models/
│   │   ├── integration/                  # Integration tests
│   │   │   ├── auth.test.js
│   │   │   ├── academic.test.js
│   │   │   └── assessment.test.js
│   │   ├── e2e/                          # End-to-end tests
│   │   │   └── api.test.js
│   │   └── fixtures/                     # Test data
│   │       ├── users.json
│   │       └── assessments.json
│   ├── 
│   ├── docs/                             # API documentation
│   │   ├── swagger.yml                   # OpenAPI specification
│   │   └── postman/                      # Postman collections
│   │       └── MentorTrack_API.json
│   ├── 
│   ├── package.json                      # Node.js dependencies
│   ├── package-lock.json
│   ├── Dockerfile                        # Docker configuration
│   ├── .dockerignore
│   ├── .env.example                      # Environment variables template
│   └── nodemon.json                      # Development server config
├── 
├── ai-service/                           # Python FastAPI AI Service
│   ├── src/
│   │   ├── main.py                       # FastAPI application entry point
│   │   ├── 
│   │   ├── models/                       # ML models
│   │   │   ├── __init__.py
│   │   │   ├── subject_predictor.py      # Subject performance prediction
│   │   │   ├── sgpa_predictor.py         # Semester SGPA prediction
│   │   │   ├── model_trainer.py          # Model training pipeline
│   │   │   ├── model_evaluator.py        # Model evaluation metrics
│   │   │   └── base_model.py             # Base ML model class
│   │   ├── 
│   │   ├── services/                     # Business logic services
│   │   │   ├── __init__.py
│   │   │   ├── prediction_service.py     # Prediction orchestration
│   │   │   ├── explanation_service.py    # SHAP-based explanations
│   │   │   ├── model_service.py          # Model management
│   │   │   ├── feature_service.py        # Feature engineering
│   │   │   └── validation_service.py     # Input validation
│   │   ├── 
│   │   ├── utils/                        # Utility functions
│   │   │   ├── __init__.py
│   │   │   ├── feature_engineering.py    # Feature transformation
│   │   │   ├── data_preprocessing.py     # Data cleaning and prep
│   │   │   ├── model_evaluation.py       # Model performance metrics
│   │   │   ├── config.py                 # Configuration management
│   │   │   └── logger.py                 # Logging configuration
│   │   ├── 
│   │   ├── api/                          # API route handlers
│   │   │   ├── __init__.py
│   │   │   ├── prediction_routes.py      # Prediction endpoints
│   │   │   ├── model_routes.py           # Model management endpoints
│   │   │   ├── health_routes.py          # Health check endpoints
│   │   │   └── batch_routes.py           # Batch prediction endpoints
│   │   ├── 
│   │   └── schemas/                      # Pydantic data models
│   │       ├── __init__.py
│   │       ├── prediction_schemas.py     # Prediction request/response
│   │       ├── feature_schemas.py        # Feature data models
│   │       └── model_schemas.py          # Model metadata schemas
│   ├── 
│   ├── data/                             # Data storage
│   │   ├── models/                       # Trained model files
│   │   │   ├── subject_predictor_v1.0.pkl
│   │   │   ├── sgpa_predictor_v1.0.pkl
│   │   │   └── feature_scalers.pkl
│   │   ├── training/                     # Training datasets
│   │   │   ├── historical_assessments.csv
│   │   │   ├── student_performance.csv
│   │   │   └── feature_definitions.json
│   │   ├── validation/                   # Validation datasets
│   │   │   └── test_data.csv
│   │   └── logs/                         # Model training logs
│   │       └── training_history.json
│   ├── 
│   ├── notebooks/                        # Jupyter notebooks for analysis
│   │   ├── data_exploration.ipynb        # Exploratory data analysis
│   │   ├── model_development.ipynb       # Model development process
│   │   ├── feature_analysis.ipynb        # Feature importance analysis
│   │   └── model_evaluation.ipynb        # Model performance evaluation
│   ├── 
│   ├── tests/                            # Test suites
│   │   ├── test_models.py                # Model testing
│   │   ├── test_services.py              # Service testing
│   │   ├── test_api.py                   # API endpoint testing
│   │   └── test_data/                    # Test datasets
│   │       └── sample_features.json
│   ├── 
│   ├── requirements.txt                  # Python dependencies
│   ├── requirements-dev.txt              # Development dependencies
│   ├── Dockerfile                        # Docker configuration
│   ├── .env.example                      # Environment variables template
│   └── pytest.ini                       # Pytest configuration
├── 
├── web-app/                              # React.js Web Application
│   ├── public/
│   │   ├── index.html                    # Main HTML template
│   │   ├── favicon.ico                   # App favicon
│   │   ├── manifest.json                 # PWA manifest
│   │   ├── robots.txt                    # SEO robots file
│   │   └── sw.js                         # Service worker for PWA
│   ├── 
│   ├── src/
│   │   ├── App.tsx                       # Main application component
│   │   ├── index.tsx                     # Application entry point
│   │   ├── 
│   │   ├── pages/                        # Page components (route-based)
│   │   │   ├── auth/                     # Authentication pages
│   │   │   │   ├── LoginPage.tsx         # Login page
│   │   │   │   ├── RegisterPage.tsx      # Registration page
│   │   │   │   └── ForgotPasswordPage.tsx
│   │   │   ├── 
│   │   │   ├── hod/                      # HOD role pages
│   │   │   │   ├── HODDashboard.tsx      # HOD main dashboard
│   │   │   │   ├── MentorManagement.tsx  # Mentor assignment interface
│   │   │   │   ├── SchemeManagement.tsx  # Academic scheme management
│   │   │   │   ├── DepartmentAnalytics.tsx # Department performance
│   │   │   │   └── StudentOverview.tsx   # Student overview
│   │   │   ├── 
│   │   │   ├── mentor/                   # Mentor role pages
│   │   │   │   ├── MentorDashboard.tsx   # Mentor main dashboard
│   │   │   │   ├── StudentList.tsx       # Assigned students list
│   │   │   │   ├── RiskAnalysis.tsx      # At-risk students analysis
│   │   │   │   ├── InterventionLog.tsx   # Intervention tracking
│   │   │   │   └── StudentProfile.tsx    # Individual student details
│   │   │   ├── 
│   │   │   ├── teacher/                  # Teacher role pages
│   │   │   │   ├── TeacherDashboard.tsx  # Teacher main dashboard
│   │   │   │   ├── MarksEntry.tsx        # Marks entry interface
│   │   │   │   ├── AttendanceEntry.tsx   # Attendance marking
│   │   │   │   ├── SubjectAnalytics.tsx  # Subject performance analytics
│   │   │   │   └── StudentProgress.tsx   # Student progress tracking
│   │   │   ├── 
│   │   │   └── student/                  # Student role pages
│   │   │       ├── StudentDashboard.tsx  # Student main dashboard
│   │   │       ├── PerformanceInsights.tsx # AI-powered insights
│   │   │       ├── BacklogStatus.tsx     # Backlog tracking
│   │   │       ├── AttendanceView.tsx    # Attendance overview
│   │   │       ├── MarksView.tsx         # Marks and grades view
│   │   │       └── SubjectDetails.tsx    # Individual subject details
│   │   ├── 
│   │   ├── components/                   # Reusable components
│   │   │   ├── layout/                   # Layout components
│   │   │   │   ├── Header.tsx            # App header component
│   │   │   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   │   │   ├── Footer.tsx            # App footer
│   │   │   │   ├── Layout.tsx            # Main layout wrapper
│   │   │   │   ├── Breadcrumb.tsx        # Breadcrumb navigation
│   │   │   │   └── MobileMenu.tsx        # Mobile responsive menu
│   │   │   ├── 
│   │   │   ├── ui/                       # UI components (Shadcn/ui)
│   │   │   │   ├── Button.tsx            # Button component
│   │   │   │   ├── Input.tsx             # Input field component
│   │   │   │   ├── Card.tsx              # Card layout component
│   │   │   │   ├── Modal.tsx             # Modal dialog component
│   │   │   │   ├── Table.tsx             # Data table component
│   │   │   │   ├── Badge.tsx             # Badge component
│   │   │   │   ├── Alert.tsx             # Alert component
│   │   │   │   ├── LoadingSpinner.tsx    # Loading indicator
│   │   │   │   ├── Tooltip.tsx           # Tooltip component
│   │   │   │   ├── Dropdown.tsx          # Dropdown menu
│   │   │   │   ├── Tabs.tsx              # Tab navigation
│   │   │   │   └── Pagination.tsx        # Pagination component
│   │   │   ├── 
│   │   │   ├── charts/                   # Chart components
│   │   │   │   ├── PerformanceChart.tsx  # Performance visualization
│   │   │   │   ├── AttendanceChart.tsx   # Attendance trends
│   │   │   │   ├── TrendChart.tsx        # General trend visualization
│   │   │   │   ├── RiskLevelChart.tsx    # Risk level distribution
│   │   │   │   ├── SGPAChart.tsx         # SGPA progression chart
│   │   │   │   ├── RadarChart.tsx        # Subject performance radar
│   │   │   │   ├── BarChart.tsx          # Bar chart component
│   │   │   │   ├── LineChart.tsx         # Line chart component
│   │   │   │   └── PieChart.tsx          # Pie chart component
│   │   │   ├── 
│   │   │   ├── forms/                    # Form components
│   │   │   │   ├── MarksEntryForm.tsx    # Marks entry form
│   │   │   │   ├── AttendanceForm.tsx    # Attendance form
│   │   │   │   ├── StudentRegistrationForm.tsx # Registration form
│   │   │   │   ├── SubjectForm.tsx       # Subject creation form
│   │   │   │   ├── InterventionForm.tsx  # Intervention logging form
│   │   │   │   ├── SearchForm.tsx        # Search and filter form
│   │   │   │   ├── BulkUploadForm.tsx    # Bulk data upload form
│   │   │   │   └── ExportForm.tsx        # Data export form
│   │   │   ├── 
│   │   │   └── data/                     # Data display components
│   │   │       ├── StudentList.tsx       # Student list component
│   │   │       ├── SubjectList.tsx       # Subject list component
│   │   │       ├── BacklogList.tsx       # Backlog list component
│   │   │       ├── AtRiskList.tsx        # At-risk students list
│   │   │       ├── DataTable.tsx         # Generic data table
│   │   │       ├── StatCard.tsx          # Statistics card component
│   │   │       ├── MetricCard.tsx        # Metric display card
│   │   │       └── ProgressBar.tsx       # Progress indicator
│   │   ├── 
│   │   ├── services/                     # API and external services
│   │   │   ├── api.ts                    # Base API configuration (Axios)
│   │   │   ├── authService.ts            # Authentication API calls
│   │   │   ├── userService.ts            # User management API
│   │   │   ├── academicService.ts        # Academic data API
│   │   │   ├── assessmentService.ts      # Assessment API
│   │   │   ├── mentorService.ts          # Mentor management API
│   │   │   ├── backlogService.ts         # Backlog API
│   │   │   ├── aiService.ts              # AI prediction API
│   │   │   ├── analyticsService.ts       # Analytics API
│   │   │   ├── websocketService.ts       # WebSocket connection
│   │   │   ├── exportService.ts          # Data export service
│   │   │   └── notificationService.ts    # Browser notifications
│   │   ├── 
│   │   ├── store/                        # Redux state management
│   │   │   ├── store.ts                  # Redux store configuration
│   │   │   ├── rootReducer.ts            # Root reducer
│   │   │   ├── middleware.ts             # Custom middleware
│   │   │   ├── 
│   │   │   └── slices/                   # Redux Toolkit slices
│   │   │       ├── authSlice.ts          # Authentication state
│   │   │       ├── userSlice.ts          # User data state
│   │   │       ├── academicSlice.ts      # Academic data state
│   │   │       ├── assessmentSlice.ts    # Assessment state
│   │   │       ├── mentorSlice.ts        # Mentor data state
│   │   │       ├── backlogSlice.ts       # Backlog state
│   │   │       ├── predictionSlice.ts    # AI prediction state
│   │   │       ├── uiSlice.ts            # UI state management
│   │   │       └── notificationSlice.ts  # Notification state
│   │   ├── 
│   │   ├── hooks/                        # Custom React hooks
│   │   │   ├── useAuth.ts                # Authentication hook
│   │   │   ├── useApi.ts                 # API calling hook
│   │   │   ├── usePermissions.ts         # Permission checking hook
│   │   │   ├── useDebounce.ts            # Debouncing hook
│   │   │   ├── useLocalStorage.ts        # Local storage hook
│   │   │   ├── useWebSocket.ts           # WebSocket hook
│   │   │   ├── useResponsive.ts          # Responsive design hook
│   │   │   ├── usePagination.ts          # Pagination hook
│   │   │   ├── useSort.ts                # Sorting hook
│   │   │   └── useFilter.ts              # Filtering hook
│   │   ├── 
│   │   ├── utils/                        # Utility functions
│   │   │   ├── constants.ts              # App constants
│   │   │   ├── helpers.ts                # Helper functions
│   │   │   ├── validators.ts             # Validation functions
│   │   │   ├── formatters.ts             # Data formatting utilities
│   │   │   ├── dateUtils.ts              # Date manipulation utilities
│   │   │   ├── gradeUtils.ts             # Grade calculation utilities
│   │   │   ├── permissions.ts            # Permission checking utilities
│   │   │   ├── exportUtils.ts            # Data export utilities
│   │   │   ├── chartUtils.ts             # Chart configuration utilities
│   │   │   ├── urlUtils.ts               # URL manipulation utilities
│   │   │   └── storageUtils.ts           # Browser storage utilities
│   │   ├── 
│   │   ├── types/                        # TypeScript type definitions
│   │   │   ├── auth.ts                   # Authentication types
│   │   │   ├── user.ts                   # User data types
│   │   │   ├── academic.ts               # Academic data types
│   │   │   ├── assessment.ts             # Assessment types
│   │   │   ├── mentor.ts                 # Mentor types
│   │   │   ├── backlog.ts                # Backlog types
│   │   │   ├── prediction.ts             # AI prediction types
│   │   │   ├── chart.ts                  # Chart data types
│   │   │   ├── api.ts                    # API response types
│   │   │   ├── ui.ts                     # UI component types
│   │   │   └── common.ts                 # Common shared types
│   │   ├── 
│   │   ├── styles/                       # Styling and themes
│   │   │   ├── globals.css               # Global CSS styles
│   │   │   ├── components.css            # Component-specific styles
│   │   │   ├── variables.css             # CSS custom properties
│   │   │   ├── responsive.css            # Responsive design styles
│   │   │   ├── themes.css                # Theme variations
│   │   │   └── animations.css            # CSS animations
│   │   ├── 
│   │   ├── assets/                       # Static assets
│   │   │   ├── images/                   # Image assets
│   │   │   │   ├── logo.svg
│   │   │   │   ├── logo-dark.svg
│   │   │   │   ├── icons/
│   │   │   │   │   ├── dashboard.svg
│   │   │   │   │   ├── students.svg
│   │   │   │   │   ├── analytics.svg
│   │   │   │   │   └── settings.svg
│   │   │   │   ├── backgrounds/
│   │   │   │   └── placeholders/
│   │   │   ├── fonts/                    # Custom fonts
│   │   │   │   ├── Inter/
│   │   │   │   └── Roboto/
│   │   │   └── data/                     # Static data files
│   │   │       ├── departments.json
│   │   │       ├── semesters.json
│   │   │       └── gradeScale.json
│   │   ├── 
│   │   └── lib/                          # Third-party library configurations
│   │       ├── axios.ts                  # Axios configuration
│   │       ├── chartjs.ts                # Chart.js configuration
│   │       ├── websocket.ts              # WebSocket client setup
│   │       └── validation.ts             # Validation schema library
│   ├── 
│   ├── __tests__/                        # Test files
│   │   ├── components/                   # Component tests
│   │   │   ├── layout/
│   │   │   ├── ui/
│   │   │   ├── charts/
│   │   │   ├── forms/
│   │   │   └── data/
│   │   ├── pages/                        # Page tests
│   │   │   ├── auth/
│   │   │   ├── hod/
│   │   │   ├── mentor/
│   │   │   ├── teacher/
│   │   │   └── student/
│   │   ├── services/                     # Service tests
│   │   ├── utils/                        # Utility tests
│   │   ├── hooks/                        # Hook tests
│   │   ├── __mocks__/                    # Mock files
│   │   │   ├── api.ts
│   │   │   ├── websocket.ts
│   │   │   └── localStorage.ts
│   │   └── setup.ts                      # Test setup configuration
│   ├── 
│   ├── e2e/                              # End-to-end tests (Playwright)
│   │   ├── auth.spec.ts                  # Authentication E2E tests
│   │   ├── dashboard.spec.ts             # Dashboard E2E tests
│   │   ├── marks-entry.spec.ts           # Marks entry E2E tests
│   │   ├── student-flow.spec.ts          # Student workflow tests
│   │   └── fixtures/                     # E2E test fixtures
│   │       ├── users.json
│   │       └── test-data.json
│   ├── 
│   ├── package.json                      # React dependencies
│   ├── package-lock.json
│   ├── vite.config.ts                    # Vite configuration
│   ├── tsconfig.json                     # TypeScript configuration
│   ├── tsconfig.node.json                # Node TypeScript config
│   ├── tailwind.config.js                # Tailwind CSS configuration
│   ├── postcss.config.js                 # PostCSS configuration
│   ├── jest.config.js                    # Jest testing configuration
│   ├── playwright.config.ts              # Playwright E2E config
│   ├── .eslintrc.js                      # ESLint configuration
│   ├── .prettierrc                       # Prettier configuration
│   ├── .env.example                      # Environment variables template
│   └── Dockerfile                        # Docker configuration
├── 
├── nginx/                                # Nginx Configuration
│   ├── nginx.conf                        # Main Nginx configuration
│   ├── sites-available/                  # Available site configurations
│   │   ├── mentortrack-ai.conf           # Main site configuration
│   │   └── ssl.conf                      # SSL configuration
│   ├── conf.d/                           # Additional configurations
│   │   ├── gzip.conf                     # Compression settings
│   │   ├── security.conf                 # Security headers
│   │   └── cache.conf                    # Caching rules
│   └── ssl/                              # SSL certificates
│       ├── cert.pem
│       └── key.pem
├── 
├── shared/                               # Shared utilities and types
│   ├── types/                            # Shared TypeScript types
│   │   ├── common.ts
│   │   ├── api.ts
│   │   ├── models.ts
│   │   └── validation.ts
│   ├── utils/                            # Shared utility functions
│   │   ├── constants.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── helpers.ts
│   ├── schemas/                          # Validation schemas
│   │   ├── user.schema.ts
│   │   ├── assessment.schema.ts
│   │   └── academic.schema.ts
│   └── package.json
├── 
├── docs/                                 # Documentation
│   ├── api/                              # API documentation
│   │   ├── authentication.md
│   │   ├── academic-management.md
│   │   ├── assessment-system.md
│   │   ├── mentor-system.md
│   │   ├── backlog-management.md
│   │   └── ai-predictions.md
│   ├── deployment/                       # Deployment guides
│   │   ├── docker-setup.md
│   │   ├── nginx-setup.md
│   │   ├── aws-deployment.md
│   │   ├── database-setup.md
│   │   └── monitoring-setup.md
│   ├── user-guides/                      # User documentation
│   │   ├── hod-guide.md
│   │   ├── mentor-guide.md
│   │   ├── teacher-guide.md
│   │   └── student-guide.md
│   ├── development/                      # Development guides
│   │   ├── setup-guide.md
│   │   ├── coding-standards.md
│   │   ├── testing-guide.md
│   │   ├── contribution-guide.md
│   │   └── web-specific-guide.md
│   └── architecture/                     # Architecture documentation
│       ├── system-overview.md
│       ├── database-design.md
│       ├── api-design.md
│       ├── web-architecture.md
│       └── ai-model-design.md
├── 
├── scripts/                              # Utility scripts
│   ├── setup/                            # Setup scripts
│   │   ├── install-dependencies.sh
│   │   ├── setup-database.sh
│   │   ├── setup-nginx.sh
│   │   └── generate-env-files.sh
│   ├── deployment/                       # Deployment scripts
│   │   ├── build-docker-images.sh
│   │   ├── deploy-to-staging.sh
│   │   ├── deploy-to-production.sh
│   │   └── update-ssl-certs.sh
│   ├── maintenance/                      # Maintenance scripts
│   │   ├── backup-database.sh
│   │   ├── cleanup-logs.sh
│   │   ├── update-models.sh
│   │   └── optimize-images.sh
│   └── testing/                          # Testing scripts
│       ├── run-all-tests.sh
│       ├── run-e2e-tests.sh
│       ├── load-test.sh
│       └── integration-test.sh
├── 
├── infrastructure/                       # Infrastructure as Code
│   ├── terraform/                        # Terraform configurations
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   ├── web-app.tf                    # Web app specific resources
│   │   └── modules/
│   │       ├── vpc/
│   │       ├── ec2/
│   │       ├── rds/
│   │       ├── s3/
│   │       └── cloudfront/
│   ├── kubernetes/                       # Kubernetes manifests
│   │   ├── backend-deployment.yml
│   │   ├── ai-service-deployment.yml
│   │   ├── web-app-deployment.yml
│   │   ├── nginx-deployment.yml
│   │   ├── database-deployment.yml
│   │   ├── redis-deployment.yml
│   │   ├── services.yml
│   │   └── ingress.yml
│   ├── docker/                           # Docker configurations
│   │   ├── docker-compose.dev.yml        # Development environment
│   │   ├── docker-compose.staging.yml    # Staging environment
│   │   ├── docker-compose.prod.yml       # Production environment
│   │   └── Dockerfile.nginx              # Nginx Docker image
│   └── monitoring/                       # Monitoring configurations
│       ├── prometheus.yml
│       ├── grafana-dashboards/
│       │   ├── web-app-metrics.json
│       │   ├── api-performance.json
│       │   └── user-analytics.json
│       └── alerting-rules.yml
├── 
└── .github/                              # GitHub configurations
    ├── workflows/                        # GitHub Actions
    │   ├── ci-backend.yml
    │   ├── ci-ai-service.yml
    │   ├── ci-web-app.yml
    │   ├── e2e-tests.yml
    │   ├── deploy-staging.yml
    │   ├── deploy-production.yml
    │   └── security-scan.yml
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.md
    │   ├── feature_request.md
    │   └── performance_issue.md
    ├── pull_request_template.md
    └── CODEOWNERS
```

## Key Directory Explanations for Web Application

### Web App (`/web-app`)
- **Pages**: Route-based page components organized by user roles
- **Components**: Reusable UI components following atomic design principles
- **Services**: API integration and external service calls optimized for web
- **Store**: Redux state management with RTK Query for efficient data fetching
- **Hooks**: Custom React hooks for common web application patterns
- **Styles**: Tailwind CSS with responsive design utilities

### Nginx (`/nginx`)
- **Configuration**: Reverse proxy setup for serving static files and API routing
- **SSL**: HTTPS configuration for secure web access
- **Caching**: Static asset caching and compression rules
- **Security**: Security headers and rate limiting

### Infrastructure (`/infrastructure`)
- **Terraform**: Cloud infrastructure for web hosting (CDN, Load Balancer, etc.)
- **Kubernetes**: Container orchestration with web-specific services
- **Docker**: Multi-stage builds optimized for web deployment
- **Monitoring**: Web performance metrics and user analytics

### Testing (`/web-app/__tests__` and `/web-app/e2e`)
- **Unit Tests**: Jest and React Testing Library for component testing
- **Integration Tests**: API integration testing
- **E2E Tests**: Playwright for full user journey testing
- **Performance Tests**: Web vitals and load testing

This structure follows modern web development best practices for:
- **Performance**: Optimized bundle sizes, lazy loading, and caching strategies
- **SEO**: Server-side rendering capabilities and meta tag management
- **Accessibility**: WCAG 2.1 AA compliance and screen reader support
- **Responsive Design**: Mobile-first approach with progressive enhancement
- **Security**: Content Security Policy, HTTPS, and secure authentication
- **Scalability**: Microservices architecture with CDN and load balancing