import { Toaster } from "@/components/layout/ui/toaster";
import { Toaster as Sonner } from "@/components/layout/ui/sonner";
import { TooltipProvider } from "@/components/layout/ui/tooltip";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentPerformance from "./pages/student/StudentPerformance";
import StudentAttendance from "./pages/student/StudentAttendance";
import HodDashboard from "./pages/hod/HODDashboard";
import HODDepartment from "./pages/hod/HODDepartment";
import HODAnalytics from "./pages/hod/HODAnalytics";
import HODMentorAssignment from "./pages/hod/HODMentorAssignment";
import MentorDashboard from "./pages/mentor/MentorDashboard";
import MentorStudents from "./pages/mentor/MentorStudents";
import MentorAtRisk from "./pages/mentor/MentorAtRisk";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherMarks from "./pages/teacher/TeacherMarks";
import TeacherStudents from "./pages/teacher/TeacherStudents";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const token = sessionStorage.getItem('accessToken');
  const userStr = sessionStorage.getItem('user');
  const userRole = sessionStorage.getItem('userRole');

  console.log('ProtectedRoute check:', {
    token: token ? 'exists' : 'missing',
    userStr: userStr ? 'exists' : 'missing',
    userRole,
    allowedRoles,
    currentPath: window.location.pathname
  });

  if (!token || !userStr || !userRole) {
    console.log('ProtectedRoute: Redirecting to login - missing auth data');
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole.toUpperCase())) {
    console.log('ProtectedRoute: Redirecting to home - role not allowed');
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute: Access granted');
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/student" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/performance" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentPerformance /></ProtectedRoute>} />
            <Route path="/student/attendance" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentAttendance /></ProtectedRoute>} />
            <Route path="/hod" element={<ProtectedRoute allowedRoles={['HOD']}><HodDashboard /></ProtectedRoute>} />
            <Route path="/hod/department" element={<ProtectedRoute allowedRoles={['HOD']}><HODDepartment /></ProtectedRoute>} />
            <Route path="/hod/analytics" element={<ProtectedRoute allowedRoles={['HOD']}><HODAnalytics /></ProtectedRoute>} />
            <Route path="/hod/mentor-assignment" element={<ProtectedRoute allowedRoles={['HOD']}><HODMentorAssignment /></ProtectedRoute>} />
            <Route path="/mentor" element={<ProtectedRoute allowedRoles={['MENTOR']}><MentorDashboard /></ProtectedRoute>} />
            <Route path="/mentor/students" element={<ProtectedRoute allowedRoles={['MENTOR']}><MentorStudents /></ProtectedRoute>} />
            <Route path="/mentor/at-risk" element={<ProtectedRoute allowedRoles={['MENTOR']}><MentorAtRisk /></ProtectedRoute>} />
            <Route path="/teacher" element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/teacher/marks" element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherMarks /></ProtectedRoute>} />
            <Route path="/teacher/students" element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherStudents /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
