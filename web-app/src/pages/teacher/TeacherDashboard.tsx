import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/layout/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Button } from "@/components/layout/ui/button";
import { Badge } from "@/components/layout/ui/badge";
import { BookOpen, Users, BarChart3, Calendar, CheckCircle, AlertCircle, Brain, TrendingUp } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const TeacherDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "teacher") {
      navigate("/login");
    } else {
      toast.success("Welcome back, Teacher!");
    }
  }, [navigate]);

  // Mock data
  const teacherStats = {
    subjectsTeaching: 3,
    totalStudents: 180,
    averageAttendance: 84,
    pendingEvaluations: 15,
    completedAssessments: 85,
    averagePerformance: 76
  };

  const attendanceData = [
    { week: "Week 1", attendance: 82 },
    { week: "Week 2", attendance: 85 },
    { week: "Week 3", attendance: 83 },
    { week: "Week 4", attendance: 87 },
    { week: "Week 5", attendance: 84 },
  ];

  const subjectPerformanceData = [
    { subject: "Software Eng", marks: 78, passRate: 92 },
    { subject: "Database Mgmt", marks: 74, passRate: 88 },
    { subject: "Comp Networks", marks: 76, passRate: 90 },
  ];

  const subjects = [
    {
      name: 'Software Engineering',
      code: '21CS51',
      semester: 5,
      students: 60,
      attendance: 87,
      avgMarks: 78,
      pendingEvals: 5
    },
    {
      name: 'Database Management',
      code: '21CS52',
      semester: 5,
      students: 60,
      attendance: 82,
      avgMarks: 74,
      pendingEvals: 8
    },
    {
      name: 'Computer Networks',
      code: '21CS53',
      semester: 5,
      students: 60,
      attendance: 83,
      avgMarks: 76,
      pendingEvals: 2
    },
  ];

  const recentActivities = [
    {
      type: 'Assessment',
      subject: 'Software Engineering',
      activity: 'Internal Assessment 2 - Marks Entry',
      date: '2024-01-15',
      status: 'Completed'
    },
    {
      type: 'Attendance',
      subject: 'Database Management',
      activity: 'Daily Attendance - Jan 14',
      date: '2024-01-14',
      status: 'Completed'
    },
    {
      type: 'Assignment',
      subject: 'Computer Networks',
      activity: 'Assignment 3 - Evaluation Pending',
      date: '2024-01-13',
      status: 'Pending'
    },
    {
      type: 'Assessment',
      subject: 'Software Engineering',
      activity: 'Lab Practical - Marks Entry',
      date: '2024-01-12',
      status: 'In Progress'
    },
  ];

  const aiInsights = [
    {
      type: "warning" as const,
      title: "Pending Evaluations Alert",
      description: "15 evaluations are pending across subjects. Database Management has the highest pending count (8).",
      confidence: 95,
    },
    {
      type: "success" as const,
      title: "Performance Improvement",
      description: "Average performance has improved by 5% this semester. Software Engineering shows the highest marks.",
      confidence: 87,
    },
    {
      type: "info" as const,
      title: "Attendance Pattern Insight",
      description: "Consider scheduling assessments during high attendance periods to maximize participation.",
      confidence: 82,
    },
  ];

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Manage your subjects, assessments, and student performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Subjects Teaching"
            value={teacherStats.subjectsTeaching.toString()}
            icon={BookOpen}
            trend={{ value: 0, isPositive: true }}
          />
          <StatCard
            title="Total Students"
            value={teacherStats.totalStudents.toString()}
            icon={Users}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Avg Attendance"
            value={`${teacherStats.averageAttendance}%`}
            icon={Calendar}
            trend={{ value: 2, isPositive: true }}
          />
          <StatCard
            title="Pending Evaluations"
            value={teacherStats.pendingEvaluations.toString()}
            icon={AlertCircle}
            trend={{ value: 3, isPositive: false }}
          />
        </div>

        {/* Additional Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <StatCard
            title="Completed Assessments"
            value={teacherStats.completedAssessments.toString()}
            icon={CheckCircle}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Avg Performance"
            value={`${teacherStats.averagePerformance}%`}
            icon={BarChart3}
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Attendance Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Attendance Trend
              </CardTitle>
              <CardDescription>Weekly attendance percentage across subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[75, 90]} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="attendance"
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
                <BarChart3 className="w-5 h-5 text-primary" />
                Subject Performance
              </CardTitle>
              <CardDescription>Average marks and pass rates by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={subjectPerformanceData}>
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
                  <Bar dataKey="marks" fill="hsl(var(--primary))" name="Avg Marks" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="passRate" fill="hsl(var(--accent))" name="Pass Rate %" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              My Subjects
            </CardTitle>
            <CardDescription>Overview of subjects you're teaching this semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{subject.name}</h3>
                    <Badge variant="outline">{subject.code}</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Semester:</span>
                      <span className="font-medium text-foreground">{subject.semester}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Students:</span>
                      <span className="font-medium text-foreground">{subject.students}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Attendance:</span>
                      <span className="font-medium text-foreground">{subject.attendance}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Marks:</span>
                      <span className="font-medium text-foreground">{subject.avgMarks}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pending:</span>
                      <span className={`font-medium ${subject.pendingEvals > 5 ? 'text-destructive' : 'text-success'}`}>
                        {subject.pendingEvals} evals
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="flex-1">Enter Marks</Button>
                    <Button size="sm" variant="outline" className="flex-1">Attendance</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest assessment and attendance activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'Assessment' ? 'bg-primary/10 text-primary' :
                        activity.type === 'Attendance' ? 'bg-success/10 text-success' :
                        activity.type === 'Assignment' ? 'bg-warning/10 text-warning' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {activity.type === 'Assessment' ? <CheckCircle className="w-4 h-4" /> :
                         activity.type === 'Attendance' ? <Calendar className="w-4 h-4" /> :
                         activity.type === 'Assignment' ? <BookOpen className="w-4 h-4" /> :
                         <AlertCircle className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{activity.activity}</p>
                        <p className="text-sm text-muted-foreground">{activity.subject} • {activity.date}</p>
                      </div>
                    </div>
                    <Badge variant={
                      activity.status === 'Completed' ? 'default' :
                      activity.status === 'In Progress' ? 'secondary' :
                      'outline'
                    }>
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="border-primary/20 bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI-Powered Teaching Insights
            </CardTitle>
            <CardDescription>Recommendations to improve teaching effectiveness and student outcomes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className="p-4 rounded-lg bg-card border">
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
                      <div className="h-2 bg-muted rounded-full flex-1 max-w-[100px]">
                        <div
                          className="h-full bg-gradient-primary rounded-full"
                          style={{ width: `${insight.confidence}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground">{insight.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
