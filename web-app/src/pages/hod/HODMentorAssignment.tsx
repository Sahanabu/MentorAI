import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Button } from "@/components/layout/ui/button";
import { Input } from "@/components/layout/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/layout/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/layout/ui/table";
import { Badge } from "@/components/layout/ui/badge";
import { Alert, AlertDescription } from "@/components/layout/ui/alert";
import { Users, UserCheck, Shuffle, Plus, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { apiService } from "@/services/api";

interface Student {
  _id: string;
  usn: string;
  profile: { firstName: string; lastName: string };
  studentInfo: { currentSemester: number; entryType: string };
}

interface Mentor {
  _id: string;
  profile: { firstName: string; lastName: string };
}

interface Assignment {
  _id: string;
  mentorId: { _id: string; profile: { firstName: string; lastName: string } };
  assignedStudents: Student[];
}

const HODMentorAssignment = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [maxStudentsPerMentor, setMaxStudentsPerMentor] = useState(20);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (role !== "hod") {
      navigate("/login");
    }
    loadAssignmentData();
  }, [navigate]);

  const loadAssignmentData = async () => {
    try {
      const response = await apiService.get('/mentor-assignments/data');
      if (response.success) {
        setStudents(response.data.students);
        setMentors(response.data.mentors);
        setAssignments(response.data.assignments);
      }
    } catch (error) {
      toast.error('Failed to load assignment data');
    }
  };

  const handleAutoDistribute = async () => {
    setLoading(true);
    try {
      const response = await apiService.post('/mentor-assignments/auto-distribute', {
        semester: selectedSemester === "all" ? undefined : selectedSemester,
        maxStudentsPerMentor
      });
      
      if (response.success) {
        toast.success(response.message);
        loadAssignmentData();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to distribute students');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId: string, mentorId: string) => {
    try {
      const response = await apiService.post('/mentor-assignments/remove', {
        studentId,
        mentorId
      });
      
      if (response.success) {
        toast.success('Student removed successfully');
        loadAssignmentData();
      }
    } catch (error) {
      toast.error('Failed to remove student');
    }
  };

  const unassignedStudents = students.filter(s => 
    !assignments.some(a => a.assignedStudents?.some(as => as._id === s._id))
  );

  return (
    <DashboardLayout role="hod">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Mentor Assignment</h1>
          <p className="text-muted-foreground">Distribute students evenly among mentors</p>
        </div>

        {/* Stats Cards */}
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
                  <UserCheck className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{mentors.length}</p>
                  <p className="text-sm text-muted-foreground">Available Mentors</p>
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
                  <p className="text-2xl font-bold text-foreground">{unassignedStudents.length}</p>
                  <p className="text-sm text-muted-foreground">Unassigned</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-info/10 rounded-lg">
                  <Shuffle className="w-6 h-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{assignments.length}</p>
                  <p className="text-sm text-muted-foreground">Active Assignments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Auto Distribution Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shuffle className="w-5 h-5 text-primary" />
              Auto Distribution
            </CardTitle>
            <CardDescription>Automatically distribute students evenly among available mentors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground mb-2 block">Filter by Semester (Optional)</label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="All semesters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    <SelectItem value="5">Semester 5</SelectItem>
                    <SelectItem value="6">Semester 6</SelectItem>
                    <SelectItem value="7">Semester 7</SelectItem>
                    <SelectItem value="8">Semester 8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground mb-2 block">Max Students per Mentor</label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={maxStudentsPerMentor}
                  onChange={(e) => setMaxStudentsPerMentor(parseInt(e.target.value))}
                />
              </div>
              <Button 
                onClick={handleAutoDistribute} 
                disabled={loading || mentors.length === 0}
                className="gap-2"
              >
                <Shuffle className="w-4 h-4" />
                {loading ? 'Distributing...' : 'Auto Distribute'}
              </Button>
            </div>
            
            {unassignedStudents.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {unassignedStudents.length} students are currently unassigned and will be distributed among mentors.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Current Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Current Mentor Assignments</CardTitle>
            <CardDescription>View and manage current student-mentor assignments</CardDescription>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Assignments Yet</h3>
                <p className="text-muted-foreground">Use auto-distribution to assign students to mentors.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {assignments.map((assignment) => (
                  <div key={assignment._id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {assignment.mentorId?.profile?.firstName} {assignment.mentorId?.profile?.lastName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {assignment.assignedStudents?.length || 0} students assigned
                        </p>
                      </div>
                      <Badge variant="outline">
                        Mentor
                      </Badge>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>USN</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Semester</TableHead>
                            <TableHead>Entry Type</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {assignment.assignedStudents?.map((student) => (
                            <TableRow key={student._id}>
                              <TableCell className="font-mono">{student.usn}</TableCell>
                              <TableCell>
                                {student.profile?.firstName} {student.profile?.lastName}
                              </TableCell>
                              <TableCell>{student.studentInfo?.currentSemester || 'N/A'}</TableCell>
                              <TableCell>
                                <Badge variant={student.studentInfo?.entryType === 'REGULAR' ? 'default' : 'secondary'}>
                                  {student.studentInfo?.entryType || 'N/A'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRemoveStudent(student._id, assignment.mentorId._id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Remove
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Unassigned Students */}
        {unassignedStudents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Unassigned Students
              </CardTitle>
              <CardDescription>Students who haven't been assigned to any mentor yet</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>USN</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Entry Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unassignedStudents.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell className="font-mono">{student.usn}</TableCell>
                      <TableCell>
                        {student.profile?.firstName} {student.profile?.lastName}
                      </TableCell>
                      <TableCell>{student.studentInfo?.currentSemester || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={student.studentInfo?.entryType === 'REGULAR' ? 'default' : 'secondary'}>
                          {student.studentInfo?.entryType || 'N/A'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HODMentorAssignment;