import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Edit, Download, Mail, Phone, MessageSquare, Calendar, Save } from "lucide-react";
import { toast } from "sonner";
import { dynamicDashboardService } from "@/services/dynamicDashboardService";

interface ActionButtonsProps {
  type: 'view' | 'edit' | 'export' | 'contact' | 'schedule';
  data?: any;
  onAction?: (action: string, data?: any) => void;
}

export const ViewButton = ({ data, onAction }: { data?: any; onAction?: (action: string, data?: any) => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<any>(null);

  const handleView = async () => {
    if (data?.id || data?._id) {
      setLoading(true);
      try {
        const studentDetails = await dynamicDashboardService.viewStudentDetails(data.id || data._id);
        setDetails(studentDetails);
        onAction?.('view', studentDetails);
      } catch (error) {
        toast.error('Failed to load details');
      } finally {
        setLoading(false);
      }
    }
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" onClick={handleView}>
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
          <DialogDescription>Comprehensive student information and performance data</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : details ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <p className="font-medium">{details.name}</p>
              </div>
              <div>
                <Label>USN</Label>
                <p className="font-medium">{details.usn}</p>
              </div>
              <div>
                <Label>CGPA</Label>
                <p className="font-medium">{details.cgpa}</p>
              </div>
              <div>
                <Label>Attendance</Label>
                <p className="font-medium">{details.attendance}%</p>
              </div>
            </div>
            <div>
              <Label>Recent Performance</Label>
              <div className="mt-2 space-y-2">
                {details.subjects?.map((subject: any, index: number) => (
                  <div key={index} className="flex justify-between p-2 border rounded">
                    <span>{subject.name}</span>
                    <span className="font-medium">{subject.marks}/100</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            Click view to load student details
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const EditButton = ({ data, onAction }: { data?: any; onAction?: (action: string, data?: any) => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: data?.name || '',
    email: data?.email || '',
    phone: data?.phone || '',
    notes: data?.notes || ''
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await dynamicDashboardService.updateStudentData(data?.id || data?._id, formData);
      toast.success('Student data updated successfully');
      onAction?.('edit', formData);
      setOpen(false);
    } catch (error) {
      toast.error('Failed to update student data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Student Information</DialogTitle>
          <DialogDescription>Update student details and add notes</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Add any additional notes..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="w-4 h-4 mr-1" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ExportButton = ({ type = 'analytics', format = 'pdf', onAction }: { type?: string; format?: string; onAction?: (action: string, data?: any) => void }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      await dynamicDashboardService.exportAnalytics(type, format);
      toast.success(`${type} exported successfully`);
      onAction?.('export', { type, format });
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="sm" variant="outline" onClick={handleExport} disabled={loading}>
      <Download className="w-4 h-4 mr-1" />
      {loading ? 'Exporting...' : 'Export'}
    </Button>
  );
};

export const ContactButton = ({ data, type = 'email' }: { data?: any; type?: 'email' | 'phone' | 'message' }) => {
  const handleContact = () => {
    if (type === 'email' && data?.email) {
      window.open(`mailto:${data.email}?subject=Academic Discussion&body=Hello ${data.name},`);
    } else if (type === 'phone' && data?.phone) {
      window.open(`tel:${data.phone}`);
    } else if (type === 'message') {
      toast.info('Message feature will be implemented soon');
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4 mr-1" />;
      case 'phone': return <Phone className="w-4 h-4 mr-1" />;
      case 'message': return <MessageSquare className="w-4 h-4 mr-1" />;
      default: return <Mail className="w-4 h-4 mr-1" />;
    }
  };

  return (
    <Button size="sm" variant="outline" onClick={handleContact}>
      {getIcon()}
      {type === 'email' ? 'Email' : type === 'phone' ? 'Call' : 'Message'}
    </Button>
  );
};

export const ScheduleButton = ({ data, onAction }: { data?: any; onAction?: (action: string, data?: any) => void }) => {
  const [open, setOpen] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    type: 'meeting',
    date: '',
    time: '',
    notes: ''
  });

  const handleSchedule = () => {
    toast.success('Meeting scheduled successfully');
    onAction?.('schedule', scheduleData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Calendar className="w-4 h-4 mr-1" />
          Schedule
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Meeting</DialogTitle>
          <DialogDescription>Schedule a mentoring session or meeting</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={scheduleData.date}
              onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={scheduleData.time}
              onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="notes">Meeting Notes</Label>
            <Textarea
              id="notes"
              value={scheduleData.notes}
              onChange={(e) => setScheduleData({...scheduleData, notes: e.target.value})}
              placeholder="Meeting agenda or notes..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSchedule}>
              <Calendar className="w-4 h-4 mr-1" />
              Schedule Meeting
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};