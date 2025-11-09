import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RiskBadge from "@/components/layout/RiskBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Button } from "@/components/layout/ui/button";
import { Badge } from "@/components/layout/ui/badge";
import { Input } from "@/components/layout/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/layout/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/layout/ui/table";
import { Users, Search, Filter, Eye, MessageSquare, Phone, Mail, Calendar, Loader2 } from "lucide-react";
import apiService from "@/services/api";

const MentorStudents = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "mentor") {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch mentor's students from API
  const { data: studentsData, isLoading, error } = useQuery(
    'mentorStudents',
    () => apiService.get('/mentors/students'),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const students = studentsData?.data || [];

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <DashboardLayout role="mentor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Students</h1>
            <p className="text-muted-foreground">Monitor and support your assigned mentees</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="px-3 py-1">
              <Users className="w-4 h-4 mr-2" />
              {students.length} Assigned Students
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
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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
            <CardTitle>Assigned Students</CardTitle>
            <CardDescription>Detailed information about your mentees and their progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>USN</TableHead>
                    <TableHead>CGPA</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Backlogs</TableHead>
                    <TableHead>Last Intervention</TableHead>
                    <TableHead>Status</TableHead>
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
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium text-foreground">{student.cgpa}</p>
                          <p className="text-muted-foreground">SGPA: {student.sgpa}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${student.attendance >= 85 ? 'text-success' : student.attendance >= 75 ? 'text-warning' : 'text-destructive'}`}>
                          {student.attendance}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <RiskBadge level={student.riskLevel.toLowerCase() as 'low' | 'medium' | 'high'} />
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${student.backlogs === 0 ? 'text-success' : student.backlogs <= 2 ? 'text-warning' : 'text-destructive'}`}>
                          {student.backlogs}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium text-foreground">{student.lastIntervention}</p>
                          <p className="text-muted-foreground">{student.interventionType}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(student.status)}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4 mr-1" />
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common mentoring activities and interventions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button className="h-auto p-4 flex flex-col items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                <span>Schedule Meeting</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Mail className="w-6 h-6" />
                <span>Send Email</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Phone className="w-6 h-6" />
                <span>Call Student</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Calendar className="w-6 h-6" />
                <span>Log Intervention</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MentorStudents;
