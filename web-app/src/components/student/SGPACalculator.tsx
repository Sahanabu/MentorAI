import React, { useState } from 'react';
import { Calculator, Plus, Trash2 } from 'lucide-react';
import { Button } from '../layout/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../layout/ui/card';
import { Input } from '../layout/ui/input';

interface Subject {
  id: number;
  code: string;
  credits: number;
  marks: number;
}

const SGPACalculator: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, code: '', credits: 3, marks: 0 }
  ]);
  const [sgpa, setSGPA] = useState<number | null>(null);

  const getGradePoints = (marks: number): number => {
    if (marks >= 90) return 10;
    if (marks >= 80) return 9;
    if (marks >= 70) return 8;
    if (marks >= 60) return 7;
    if (marks >= 55) return 6;
    if (marks >= 50) return 5;
    if (marks >= 40) return 4;
    return 0;
  };

  const getGrade = (marks: number): string => {
    if (marks >= 90) return 'O';
    if (marks >= 80) return 'A+';
    if (marks >= 70) return 'A';
    if (marks >= 60) return 'B+';
    if (marks >= 55) return 'B';
    if (marks >= 50) return 'C';
    if (marks >= 40) return 'P';
    return 'F';
  };

  const addSubject = () => {
    const newId = Math.max(...subjects.map(s => s.id)) + 1;
    setSubjects([...subjects, { id: newId, code: '', credits: 3, marks: 0 }]);
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const updateSubject = (id: number, field: keyof Subject, value: string | number) => {
    setSubjects(subjects.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const calculateSGPA = () => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    subjects.forEach(subject => {
      if (subject.credits > 0) {
        const gradePoints = getGradePoints(subject.marks);
        totalCredits += subject.credits;
        totalGradePoints += gradePoints * subject.credits;
      }
    });

    const calculatedSGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    setSGPA(Math.round(calculatedSGPA * 100) / 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            SGPA Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600 mb-2">
            <div className="col-span-3">Subject Code</div>
            <div className="col-span-2">Credits</div>
            <div className="col-span-2">Marks</div>
            <div className="col-span-2">Grade</div>
            <div className="col-span-2">Points</div>
            <div className="col-span-1">Action</div>
          </div>

          {subjects.map((subject) => (
            <div key={subject.id} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-3">
                <Input
                  placeholder="Subject Code"
                  value={subject.code}
                  onChange={(e) => updateSubject(subject.id, 'code', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <select
                  className="w-full p-2 border rounded"
                  value={subject.credits}
                  onChange={(e) => updateSubject(subject.id, 'credits', parseInt(e.target.value))}
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  placeholder="Marks"
                  min="0"
                  max="100"
                  value={subject.marks || ''}
                  onChange={(e) => updateSubject(subject.id, 'marks', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="col-span-2">
                <div className="text-center font-medium">
                  {getGrade(subject.marks)}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-center font-medium">
                  {getGradePoints(subject.marks)}
                </div>
              </div>
              <div className="col-span-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSubject(subject.id)}
                  disabled={subjects.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <Button onClick={addSubject} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
            <Button onClick={calculateSGPA}>
              Calculate SGPA
            </Button>
          </div>

          {sgpa !== null && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{sgpa}</div>
                  <div className="text-sm text-gray-600">Your SGPA</div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>VTU Grading Scale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="font-medium">Grade</div>
            <div className="font-medium">Points</div>
            <div className="font-medium">Marks %</div>
            <div className="font-medium">Description</div>
            
            <div>O</div><div>10</div><div>90-100</div><div>Outstanding</div>
            <div>A+</div><div>9</div><div>80-89</div><div>Excellent</div>
            <div>A</div><div>8</div><div>70-79</div><div>Very Good</div>
            <div>B+</div><div>7</div><div>60-69</div><div>Good</div>
            <div>B</div><div>6</div><div>55-59</div><div>Above Average</div>
            <div>C</div><div>5</div><div>50-54</div><div>Average</div>
            <div>P</div><div>4</div><div>40-49</div><div>Pass</div>
            <div>F</div><div>0</div><div>0-39</div><div>Fail</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SGPACalculator;