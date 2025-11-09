import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Button } from "@/components/layout/ui/button";
import { Badge } from "@/components/layout/ui/badge";
import { Input } from "@/components/layout/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/layout/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/layout/ui/table";
import { Users, Search, Filter, Eye, Mail, Phone } from "lucide-react";

const TeacherStudents = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (role !== "teacher") {
      navigate("/login");
    }
  }, [navigate]);

  // Mock student data
  const students = [
    {
      id: 1,
      name: "Arjun Kumar",
      usn: "1BM21CS001",
      semester: 5,
      branch: "CSE",
      email: "arjun.kumar@example.com",
      phone: "+91 9876543210",
      attendance: 87,
      sgpa: 8.2,
      cgpa: 8.5,
      riskLevel: "Low",
      mentor: "Dr. Priya Sharma",
      backlogs: 0
    },
    {
      id: 2,
      name: "Priya Singh",
      usn: "1BM21CS002",
      semester: 5,
      branch: "CSE",
      email: "priya.singh@example.com",
      phone: "+91 9876543211",
      attendance: 92,
      sgpa: 9.1,
      cgpa: 9.0,
      riskLevel: "Low",
      mentor: "Dr. Rajesh Kumar",
      backlogs: 0
    },
    {
      id: 3,
      name: "Rohan Patel",
      usn: "1BM21CS003",
      semester: 5,
      branch: "CSE",
      email: "rohan.patel@example.com",
      phone: "+91 9876543212",
      attendance: 78,
      sgpa: 7.5,
      cgpa: 7.8,
      riskLevel: "Medium",
      mentor: "Dr. Priya Sharma",
      backlogs: 1
    },
    {
      id: 4,
      name: "Sneha Reddy",
      usn: "1BM21CS004",
      semester: 5,
      branch: "CSE",
      email: "sneha.reddy@example.com",
      phone: "+91 9876543213",
      attendance: 85,
      sgpa: 8.0,
      cgpa: 8.2,
      riskLevel: "Low",
      mentor: "Dr. Rajesh Kumar",
      backlogs: 0
    },
    {
      id: 5,
      name: "Vikram Joshi",
      usn: "1BM21CS005",
      semester: 5,
      branch: "CSE",
      email: "vikram.joshi@example.com",
      phone: "+91 9876543214",
      attendance: 65,
      sgpa: 6.8,
      cgpa: 7.2,
      riskLevel: "High",
      mentor: "Dr. Priya Sharma",
      backlogs: 2
    },
    {
      id: 6,
      name: "Ananya Gupta",
      usn: "1BM21CS006",
      semester: 5,
      branch: "CSE",
      email: "ananya.gupta@example.com",
      phone: "+91 9876543215",
      attendance: 88,
      sgpa: 8.5,
      cgpa: 8.7,
      riskLevel: "Low",
      mentor: "Dr. Rajesh Kumar",
      backlogs: 0
    }
  ];

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Students</h1>
            <p className="text-muted-foreground">View and manage student information across your subjects</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1">
              <Users className="w-4 h-4 mr-2" />
              {students.length} Students
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search students by name or USN..."
                    className="pl-10"
                  />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  <SelectItem value="5">Semester 5</SelectItem>
                  <SelectItem value="6">Semester 6</SelectItem>
                  <SelectItem value="7">Semester 7</SelectItem>
                  <SelectItem value="8">Semester 8</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student List</CardTitle>
            <CardDescription>Detailed information about students in your subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>USN</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>SGPA</TableHead>
                    <TableHead>CGPA</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Backlogs</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{student.usn}</TableCell>
                      <TableCell>{student.semester}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${student.attendance >= 85 ? 'text-success' : student.attendance >= 75 ? 'text-warning' : 'text-destructive'}`}>
                          {student.attendance}%
                        </span>
                      </TableCell>
                      <TableCell>{student.sgpa}</TableCell>
                      <TableCell>{student.cgpa}</TableCell>
                      <TableCell>
                        <Badge variant={getRiskBadgeVariant(student.riskLevel)}>
                          {student.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${student.backlogs === 0 ? 'text-success' : student.backlogs <= 2 ? 'text-warning' : 'text-destructive'}`}>
                          {student.backlogs}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="w-4 h-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{students.length}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Badge className="w-6 h-6 bg-success text-success-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {students.filter(s => s.riskLevel === 'Low').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Low Risk</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Badge className="w-6 h-6 bg-warning text-warning-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {students.filter(s => s.riskLevel === 'Medium').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Medium Risk</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <Badge className="w-6 h-6 bg-destructive text-destructive-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {students.filter(s => s.riskLevel === 'High').length}
                  </p>
                  <p className="text-sm text-muted-foreground">High Risk</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherStudents;
