import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/layout/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Users, AlertTriangle, TrendingUp, Award, BookOpen, Brain } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const HodDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "hod") {
      navigate("/login");
    } else {
      toast.success("Welcome back, HOD!");
    }
  }, [navigate]);

  // Mock data
  const departmentPerformance = [
    { semester: "Sem 1", avgCGPA: 7.2, students: 120 },
    { semester: "Sem 2", avgCGPA: 7.5, students: 118 },
    { semester: "Sem 3", avgCGPA: 7.8, students: 115 },
    { semester: "Sem 4", avgCGPA: 8.0, students: 112 },
    { semester: "Sem 5", avgCGPA: 8.2, students: 110 },
  ];

  const riskDistribution = [
    { name: "Low Risk", value: 65, color: "hsl(var(--success))" },
    { name: "Medium Risk", value: 25, color: "hsl(var(--warning))" },
    { name: "High Risk", value: 10, color: "hsl(var(--destructive))" },
  ];

  const mentorPerformance = [
    { mentor: "Dr. Smith", students: 25, atRisk: 2, avgCGPA: 8.5 },
    { mentor: "Prof. Johnson", students: 28, atRisk: 4, avgCGPA: 8.2 },
    { mentor: "Dr. Williams", students: 22, atRisk: 1, avgCGPA: 8.7 },
    { mentor: "Prof. Brown", students: 30, atRisk: 5, avgCGPA: 8.0 },
  ];

  const subjectAnalytics = [
    { subject: "Data Structures", avgMarks: 78, passRate: 92 },
    { subject: "Algorithms", avgMarks: 75, passRate: 88 },
    { subject: "Database Systems", avgMarks: 82, passRate: 95 },
    { subject: "Web Development", avgMarks: 85, passRate: 97 },
    { subject: "AI/ML", avgMarks: 72, passRate: 85 },
  ];

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
            value="450"
            icon={Users}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="At-Risk Students"
            value="45"
            icon={AlertTriangle}
            trend={{ value: 12, isPositive: false }}
          />
          <StatCard
            title="Avg Department CGPA"
            value="8.2"
            icon={Award}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Avg Attendance"
            value="87%"
            icon={TrendingUp}
            trend={{ value: 3, isPositive: true }}
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
                <LineChart data={departmentPerformance}>
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
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
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
              <BarChart data={subjectAnalytics}>
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
                  {mentorPerformance.map((mentor, index) => (
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
