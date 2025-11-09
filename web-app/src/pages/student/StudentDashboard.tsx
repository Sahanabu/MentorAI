import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/layout/StatCard";
import RiskBadge from "@/components/layout/RiskBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Progress } from "@/components/layout/ui/progress";
import { Brain, BookOpen, Calendar, Award, TrendingUp, AlertCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const StudentDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "student") {
      navigate("/login");
    } else {
      toast.success("Welcome back, Student!");
    }
  }, [navigate]);

  // Mock data
  const performanceData = [
    { month: "Jan", cgpa: 7.2 },
    { month: "Feb", cgpa: 7.5 },
    { month: "Mar", cgpa: 7.8 },
    { month: "Apr", cgpa: 8.0 },
    { month: "May", cgpa: 8.2 },
  ];

  const subjectPerformance = [
    { subject: "Data Structures", marks: 85, total: 100 },
    { subject: "Algorithms", marks: 78, total: 100 },
    { subject: "Database Systems", marks: 92, total: 100 },
    { subject: "Web Development", marks: 88, total: 100 },
    { subject: "AI/ML", marks: 75, total: 100 },
  ];

  const attendanceData = [
    { name: "Present", value: 85, color: "hsl(var(--success))" },
    { name: "Absent", value: 15, color: "hsl(var(--destructive))" },
  ];

  const aiInsights = [
    {
      type: "success" as const,
      title: "Strong Performance Trend",
      description: "Your CGPA has improved by 1.0 points over the last semester. Keep up the excellent work!",
      confidence: 92,
    },
    {
      type: "warning" as const,
      title: "Attention Required: AI/ML",
      description: "Your performance in AI/ML is below average. Consider attending extra help sessions.",
      confidence: 87,
    },
    {
      type: "info" as const,
      title: "Attendance Milestone",
      description: "You're on track to maintain 85%+ attendance this semester.",
      confidence: 95,
    },
  ];

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back, Student!</h1>
          <p className="text-muted-foreground">Here's your academic performance overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Current CGPA"
            value="8.2"
            icon={Award}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Attendance"
            value="85%"
            icon={Calendar}
            trend={{ value: 3, isPositive: true }}
          />
          <StatCard
            title="Subjects"
            value="5"
            icon={BookOpen}
          />
          <StatCard
            title="Backlogs"
            value="0"
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
              <RiskBadge level="low" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Based on your current performance metrics, attendance, and trend analysis, you are maintaining excellent academic standing. Continue your current study patterns.
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
                <LineChart data={performanceData}>
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
                <BarChart data={subjectPerformance}>
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
            {aiInsights.map((insight, index) => (
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
