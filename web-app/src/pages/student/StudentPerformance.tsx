import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/layout/StatCard";
import RiskBadge from "@/components/layout/RiskBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Button } from "@/components/layout/ui/button";
import { Badge } from "@/components/layout/ui/badge";
import { Progress } from "@/components/layout/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/layout/ui/table";
import { Alert, AlertDescription } from "@/components/layout/ui/alert";
import {
  Award,
  Calendar,
  BookOpen,
  AlertCircle,
  TrendingUp,
  Download,
  FileText,
  Target,
  CheckCircle,
  AlertTriangle,
  XCircle,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/layout/ui/chart";

const StudentPerformance = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "student") {
      navigate("/login");
    }
  }, [navigate]);

  // Mock data for overall summary
  const overallStats = {
    currentCGPA: 8.2,
    totalCredits: 142,
    requiredCredits: 160,
    attendancePercentage: 85,
    backlogs: 0,
    alerts: [
      { type: "warning", message: "2 assignments pending in Data Structures" },
      { type: "info", message: "Attendance below 75% in Microcontrollers" }
    ]
  };

  // Subject-wise performance data
  const subjectPerformance = [
    {
      subject: "Data Structures",
      internalMarks: 85,
      endSemesterMarks: 78,
      assignmentScore: 92,
      labScore: 88,
      attendance: 82,
      status: "good",
      grade: "A"
    },
    {
      subject: "Algorithms",
      internalMarks: 92,
      endSemesterMarks: 85,
      assignmentScore: 95,
      labScore: 90,
      attendance: 88,
      status: "excellent",
      grade: "A+"
    },
    {
      subject: "Database Systems",
      internalMarks: 78,
      endSemesterMarks: 82,
      assignmentScore: 85,
      labScore: 80,
      attendance: 85,
      status: "good",
      grade: "A"
    },
    {
      subject: "Web Development",
      internalMarks: 88,
      endSemesterMarks: 90,
      assignmentScore: 92,
      labScore: 85,
      attendance: 90,
      status: "excellent",
      grade: "A+"
    },
    {
      subject: "AI/ML",
      internalMarks: 72,
      endSemesterMarks: 75,
      assignmentScore: 78,
      labScore: 70,
      attendance: 78,
      status: "moderate",
      grade: "B+"
    },
    {
      subject: "Microcontrollers",
      internalMarks: 65,
      endSemesterMarks: 68,
      assignmentScore: 70,
      labScore: 65,
      attendance: 68,
      status: "needs_improvement",
      grade: "B"
    }
  ];

  // Semester trend data
  const semesterTrend = [
    { semester: "Sem 1", cgpa: 7.8, classAverage: 7.2 },
    { semester: "Sem 2", cgpa: 8.0, classAverage: 7.4 },
    { semester: "Sem 3", cgpa: 8.2, classAverage: 7.6 },
    { semester: "Sem 4", cgpa: 8.1, classAverage: 7.5 },
    { semester: "Sem 5", cgpa: 8.3, classAverage: 7.7 },
  ];

  // Assessment history
  const assessmentHistory = [
    { examType: "Mid-term", subject: "Data Structures", score: 85, maxScore: 100, date: "2024-01-15", remarks: "Good understanding" },
    { examType: "Quiz", subject: "Algorithms", score: 92, maxScore: 100, date: "2024-01-20", remarks: "Excellent" },
    { examType: "Assignment", subject: "Database Systems", score: 88, maxScore: 100, date: "2024-01-25", remarks: "Well done" },
    { examType: "Lab Exam", subject: "Web Development", score: 95, maxScore: 100, date: "2024-02-01", remarks: "Outstanding" },
    { examType: "End-term", subject: "AI/ML", score: 75, maxScore: 100, date: "2024-02-10", remarks: "Needs improvement" },
  ];

  // Performance insights
  const insights = [
    {
      type: "success",
      title: "Strong Performance in Algorithms",
      message: "You're performing exceptionally well in Algorithms with consistent high scores.",
      action: "Keep up the excellent work!"
    },
    {
      type: "warning",
      title: "Attention Required: Microcontrollers",
      message: "Your performance in Microcontrollers is below average. Attendance is also low at 68%.",
      action: "Consider attending extra classes and focusing on practical sessions."
    },
    {
      type: "info",
      title: "AI/ML Improvement Needed",
      message: "While your theoretical understanding is good, practical implementation needs work.",
      action: "Practice more coding exercises and review core concepts."
    }
  ];

  // Radar chart data for subject performance
  const radarData = subjectPerformance.map(subject => ({
    subject: subject.subject.split(' ')[0], // Shorten names
    performance: (subject.internalMarks + subject.endSemesterMarks) / 2,
    attendance: subject.attendance
  }));

  // Grade distribution pie chart
  const gradeDistribution = [
    { name: "A+", value: 2, color: "hsl(var(--success))" },
    { name: "A", value: 2, color: "hsl(var(--primary))" },
    { name: "B+", value: 1, color: "hsl(var(--warning))" },
    { name: "B", value: 1, color: "hsl(var(--destructive))" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-success";
      case "good": return "text-primary";
      case "moderate": return "text-warning";
      case "needs_improvement": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent": return CheckCircle;
      case "good": return CheckCircle;
      case "moderate": return AlertTriangle;
      case "needs_improvement": return XCircle;
      default: return Activity;
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Academic Performance</h1>
          <p className="text-muted-foreground">Detailed analysis of your academic progress and insights</p>
        </div>

        {/* Overall Academic Summary */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Current CGPA"
            value={overallStats.currentCGPA.toString()}
            icon={Award}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Credits Earned"
            value={`${overallStats.totalCredits}/${overallStats.requiredCredits}`}
            icon={BookOpen}
          />
          <StatCard
            title="Attendance"
            value={`${overallStats.attendancePercentage}%`}
            icon={Calendar}
            trend={{ value: 2, isPositive: true }}
          />
          <StatCard
            title="Active Backlogs"
            value={overallStats.backlogs.toString()}
            icon={AlertCircle}
          />
        </div>

        {/* Alerts Section */}
        {overallStats.alerts.length > 0 && (
          <div className="space-y-2">
            {overallStats.alerts.map((alert, index) => (
              <Alert key={index} className={alert.type === "warning" ? "border-warning/20 bg-warning/5" : "border-primary/20 bg-primary/5"}>
                <AlertCircle className={`h-4 w-4 ${alert.type === "warning" ? "text-warning" : "text-primary"}`} />
                <AlertDescription className={alert.type === "warning" ? "text-warning" : "text-primary"}>
                  {alert.message}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Subject-wise Performance Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Subject-wise Performance
            </CardTitle>
            <CardDescription>Detailed breakdown of your performance across all subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {subjectPerformance.map((subject, index) => {
                const StatusIcon = getStatusIcon(subject.status);
                return (
                  <div key={index} className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-foreground">{subject.subject}</h4>
                        <Badge variant="outline" className="font-mono">{subject.grade}</Badge>
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${getStatusColor(subject.status)}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="capitalize">{subject.status.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Internal</p>
                        <p className="font-semibold">{subject.internalMarks}/100</p>
                        <Progress value={subject.internalMarks} className="h-2 mt-1" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">End Semester</p>
                        <p className="font-semibold">{subject.endSemesterMarks}/100</p>
                        <Progress value={subject.endSemesterMarks} className="h-2 mt-1" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Assignment</p>
                        <p className="font-semibold">{subject.assignmentScore}/100</p>
                        <Progress value={subject.assignmentScore} className="h-2 mt-1" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Lab</p>
                        <p className="font-semibold">{subject.labScore}/100</p>
                        <Progress value={subject.labScore} className="h-2 mt-1" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Attendance</p>
                        <p className="font-semibold">{subject.attendance}%</p>
                        <Progress value={subject.attendance} className="h-2 mt-1" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Semester-wise Trend Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Semester-wise GPA Trend
              </CardTitle>
              <CardDescription>Your academic performance over time vs class average</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                cgpa: { label: "Your CGPA", color: "hsl(var(--primary))" },
                classAverage: { label: "Class Average", color: "hsl(var(--muted-foreground))" }
              }}>
                <LineChart data={semesterTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semester" />
                  <YAxis domain={[6, 10]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="cgpa"
                    stroke="var(--color-cgpa)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-cgpa)", r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="classAverage"
                    stroke="var(--color-classAverage)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "var(--color-classAverage)", r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Performance Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Performance Overview
              </CardTitle>
              <CardDescription>Subject performance vs attendance radar</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                performance: { label: "Performance", color: "hsl(var(--primary))" },
                attendance: { label: "Attendance", color: "hsl(var(--success))" }
              }}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Radar
                    name="Performance"
                    dataKey="performance"
                    stroke="var(--color-performance)"
                    fill="var(--color-performance)"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Attendance"
                    dataKey="attendance"
                    stroke="var(--color-attendance)"
                    fill="var(--color-attendance)"
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Grade Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Grade Distribution
            </CardTitle>
            <CardDescription>Overview of grades across all subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ChartContainer config={{
                "A+": { label: "A+", color: "hsl(var(--success))" },
                "A": { label: "A", color: "hsl(var(--primary))" },
                "B+": { label: "B+", color: "hsl(var(--warning))" },
                "B": { label: "B", color: "hsl(var(--destructive))" }
              }}>
                <RechartsPieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RechartsPieChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Assessment History Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Assessment History
            </CardTitle>
            <CardDescription>Complete record of your assessments and evaluations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exam Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessmentHistory.map((assessment, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{assessment.examType}</TableCell>
                    <TableCell>{assessment.subject}</TableCell>
                    <TableCell>{assessment.score}/{assessment.maxScore}</TableCell>
                    <TableCell>{new Date(assessment.date).toLocaleDateString()}</TableCell>
                    <TableCell>{assessment.remarks}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Performance Insights & Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              AI-Powered Insights & Recommendations
            </CardTitle>
            <CardDescription>Personalized recommendations based on your performance data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => {
              const Icon = insight.type === "success" ? CheckCircle :
                          insight.type === "warning" ? AlertTriangle : Activity;
              return (
                <div key={index} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      insight.type === 'success' ? 'bg-success/10' :
                      insight.type === 'warning' ? 'bg-warning/10' :
                      'bg-primary/10'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        insight.type === 'success' ? 'text-success' :
                        insight.type === 'warning' ? 'text-warning' :
                        'text-primary'
                      }`} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-foreground">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.message}</p>
                      <p className="text-sm font-medium text-primary">{insight.action}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Download Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              Download Reports
            </CardTitle>
            <CardDescription>Export your academic performance data for records or sharing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button variant="outline" className="gap-2">
                <FileText className="w-4 h-4" />
                Academic Report (PDF)
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Performance Data (Excel)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentPerformance;
