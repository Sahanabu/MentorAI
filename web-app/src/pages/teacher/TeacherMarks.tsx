import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/layout/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/layout/ui/table";
import { Button } from "@/components/layout/ui/button";
import { Input } from "@/components/layout/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/layout/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/layout/ui/tabs";
import { Badge } from "@/components/layout/ui/badge";
import { Alert, AlertDescription } from "@/components/layout/ui/alert";
import { BookOpen, Save, Send, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentMark {
  usn: string;
  name: string;
  marks: {
    IA1: number | null;
    IA2: number | null;
    Final: number | null;
  };
  status: 'draft' | 'submitted';
}

const TeacherMarks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedAssessment, setSelectedAssessment] = useState<string>("IA1");
  const [studentMarks, setStudentMarks] = useState<StudentMark[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "teacher") {
      navigate("/login");
    }
  }, [navigate]);

  // Mock data
  const subjects = [
    { id: "21CS51", name: "Software Engineering", semester: 5 },
    { id: "21CS52", name: "Database Management", semester: 5 },
    { id: "21CS53", name: "Computer Networks", semester: 5 },
  ];

  const mockStudents: StudentMark[] = [
    {
      usn: "1BM21CS001",
      name: "Alice Johnson",
      marks: { IA1: 18, IA2: 16, Final: 85 },
      status: "submitted"
    },
    {
      usn: "1BM21CS002",
      name: "Bob Smith",
      marks: { IA1: 15, IA2: null, Final: null },
      status: "draft"
    },
    {
      usn: "1BM21CS003",
      name: "Charlie Brown",
      marks: { IA1: 19, IA2: 17, Final: 92 },
      status: "submitted"
    },
    {
      usn: "1BM21CS004",
      name: "Diana Wilson",
      marks: { IA1: null, IA2: null, Final: null },
      status: "draft"
    },
    {
      usn: "1BM21CS005",
      name: "Edward Davis",
      marks: { IA1: 17, IA2: 14, Final: 78 },
      status: "submitted"
    },
  ];

  useEffect(() => {
    if (selectedSubject) {
      setStudentMarks(mockStudents);
    }
  }, [selectedSubject]);

  const handleMarkChange = (usn: string, assessment: string, value: string) => {
    const numValue = value === "" ? null : parseInt(value);
    setStudentMarks(prev =>
      prev.map(student =>
        student.usn === usn
          ? {
              ...student,
              marks: { ...student.marks, [assessment]: numValue },
              status: 'draft'
            }
          : student
      )
    );
    setHasUnsavedChanges(true);
  };

  const validateMarks = (assessment: string) => {
    const maxMarks = assessment === 'Final' ? 100 : 20;
    return studentMarks.every(student => {
      const mark = student.marks[assessment as keyof typeof student.marks];
      return mark === null || (mark >= 0 && mark <= maxMarks);
    });
  };

  const handleSaveDraft = () => {
    if (!validateMarks(selectedAssessment)) {
      toast({
        title: "Invalid Marks",
        description: `Marks must be between 0 and ${selectedAssessment === 'Final' ? 100 : 20}`,
        variant: "destructive",
      });
      return;
    }

    // Mock save operation
    setTimeout(() => {
      setHasUnsavedChanges(false);
      toast({
        title: "Draft Saved",
        description: "Marks have been saved as draft successfully.",
      });
    }, 500);
  };

  const handleSubmit = () => {
    if (!validateMarks(selectedAssessment)) {
      toast({
        title: "Invalid Marks",
        description: `Marks must be between 0 and ${selectedAssessment === 'Final' ? 100 : 20}`,
        variant: "destructive",
      });
      return;
    }

    // Mock submit operation
    setTimeout(() => {
      setStudentMarks(prev =>
        prev.map(student => ({
          ...student,
          status: 'submitted'
        }))
      );
      setHasUnsavedChanges(false);
      toast({
        title: "Marks Submitted",
        description: "Marks have been submitted and finalized.",
      });
    }, 500);
  };

  const getMarkInput = (student: StudentMark, assessment: string) => {
    const mark = student.marks[assessment as keyof typeof student.marks];
    const maxMarks = assessment === 'Final' ? 100 : 20;

    return (
      <Input
        type="number"
        min="0"
        max={maxMarks}
        value={mark ?? ""}
        onChange={(e) => handleMarkChange(student.usn, assessment, e.target.value)}
        placeholder="0"
        className="w-20 text-center"
        disabled={student.status === 'submitted'}
      />
    );
  };

  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);

  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Marks Entry</h1>
            <p className="text-muted-foreground">Enter and manage student marks for your subjects</p>
          </div>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name} ({subject.id}) - Sem {subject.semester}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedSubject && (
          <>
            {/* Subject Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  {selectedSubjectData?.name} ({selectedSubjectData?.id})
                </CardTitle>
                <CardDescription>
                  Semester {selectedSubjectData?.semester} • {studentMarks.length} students
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Assessment Tabs */}
            <Tabs value={selectedAssessment} onValueChange={setSelectedAssessment}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="IA1">Internal Assessment 1 (0-20)</TabsTrigger>
                <TabsTrigger value="IA2">Internal Assessment 2 (0-20)</TabsTrigger>
                <TabsTrigger value="Final">Final Exam (0-100)</TabsTrigger>
              </TabsList>

              {["IA1", "IA2", "Final"].map((assessment) => (
                <TabsContent key={assessment} value={assessment} className="space-y-4">
                  {/* Unsaved Changes Alert */}
                  {hasUnsavedChanges && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        You have unsaved changes. Remember to save your draft or submit the marks.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Marks Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle>{assessment} Marks Entry</CardTitle>
                      <CardDescription>
                        Enter marks for {assessment}. Range: 0-{assessment === 'Final' ? 100 : 20}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>USN</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead className="text-center">Marks</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {studentMarks.map((student) => (
                            <TableRow key={student.usn}>
                              <TableCell className="font-mono">{student.usn}</TableCell>
                              <TableCell className="font-medium">{student.name}</TableCell>
                              <TableCell className="text-center">
                                {getMarkInput(student, assessment)}
                              </TableCell>
                              <TableCell>
                                <Badge variant={student.status === 'submitted' ? 'default' : 'secondary'}>
                                  {student.status === 'submitted' ? (
                                    <><CheckCircle className="w-3 h-3 mr-1" /> Submitted</>
                                  ) : (
                                    'Draft'
                                  )}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-4 justify-end">
                    <Button
                      onClick={handleSaveDraft}
                      disabled={!hasUnsavedChanges}
                      variant="outline"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!hasUnsavedChanges}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Marks
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </>
        )}

        {!selectedSubject && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Select a Subject</h3>
              <p className="text-muted-foreground">
                Choose a subject from the dropdown above to start entering marks.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherMarks;
