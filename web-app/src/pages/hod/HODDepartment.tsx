import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/layout/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Button } from "@/components/layout/ui/button";
import { Badge } from "@/components/layout/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/layout/ui/table";
import { Users, BookOpen, GraduationCap, Award, TrendingUp, AlertTriangle, Calendar, UserCheck, Target, BarChart3 } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const HODDepartment = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "hod") {
      navigate("/login");
    }
  }, [navigate]);

  // Mock department data
  const departmentStats = {
    totalStudents: 450,
    totalFaculty: 25,
    totalSubjects: 32,
    avgCGPA: 8.2,
    passRate: 94,
    placementRate: 87
  };

  const semesterWiseData = [
    { semester: "Sem 1", enrolled: 120, passed: 115, avgCGPA: 7.2 },
    { semester: "Sem 2", enrolled: 118, passed: 112, avgCGPA: 7.5 },
    { semester: "Sem 3", enrolled: 115, passed: 110, avgCGPA: 7.8 },
    { semester: "Sem 4", enrolled: 112, passed: 108, avgCGPA: 8.0 },
    { semester: "Sem 5", enrolled: 110, passed: 106, avgCGPA: 8.2 },
  ];

  const subjectPerformance = [
    { subject: "Data Structures", code: "CS301", faculty: "Dr. Smith", avgMarks: 78, passRate: 92, students: 45 },
    { subject: "Algorithms", code: "CS302", faculty: "Prof. Johnson", avgMarks: 75, passRate: 88, students: 42 },
    { subject: "Database Systems", code: "CS303", faculty: "Dr. Williams", avgMarks: 82, passRate: 95, students: 48 },
    { subject: "Web Development", code: "CS304", faculty: "Prof. Brown", avgMarks: 85, passRate: 97, students: 40 },
    { subject: "AI/ML", code: "CS305", faculty: "Dr. Davis", avgMarks: 72, passRate: 85, students: 38 },
    { subject: "Computer Networks", code: "CS306", faculty: "Prof. Wilson", avgMarks: 80, passRate: 93, students: 44 },
  ];

  const facultyWorkload = [
    { name: "Dr. Smith", subjects: 3, students: 135, avgRating: 4.5 },
    { name: "Prof. Johnson", subjects: 2, students: 98, avgRating: 4.3 },
    { name: "Dr. Williams", subjects: 3, students: 142, avgRating: 4.7 },
    { name: "Prof. Brown", subjects: 2, students: 89, avgRating: 4.4 },
    { name: "Dr. Davis", subjects: 3, students: 128, avgRating: 4.2 },
  ];

  const placementData = [
    { year: "2022", placed: 85, avgPackage: 8.5 },
    { year: "2023", placed: 92, avgPackage: 9.2 },
    { year: "2024", placed: 87, avgPackage: 9.8 },
  ];

  const departmentDistribution = [
    { name: "CSE Core", value: 40, color: "hsl(var(--primary))" },
    { name: "Electives", value: 30, color: "hsl(var(--secondary))" },
    { name: "Labs", value: 20, color: "hsl(var(--accent))" },
    { name: "Projects", value: 10, color: "hsl(var(--muted))" },
  ];

  return (
    <DashboardLayout role="hod">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Department Management</h1>
          <p className="text-muted-foreground">Computer Science & Engineering Department Overview</p>
        </div>

        {/* Department Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Students"
            value={departmentStats.totalStudents.toString()}
            icon={Users}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Faculty Members"
            value={departmentStats.totalFaculty.toString()}
            icon={UserCheck}
            trend={{ value: 2, isPositive: true }}
          />
          <StatCard
            title="Subjects Offered"
            value={departmentStats.totalSubjects.toString()}
            icon={BookOpen}
            trend={{ value: 3, isPositive: true }}
          />
          <StatCard
            title="Avg Department CGPA"
            value={departmentStats.avgCGPA.toString()}
            icon={Award}
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        {/* Additional Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Pass Rate"
            value={`${departmentStats.passRate}%`}
            icon={Target}
            trend={{ value: 2, isPositive: true }}
          />
          <StatCard
            title="Placement Rate"
            value={`${departmentStats.placementRate}%`}
            icon={GraduationCap}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Student-Faculty Ratio"
            value="18:1"
            icon={BarChart3}
            trend={{ value: 1, isPositive: false }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Semester-wise Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Semester-wise Performance
              </CardTitle>
              <CardDescription>Enrollment, pass rates, and CGPA trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={semesterWiseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="semester" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }}
                  />
                  <Bar dataKey="enrolled" fill="hsl(var(--primary))" name="Enrolled" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="passed" fill="hsl(var(--success))" name="Passed" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Subject Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Subject Category Distribution
              </CardTitle>
              <CardDescription>Breakdown of subject types in curriculum</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {departmentDistribution.map((entry, index) => (
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

        {/* Subject Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Subject-wise Performance
            </CardTitle>
            <CardDescription>Detailed analysis of all subjects offered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Faculty</TableHead>
                    <TableHead>Avg Marks</TableHead>
                    <TableHead>Pass Rate</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjectPerformance.map((subject, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-foreground">{subject.subject}</TableCell>
                      <TableCell className="font-mono text-sm">{subject.code}</TableCell>
                      <TableCell>{subject.faculty}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${subject.avgMarks >= 80 ? 'text-success' : subject.avgMarks >= 70 ? 'text-warning' : 'text-destructive'}`}>
                          {subject.avgMarks}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${subject.passRate >= 90 ? 'text-success' : subject.passRate >= 80 ? 'text-warning' : 'text-destructive'}`}>
                          {subject.passRate}%
                        </span>
                      </TableCell>
                      <TableCell>{subject.students}</TableCell>
                      <TableCell>
                        <Badge variant={
                          subject.passRate >= 90 ? 'default' :
                          subject.passRate >= 80 ? 'secondary' :
                          'destructive'
                        }>
                          {subject.passRate >= 90 ? 'Excellent' : subject.passRate >= 80 ? 'Good' : 'Needs Attention'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">View Details</Button>
                          <Button size="sm" variant="outline">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Faculty Workload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Faculty Workload Distribution
            </CardTitle>
            <CardDescription>Teaching load and student distribution among faculty</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faculty Name</TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead>Total Students</TableHead>
                    <TableHead>Avg Rating</TableHead>
                    <TableHead>Workload Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facultyWorkload.map((faculty, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-foreground">{faculty.name}</TableCell>
                      <TableCell>{faculty.subjects}</TableCell>
                      <TableCell>{faculty.students}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{faculty.avgRating}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm ${i < Math.floor(faculty.avgRating) ? 'text-yellow-500' : 'text-muted'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          faculty.students <= 100 ? 'default' :
                          faculty.students <= 130 ? 'secondary' :
                          'destructive'
                        }>
                          {faculty.students <= 100 ? 'Light' : faculty.students <= 130 ? 'Moderate' : 'Heavy'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">View Profile</Button>
                          <Button size="sm" variant="outline">Assign Subjects</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Placement Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Placement Trends
            </CardTitle>
            <CardDescription>Year-wise placement statistics and package trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={placementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />
                <Bar yAxisId="left" dataKey="placed" fill="hsl(var(--primary))" name="Students Placed" radius={[8, 8, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="avgPackage" stroke="hsl(var(--success))" strokeWidth={3} name="Avg Package (LPA)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Department Management Actions</CardTitle>
            <CardDescription>Quick actions for department administration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button className="h-auto p-4 flex flex-col items-center gap-2">
                <BookOpen className="w-6 h-6" />
                <span>Add New Subject</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <UserCheck className="w-6 h-6" />
                <span>Manage Faculty</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Calendar className="w-6 h-6" />
                <span>Schedule Exams</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <AlertTriangle className="w-6 h-6" />
                <span>Generate Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HODDepartment;
