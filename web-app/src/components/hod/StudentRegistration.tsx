import React, { useState } from 'react';
import { Upload, Download, Users, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../layout/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../layout/ui/card';
import { Alert, AlertDescription } from '../layout/ui/alert';
import { Progress } from '../layout/ui/progress';

interface RegistrationResult {
  total: number;
  successful: number;
  errors: number;
  duplicates: number;
}

interface RegistrationDetails {
  success: Array<{ USN: string; name: string; message: string }>;
  errors: Array<{ USN: string; error: string }>;
  duplicates: Array<{ USN: string; message: string }>;
}

const StudentRegistration: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<RegistrationResult | null>(null);
  const [details, setDetails] = useState<RegistrationDetails | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setDetails(null);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/students/template');

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student_registration_template.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Failed to download template:', response.status);
      }
    } catch (error) {
      console.error('Error downloading template:', error);
    }
  };

  const uploadStudents = async () => {
    if (!file) return;

    const token = sessionStorage.getItem('accessToken');
    const userRole = sessionStorage.getItem('userRole');
    
    console.log('Token:', token ? 'Present' : 'Missing');
    console.log('User Role:', userRole);
    
    if (!token) {
      console.error('No authentication token found');
      return;
    }
    
    if (userRole !== 'hod') {
      console.error('Only HODs can register students');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('studentsFile', file);

    try {
      const response = await fetch('http://localhost:5000/api/auth/students/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.status === 401) {
        console.error('Unauthorized - please login again');
        return;
      }
      
      if (response.status === 403) {
        console.error('Forbidden - insufficient permissions');
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        setResult(data.results);
        setDetails(data.details);
      } else {
        // Handle format validation errors
        if (data.formatErrors) {
          setDetails({
            success: [],
            errors: data.formatErrors.map((error, index) => ({
              USN: `Format Error ${index + 1}`,
              error: error
            })),
            duplicates: []
          });
          setResult({
            total: 0,
            successful: 0,
            errors: data.formatErrors.length,
            duplicates: 0
          });
        }
      }
    } catch (error) {
      console.error('Error uploading students:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Student Registration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={downloadTemplate} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Upload Excel file with student data
                  </span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    className="sr-only"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>
            </div>
          </div>

          {file && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm">{file.name}</span>
              <Button 
                onClick={uploadStudents} 
                disabled={uploading}
                className="ml-4"
              >
                {uploading ? 'Uploading...' : 'Upload Students'}
              </Button>
            </div>
          )}

          {uploading && (
            <div className="space-y-2">
              <Progress value={50} />
              <p className="text-sm text-gray-600">Processing student data...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Registration Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{result.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{result.successful}</div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{result.errors}</div>
                <div className="text-sm text-gray-600">Errors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{result.duplicates}</div>
                <div className="text-sm text-gray-600">Duplicates</div>
              </div>
            </div>

            {details && (
              <div className="space-y-4">
                {details.success.length > 0 && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Successfully registered:</strong>
                      <ul className="mt-2 space-y-1">
                        {details.success.slice(0, 5).map((item, index) => (
                          <li key={index} className="text-sm">
                            {item.USN} - {item.name}
                          </li>
                        ))}
                        {details.success.length > 5 && (
                          <li className="text-sm text-gray-600">
                            ...and {details.success.length - 5} more
                          </li>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {details.errors.length > 0 && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Errors:</strong>
                      <ul className="mt-2 space-y-1">
                        {details.errors.slice(0, 3).map((item, index) => (
                          <li key={index} className="text-sm">
                            {item.USN}: {item.error}
                          </li>
                        ))}
                        {details.errors.length > 3 && (
                          <li className="text-sm">
                            ...and {details.errors.length - 3} more errors
                          </li>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {details.duplicates.length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Duplicates skipped:</strong>
                      <ul className="mt-2 space-y-1">
                        {details.duplicates.slice(0, 3).map((item, index) => (
                          <li key={index} className="text-sm">
                            {item.USN}
                          </li>
                        ))}
                        {details.duplicates.length > 3 && (
                          <li className="text-sm">
                            ...and {details.duplicates.length - 3} more
                          </li>
                        )}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Excel Format:</strong> File must contain exactly 2 columns - USN and Name. 
          USN format: 2KA21CS001. Students login using USN only.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default StudentRegistration;