import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Brain, TrendingUp, Users, Shield, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-primary rounded-2xl shadow-xl">
              <GraduationCap className="w-16 h-16 text-primary-foreground" />
            </div>
            <Brain className="w-16 h-16 text-primary" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Welcome to{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              MentorTrack AI
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Revolutionizing academic mentoring with AI-powered insights, performance tracking, 
            and data-driven decision making for educational excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="text-lg px-8 shadow-lg hover:shadow-xl transition-all"
            >
              Sign In
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/register")}
              className="text-lg px-8"
            >
              Sign Up
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-6xl mx-auto">
          <div className="p-6 rounded-xl bg-card shadow-md hover:shadow-xl transition-shadow border">
            <div className="p-3 bg-gradient-primary rounded-lg w-fit mb-4">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Performance Analytics</h3>
            <p className="text-muted-foreground">
              Real-time tracking of academic performance with comprehensive visualizations and trend analysis.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card shadow-md hover:shadow-xl transition-shadow border">
            <div className="p-3 bg-gradient-primary rounded-lg w-fit mb-4">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">AI-Powered Insights</h3>
            <p className="text-muted-foreground">
              Intelligent predictions and recommendations to identify at-risk students and intervention opportunities.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card shadow-md hover:shadow-xl transition-shadow border">
            <div className="p-3 bg-gradient-primary rounded-lg w-fit mb-4">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Mentor Management</h3>
            <p className="text-muted-foreground">
              Streamlined mentor-student allocation and communication for personalized academic guidance.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card shadow-md hover:shadow-xl transition-shadow border">
            <div className="p-3 bg-gradient-primary rounded-lg w-fit mb-4">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Role-Based Access</h3>
            <p className="text-muted-foreground">
              Secure dashboards tailored for HODs, mentors, teachers, and students with appropriate permissions.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card shadow-md hover:shadow-xl transition-shadow border">
            <div className="p-3 bg-gradient-primary rounded-lg w-fit mb-4">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Automated Alerts</h3>
            <p className="text-muted-foreground">
              Instant notifications for attendance issues, performance drops, and backlog concerns.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card shadow-md hover:shadow-xl transition-shadow border">
            <div className="p-3 bg-gradient-primary rounded-lg w-fit mb-4">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Department Analytics</h3>
            <p className="text-muted-foreground">
              Comprehensive departmental reports and metrics for informed administrative decisions.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center p-12 rounded-2xl bg-gradient-card border shadow-xl max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your Academic Management?
          </h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Join hundreds of institutions using AI-powered insights to improve student outcomes.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/login")}
            className="text-lg px-10 shadow-lg hover:shadow-xl"
          >
            Access Your Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
