import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/layout/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/layout/ui/table";
import { Progress } from "@/components/layout/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/layout/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/layout/ui/tabs";
import { Badge } from "@/components/layout/ui/badge";
import { Calendar, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const StudentAttendance = () => {
  const navigate = useNavigate();
  const [selectedSemester, setSelectedSemester] = useState("current");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "student") {
      navigate("/login");
    }
  }, [navigate]);

  // Mock data
  const attendanceOverview = {
    totalPercentage: 85,
    attended: 34,
    total: 40,
  };

  const subjectAttendance = [
    { subject: "Data Structures", attended: 8, total: 10, percentage: 80, status: "good" },
    { subject: "Algorithms", attended: 7, total: 10, percentage: 70, status: "low" },
    { subject: "Database Systems", attended: 9, total: 10, percentage: 90, status: "good" },
    { subject: "Web Development", attended: 6, total: 10, percentage: 60, status: "low" },
    { subject: "AI/ML", attended: 4, total: 10, percentage: 40, status: "low" },
  ];

  const attendanceTrend = [
    { week: "Week 1", percentage: 82 },
    { week: "Week 2", percentage: 85 },
    { week: "Week 3", percentage: 78 },
    { week: "Week 4", percentage: 88 },
    { week: "Week 5", percentage: 85 },
  ];

  const attendanceDistribution = [
    { name: "Present", value: 85, color: "hsl(var(--success))" },
    { name: "Absent", value: 15, color: "hsl(var(--destructive))" },
  ];

  const lowAttendanceAlerts = subjectAttendance.filter(subject => subject.percentage < 75);

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Attendance Overview</h1>
            <p className="text-muted-foreground">Track your attendance across all subjects</p>
          </div>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Semester</SelectItem>
              <SelectItem value="previous">Previous Semester</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Overall Attendance"
            value={`${attendanceOverview.totalPercentage}%`}
            icon={Calendar}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Classes Attended"
            value={`${attendanceOverview.attended}/${attendanceOverview.total}`}
            icon={CheckCircle}
          />
          <StatCard
            title="Subjects at Risk"
            value={lowAttendanceAlerts.length.toString()}
            icon={AlertTriangle}
          />
        </div>

        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList>
            <TabsTrigger value="summary">Summary View</TabsTrigger>
            <TabsTrigger value="detailed">Detailed View</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Attendance Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Attendance Trend
                  </CardTitle>
                  <CardDescription>Weekly attendance percentage</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={attendanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                      <YAxis domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)"
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="percentage"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Attendance Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Attendance Distribution
                  </CardTitle>
                  <CardDescription>Present vs Absent breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={attendanceDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {attendanceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-6 mt-4">
                    {attendanceDistribution.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {entry.name}: {entry.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Low Attendance Alerts */}
            {lowAttendanceAlerts.length > 0 && (
              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    Low Attendance Alerts
                  </CardTitle>
                  <CardDescription>Subjects requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {lowAttendanceAlerts.map((subject, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                      <div>
                        <h4 className="font-semibold text-foreground">{subject.subject}</h4>
                        <p className="text-sm text-muted-foreground">
                          {subject.attended}/{subject.total} classes attended
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive">{subject.percentage}%</Badge>
                        <p className="text-xs text-muted-foreground mt-1">Below 75%</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            {/* Subject-wise Attendance Table */}
            <Card>
              <CardHeader>
                <CardTitle>Subject-wise Attendance</CardTitle>
                <CardDescription>Detailed breakdown by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Attended</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjectAttendance.map((subject, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{subject.subject}</TableCell>
                        <TableCell>{subject.attended}</TableCell>
                        <TableCell>{subject.total}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={subject.percentage} className="w-20 h-2" />
                            <span className="text-sm">{subject.percentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={subject.status === "good" ? "default" : "destructive"}>
                            {subject.status === "good" ? "Good" : "Low"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentAttendance;
