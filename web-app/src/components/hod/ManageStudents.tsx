import React, { useState, useEffect } from 'react';
import { Edit, Search, Users, Save, X } from 'lucide-react';
import { Button } from '../layout/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../layout/ui/card';
import { Input } from '../layout/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../layout/ui/select';

interface Student {
  _id: string;
  usn: string;
  profile: {
    firstName: string;
    lastName: string;
  };
  studentInfo: {
    currentSemester: number;
    entryType: string;
    cgpa: number;
  };
  department: string;
}

const ManageStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, semesterFilter]);

  const fetchStudents = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await fetch('http://localhost:5000/api/cgpa/students/current', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;
    
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.usn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${student.profile.firstName} ${student.profile.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (semesterFilter !== 'all') {
      filtered = filtered.filter(student => 
        student.studentInfo.currentSemester === parseInt(semesterFilter)
      );
    }
    
    setFilteredStudents(filtered);
  };

  const startEdit = (student: Student) => {
    setEditingStudent(student._id);
    setEditForm({
      firstName: student.profile.firstName,
      lastName: student.profile.lastName,
      currentSemester: student.studentInfo.currentSemester,
      cgpa: student.studentInfo.cgpa
    });
  };

  const saveEdit = async (studentId: string) => {
    try {
      const token = sessionStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5000/api/users/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          profile: {
            firstName: editForm.firstName,
            lastName: editForm.lastName
          },
          studentInfo: {
            currentSemester: editForm.currentSemester,
            cgpa: editForm.cgpa
          }
        })
      });

      if (response.ok) {
        await fetchStudents();
        setEditingStudent(null);
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const cancelEdit = () => {
    setEditingStudent(null);
    setEditForm({});
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading students...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manage Students
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by USN or Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {[1,2,3,4,5,6,7,8].map(sem => (
                  <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">USN</th>
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Semester</th>
                  <th className="text-left py-3 px-4 font-semibold">Entry Type</th>
                  <th className="text-left py-3 px-4 font-semibold">CGPA</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{student.usn}</td>
                    <td className="py-3 px-4">
                      {editingStudent === student._id ? (
                        <div className="flex gap-2">
                          <Input
                            value={editForm.firstName}
                            onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                            className="w-24"
                          />
                          <Input
                            value={editForm.lastName}
                            onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                            className="w-24"
                          />
                        </div>
                      ) : (
                        `${student.profile.firstName} ${student.profile.lastName}`
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editingStudent === student._id ? (
                        <Select 
                          value={editForm.currentSemester?.toString()} 
                          onValueChange={(value) => setEditForm({...editForm, currentSemester: parseInt(value)})}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1,2,3,4,5,6,7,8].map(sem => (
                              <SelectItem key={sem} value={sem.toString()}>{sem}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        student.studentInfo.currentSemester
                      )}
                    </td>
                    <td className="py-3 px-4">{student.studentInfo.entryType}</td>
                    <td className="py-3 px-4">
                      {editingStudent === student._id ? (
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="10"
                          value={editForm.cgpa}
                          onChange={(e) => setEditForm({...editForm, cgpa: parseFloat(e.target.value)})}
                          className="w-20"
                        />
                      ) : (
                        student.studentInfo.cgpa?.toFixed(2) || '0.00'
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editingStudent === student._id ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveEdit(student._id)}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => startEdit(student)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageStudents;