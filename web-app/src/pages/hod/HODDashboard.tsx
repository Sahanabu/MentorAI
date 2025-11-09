import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/layout/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Users, AlertTriangle, TrendingUp, Award, BookOpen, Brain } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { dashboardService, HODDashboardData } from "@/services/dashboardService";

const HodDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<HODDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (role !== "hod") {
      navigate("/login");
      return;
    }

    const loadDashboardData = async () => {
      try {
        const data = await dashboardService.getHODDashboard();
        setDashboardData(data);
        toast.success("Welcome back, HOD!");
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
      <DashboardLayout role="hod">
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
      <DashboardLayout role="hod">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
        </div>
      </DashboardLayout>
    );
  }



  return (
    <DashboardLayout role="hod">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Department Overview</h1>
          <p className="text-muted-foreground">Computer Science & Engineering Department Analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Students"
            value={dashboardData.departmentStats.totalStudents.toString()}
            icon={Users}
          />
          <StatCard
            title="At-Risk Students"
            value={dashboardData.departmentStats.atRiskStudents.toString()}
            icon={AlertTriangle}
          />
          <StatCard
            title="Avg Department CGPA"
            value={dashboardData.departmentStats.avgCGPA.toFixed(1)}
            icon={Award}
          />
          <StatCard
            title="Avg Attendance"
            value={`${Math.round(dashboardData.departmentStats.avgAttendance)}%`}
            icon={TrendingUp}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Department Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Department CGPA Trend
              </CardTitle>
              <CardDescription>Average CGPA progression over semesters</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardData.performanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="semester" stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[6, 9]} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avgCGPA" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                Student Risk Distribution
              </CardTitle>
              <CardDescription>Current risk level breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
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

        {/* Subject Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Subject-wise Performance Analytics
            </CardTitle>
            <CardDescription>Average marks and pass rates across subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.subjectAnalytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="subject" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  angle={-20}
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
                <Legend />
                <Bar dataKey="avgMarks" fill="hsl(var(--primary))" name="Avg Marks" radius={[8, 8, 0, 0]} />
                <Bar dataKey="passRate" fill="hsl(var(--accent))" name="Pass Rate %" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Mentor Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Mentor Performance Overview
            </CardTitle>
            <CardDescription>Student distribution and mentor effectiveness</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Mentor</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Total Students</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">At-Risk Students</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Avg CGPA</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.mentorPerformance.map((mentor, index) => (
                    <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-foreground">{mentor.mentor}</td>
                      <td className="py-3 px-4 text-muted-foreground">{mentor.students}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          mentor.atRisk <= 2 ? 'bg-success/10 text-success' :
                          mentor.atRisk <= 4 ? 'bg-warning/10 text-warning' :
                          'bg-destructive/10 text-destructive'
                        }`}>
                          {mentor.atRisk}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground">{mentor.avgCGPA}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 bg-muted rounded-full flex-1 max-w-[100px]">
                            <div 
                              className="h-full bg-gradient-primary rounded-full"
                              style={{ width: `${(mentor.avgCGPA / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {((mentor.avgCGPA / 10) * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights for HOD */}
        <Card className="border-primary/20 bg-gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI-Powered Department Insights
            </CardTitle>
            <CardDescription>Recommendations for department improvement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-card border">
              <h4 className="font-semibold text-foreground mb-2">📈 Performance Improvement</h4>
              <p className="text-sm text-muted-foreground">
                AI/ML subject shows lower average marks (72%). Consider allocating additional resources or conducting workshops to improve student understanding.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border">
              <h4 className="font-semibold text-foreground mb-2">⚠️ At-Risk Alert</h4>
              <p className="text-sm text-muted-foreground">
                At-risk student count increased by 12% this semester. Recommend increasing mentor-student interaction frequency.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-card border">
              <h4 className="font-semibold text-foreground mb-2">✅ Success Story</h4>
              <p className="text-sm text-muted-foreground">
                Dr. Williams maintains the highest average CGPA (8.7) with minimal at-risk students. Consider sharing their mentoring strategies department-wide.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HodDashboard;
