import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RiskBadge from "@/components/layout/RiskBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Button } from "@/components/layout/ui/button";
import { Badge } from "@/components/layout/ui/badge";
import { Input } from "@/components/layout/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/layout/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/layout/ui/table";
import { AlertTriangle, Search, Filter, Eye, MessageSquare, Phone, Mail, Calendar, TrendingDown, AlertCircle, Clock } from "lucide-react";

const MentorAtRisk = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "mentor") {
      navigate("/login");
    }
  }, [navigate]);

  // Mock at-risk student data
  const atRiskStudents = [
    {
      id: 1,
      name: "Vikram Joshi",
      usn: "1BM21CS005",
      semester: 5,
      branch: "CSE",
      email: "vikram.joshi@example.com",
      phone: "+91 9876543214",
      cgpa: 6.8,
      sgpa: 7.2,
      attendance: 65,
      riskLevel: "High",
      riskFactors: ["Low Attendance", "Poor CGPA", "Multiple Backlogs"],
      lastIntervention: "2024-01-14",
      interventionType: "Academic Counseling",
      status: "Urgent",
      backlogs: 2,
      trend: "Declining",
      predictedRisk: 92
    },
    {
      id: 2,
      name: "Rohan Patel",
      usn: "1BM21CS003",
      semester: 5,
      branch: "CSE",
      email: "rohan.patel@example.com",
      phone: "+91 9876543212",
      cgpa: 7.5,
      sgpa: 7.8,
      attendance: 78,
      riskLevel: "Medium",
      riskFactors: ["Irregular Attendance", "Backlog"],
      lastIntervention: "2024-01-12",
      interventionType: "Attendance Follow-up",
      status: "Active",
      backlogs: 1,
      trend: "Stable",
      predictedRisk: 68
    },
    {
      id: 3,
      name: "John Doe",
      usn: '2KA21CS015',
      semester: 5,
      branch: "CSE",
      email: "john.doe@example.com",
      phone: "+91 9876543215",
      cgpa: 6.2,
      sgpa: 6.5,
      attendance: 58,
      riskLevel: "High",
      riskFactors: ["Very Low Attendance", "Poor Performance", "Multiple Backlogs"],
      lastIntervention: "2024-01-10",
      interventionType: "Academic Counseling",
      status: "Critical",
      backlogs: 3,
      trend: "Declining",
      predictedRisk: 95
    },
    {
      id: 4,
      name: "Sneha Reddy",
      usn: "1BM21CS004",
      semester: 5,
      branch: "CSE",
      email: "sneha.reddy@example.com",
      phone: "+91 9876543213",
      cgpa: 8.0,
      sgpa: 8.2,
      attendance: 85,
      riskLevel: "Low",
      riskFactors: ["Recent Performance Dip"],
      lastIntervention: "2024-01-08",
      interventionType: "Study Skills Workshop",
      status: "Monitor",
      backlogs: 0,
      trend: "Improving",
      predictedRisk: 45
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'urgent': return 'destructive';
      case 'critical': return 'destructive';
      case 'active': return 'secondary';
      case 'monitor': return 'default';
      default: return 'outline';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'declining': return <TrendingDown className="w-4 h-4 text-destructive" />;
      case 'stable': return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'improving': return <TrendingDown className="w-4 h-4 text-success rotate-180" />;
      default: return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <DashboardLayout role="mentor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">At-Risk Students</h1>
            <p className="text-muted-foreground">Students requiring immediate attention and intervention</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="destructive" className="px-3 py-1">
              <AlertTriangle className="w-4 h-4 mr-2" />
              {atRiskStudents.length} At-Risk Students
            </Badge>
          </div>
        </div>

        {/* Critical Alerts */}
        <Card className="border-destructive/20 bg-gradient-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  Critical Priority Students
                </CardTitle>
                <CardDescription>Students with high risk requiring immediate intervention</CardDescription>
              </div>
              <RiskBadge level="high" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {atRiskStudents.filter(student => student.riskLevel === 'High').map((student) => (
              <div key={student.id} className="p-4 rounded-lg border border-destructive/20 bg-destructive/5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-destructive">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.usn}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">Predicted Risk:</span>
                        <span className="text-xs font-medium text-destructive">{student.predictedRisk}%</span>
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="text-muted-foreground">CGPA: <span className="font-medium text-foreground">{student.cgpa}</span></p>
                      <p className="text-muted-foreground">Attendance: <span className="font-medium text-foreground">{student.attendance}%</span></p>
                      <p className="text-muted-foreground">Backlogs: <span className="font-medium text-foreground">{student.backlogs}</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(student.trend)}
                      <span className="text-sm text-muted-foreground">{student.trend}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusBadgeVariant(student.status)}>
                      {student.status}
                    </Badge>
                    <Button size="sm" variant="destructive">Contact Now</Button>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground mb-2">Risk Factors:</p>
                  <div className="flex flex-wrap gap-2">
                    {student.riskFactors.map((factor, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search at-risk students by name or USN..."
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
                  <SelectItem value="high">High Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="monitor">Monitor</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* At-Risk Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>All At-Risk Students</CardTitle>
            <CardDescription>Detailed view of students requiring mentoring intervention</CardDescription>
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
                    <TableHead>Trend</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {atRiskStudents.map((student) => (
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
                        <div className="flex items-center gap-2">
                          <RiskBadge level={student.riskLevel.toLowerCase() as 'low' | 'medium' | 'high'} />
                          <span className="text-xs text-muted-foreground">{student.predictedRisk}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${student.backlogs === 0 ? 'text-success' : student.backlogs <= 2 ? 'text-warning' : 'text-destructive'}`}>
                          {student.backlogs}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(student.trend)}
                          <span className="text-sm text-muted-foreground">{student.trend}</span>
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
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {atRiskStudents.filter(s => s.riskLevel === 'High').length}
                  </p>
                  <p className="text-sm text-muted-foreground">High Risk</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {atRiskStudents.filter(s => s.riskLevel === 'Medium').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Medium Risk</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {atRiskStudents.filter(s => s.status === 'Critical' || s.status === 'Urgent').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Urgent Cases</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-success/10 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-success rotate-180" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {atRiskStudents.filter(s => s.trend === 'Improving').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Improving</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Intervention Actions</CardTitle>
            <CardDescription>Common intervention strategies for at-risk students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button className="h-auto p-4 flex flex-col items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                <span>Schedule Counseling</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Mail className="w-6 h-6" />
                <span>Send Warning Email</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Phone className="w-6 h-6" />
                <span>Call Parent</span>
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

export default MentorAtRisk;
