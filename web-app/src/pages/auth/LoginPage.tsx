import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Brain, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { authService } from "@/services/authService";
import { loginSuccess, setLoading, setError } from "@/store/slices/authSlice";
import { LoginRequest } from "@/types/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Set demo credentials based on tab
  const setDemoCredentials = (role: string) => {
    switch(role) {
      case 'student':
        setEmail('student1@college.edu');
        break;
      case 'teacher':
        setEmail('teacher1@college.edu');
        break;
      case 'mentor':
        setEmail('mentor1@college.edu');
        break;
      case 'hod':
        setEmail('hod.cs@college.edu');
        break;
    }
    setPassword('password123');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    dispatch(setLoading(true));
    dispatch(setError(""));

    try {
      const credentials: LoginRequest = { email, password };
      const response = await authService.login(credentials);
      
      console.log('Login response:', response);
      
      if (response.success && response.data) {
        dispatch(loginSuccess(response.data));
        toast.success('Login successful!');
        
        // Get user role from sessionStorage (set by authService)
        const userRole = sessionStorage.getItem('userRole');
        console.log('User role:', userRole);
        
        // Navigate based on role
        switch(userRole) {
          case 'student':
            navigate('/student');
            break;
          case 'teacher':
            navigate('/teacher');
            break;
          case 'mentor':
            navigate('/mentor');
            break;
          case 'hod':
            navigate('/hod');
            break;
          default:
            navigate('/');
        }
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.message || "Login failed. Please try again.";
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/30 to-accent/20 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-gradient-primary rounded-xl">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            MentorTrack AI
          </CardTitle>
          <CardDescription className="text-base">
            Academic Mentoring & Performance Tracking System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="student" onClick={() => setDemoCredentials('student')}>Student</TabsTrigger>
              <TabsTrigger value="teacher" onClick={() => setDemoCredentials('teacher')}>Teacher</TabsTrigger>
              <TabsTrigger value="mentor" onClick={() => setDemoCredentials('mentor')}>Mentor</TabsTrigger>
              <TabsTrigger value="hod" onClick={() => setDemoCredentials('hod')}>HOD</TabsTrigger>
            </TabsList>

            {['student', 'teacher', 'mentor', 'hod'].map((role) => (
              <TabsContent key={role} value={role}>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`email-${role}`}>Email</Label>
                    <Input
                      id={`email-${role}`}
                      type="email"
                      placeholder={`${role}@university.edu`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`password-${role}`}>Password</Label>
                    <div className="relative">
                      <Input
                        id={`password-${role}`}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Demo credentials: Use the sample user emails with password 'password123'</p>
            <p className="mt-2 text-xs">
              HOD: hod.cs@university.edu<br/>
              Mentor: mentor.cs@university.edu<br/>
              Teacher: teacher.cs@university.edu<br/>
              Student: student1.cs@university.edu
            </p>
            <p className="mt-4">
              Don't have an account?{' '}
              <a
                href="/register"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign up here
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
