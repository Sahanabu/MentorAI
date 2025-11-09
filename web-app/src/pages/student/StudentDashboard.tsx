import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/layout/StatCard";
import RiskBadge from "@/components/layout/RiskBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Progress } from "@/components/layout/ui/progress";
import { Button } from "@/components/layout/ui/button";
import { Brain, BookOpen, Calendar, Award, TrendingUp, AlertCircle, Calculator } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { dynamicDashboardService, DynamicStudentData } from "@/services/dynamicDashboardService";
import SGPACalculator from "@/components/student/SGPACalculator";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DynamicStudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSGPACalculator, setShowSGPACalculator] = useState(false);

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (role !== "student") {
      navigate("/login");
      return;
    }

    const loadDashboardData = async () => {
      try {
        const data = await dynamicDashboardService.getStudentDashboard();
        setDashboardData(data);
        toast.success(`Welcome back, ${data.profile.name}!`);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!dashboardData) {
    return (
      <DashboardLayout role="student">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back, {dashboardData.profile.name}!</h1>
            <p className="text-muted-foreground">{dashboardData.profile.usn} • Semester {dashboardData.profile.semester} • {dashboardData.profile.department}</p>
          </div>
          <Button 
            onClick={() => setShowSGPACalculator(!showSGPACalculator)}
            className="flex items-center gap-2"
          >
            <Calculator className="h-4 w-4" />
            {showSGPACalculator ? 'Hide Calculator' : 'SGPA Calculator'}
          </Button>
        </div>

        {/* SGPA Calculator Section */}
        {showSGPACalculator && (
          <Card>
            <CardContent className="pt-6">
              <SGPACalculator />
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Current CGPA"
            value={dashboardData.profile.cgpa.toFixed(1)}
            icon={Award}
          />
          <StatCard
            title="Attendance"
            value={`${Math.round(dashboardData.currentSemester.attendance)}%`}
            icon={Calendar}
          />
          <StatCard
            title="Subjects"
            value={dashboardData.currentSemester.subjects.toString()}
            icon={BookOpen}
          />
          <StatCard
            title="Backlogs"
            value={dashboardData.currentSemester.backlogs.toString()}
            icon={AlertCircle}
          />
        </div>

        {/* Risk Level Card */}
        <Card className="border-success/20 bg-gradient-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Academic Risk Assessment
                </CardTitle>
                <CardDescription>AI-powered analysis of your academic standing</CardDescription>
              </div>
              <RiskBadge level={dashboardData.riskAssessment.level.toLowerCase() as 'low' | 'medium' | 'high'} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Risk factors: {dashboardData.riskAssessment.factors.join(', ')}. Confidence: {Math.round(dashboardData.riskAssessment.confidence)}%
            </p>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                CGPA Trend
              </CardTitle>
              <CardDescription>Your academic performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dashboardData.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[6, 10]} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cgpa" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Subject Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Subject Performance
              </CardTitle>
              <CardDescription>Current semester marks breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dashboardData.subjectPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="subject" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }}
                  />
                  <Bar dataKey="marks" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI-Powered Insights
            </CardTitle>
            <CardDescription>Personalized recommendations based on your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.aiInsights.map((insight, index) => (
              <div key={index} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    insight.type === 'success' ? 'bg-success/10' :
                    insight.type === 'warning' ? 'bg-warning/10' :
                    'bg-primary/10'
                  }`}>
                    <Brain className={`w-5 h-5 ${
                      insight.type === 'success' ? 'text-success' :
                      insight.type === 'warning' ? 'text-warning' :
                      'text-primary'
                    }`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold text-foreground">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">Confidence:</span>
                      <Progress value={insight.confidence} className="w-24 h-2" />
                      <span className="text-xs font-medium text-foreground">{insight.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest academic updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { subject: "Data Structures", activity: "Assignment submitted", time: "2 hours ago" },
                { subject: "Database Systems", activity: "Scored 92/100 in Quiz", time: "1 day ago" },
                { subject: "Web Development", activity: "Attendance marked", time: "2 days ago" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.subject}</p>
                    <p className="text-sm text-muted-foreground">{item.activity}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
