import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/layout/StatCard";
import RiskBadge from "@/components/layout/RiskBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Button } from "@/components/layout/ui/button";
import { Badge } from "@/components/layout/ui/badge";
import { Users, AlertTriangle, TrendingUp, Calendar, MessageSquare, Award, Brain } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { dashboardService, MentorDashboardData } from "@/services/dashboardService";

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<MentorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (role !== "mentor") {
      navigate("/login");
      return;
    }

    const loadDashboardData = async () => {
      try {
        const data = await dashboardService.getMentorDashboard();
        setDashboardData(data);
        toast.success("Welcome back, Mentor!");
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
      <DashboardLayout role="mentor">
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
      <DashboardLayout role="mentor">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
        </div>
      </DashboardLayout>
    );
  }



  const recentInterventions = [
    {
      student: 'John Doe',
      type: 'Academic Counseling',
      date: '2024-01-15',
      status: 'Completed',
      notes: 'Discussed study schedule and time management'
    },
    {
      student: 'Jane Smith',
      type: 'Attendance Follow-up',
      date: '2024-01-14',
      status: 'In Progress',
      notes: 'Working on improving attendance consistency'
    },
    {
      student: 'Mike Johnson',
      type: 'Parent Meeting',
      date: '2024-01-13',
      status: 'Scheduled',
      notes: 'Meeting scheduled for next week'
    },
  ];

  const aiInsights = [
    {
      type: "warning" as const,
      title: "At-Risk Student Alert",
      description: "3 students require immediate attention. Focus on John Doe and Mike Johnson who show declining performance trends.",
      confidence: 89,
    },
    {
      type: "success" as const,
      title: "Positive Intervention Impact",
      description: "Recent counseling sessions have improved attendance by 15% for medium-risk students.",
      confidence: 94,
    },
    {
      type: "info" as const,
      title: "Mentoring Strategy Recommendation",
      description: "Consider group study sessions for students with similar performance patterns to improve peer learning.",
      confidence: 87,
    },
  ];

  return (
    <DashboardLayout role="mentor">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Mentor Dashboard</h1>
          <p className="text-muted-foreground">Monitor and support your assigned students</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Students"
            value={dashboardData.stats.totalStudents.toString()}
            icon={Users}
          />
          <StatCard
            title="At-Risk Students"
            value={dashboardData.stats.atRiskStudents.toString()}
            icon={AlertTriangle}
          />
          <StatCard
            title="Interventions"
            value={dashboardData.stats.interventions.toString()}
            icon={MessageSquare}
          />
          <StatCard
            title="Avg CGPA"
            value={dashboardData.stats.averageCGPA.toFixed(1)}
            icon={Award}
          />
        </div>

        {/* Additional Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <StatCard
            title="Attendance Rate"
            value={`${Math.round(dashboardData.stats.attendanceRate)}%`}
            icon={Calendar}
          />
          <StatCard
            title="Improvement Rate"
            value={`${Math.round(dashboardData.stats.improvementRate)}%`}
            icon={TrendingUp}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Student Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Student Performance Trend
              </CardTitle>
              <CardDescription>Average CGPA and attendance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dashboardData.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }}
                  />
                  <Bar dataKey="avgCGPA" fill="hsl(var(--primary))" name="Avg CGPA" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="attendance" fill="hsl(var(--accent))" name="Attendance %" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Risk Distribution
              </CardTitle>
              <CardDescription>Current risk level breakdown of students</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={dashboardData.riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dashboardData.riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* At Risk Students Alert */}
        <Card className="border-destructive/20 bg-gradient-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  High Priority: At Risk Students
                </CardTitle>
                <CardDescription>Students requiring immediate attention and intervention</CardDescription>
              </div>
              <RiskBadge level="high" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.atRiskStudents.map((student, index) => (
              <div key={index} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-semibold text-foreground">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.usn}</p>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="text-muted-foreground">CGPA: <span className="font-medium text-foreground">{student.cgpa}</span></p>
                      <p className="text-muted-foreground">Attendance: <span className="font-medium text-foreground">{student.attendance}%</span></p>
                    </div>
                    <RiskBadge level={student.riskLevel} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">Last: {student.lastIntervention}</span>
                    <Button size="sm" variant="destructive">Contact</Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Interventions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Recent Interventions
            </CardTitle>
            <CardDescription>Latest mentoring activities and follow-ups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInterventions.map((intervention, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{intervention.student}</p>
                      <p className="text-sm text-muted-foreground">{intervention.type} • {intervention.date}</p>
                      <p className="text-sm text-muted-foreground">{intervention.notes}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={
                        intervention.status === 'Completed' ? 'default' :
                        intervention.status === 'In Progress' ? 'secondary' :
                        'outline'
                      }>
                        {intervention.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    </div>
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
              AI-Powered Mentoring Insights
            </CardTitle>
            <CardDescription>Personalized recommendations based on student data analysis</CardDescription>
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

export default MentorDashboard;
