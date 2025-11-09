class WebSocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  initialize(io) {
    this.io = io;
    
    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Handle user authentication
      socket.on('authenticate', (data) => {
        const { userId, role } = data;
        this.connectedUsers.set(socket.id, { userId, role, socketId: socket.id });
        socket.join(`user_${userId}`);
        socket.join(`role_${role}`);
        
        console.log(`User authenticated: ${userId} (${role})`);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.connectedUsers.delete(socket.id);
        console.log(`User disconnected: ${socket.id}`);
      });

      // Handle real-time notifications
      socket.on('join_room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
      });

      socket.on('leave_room', (room) => {
        socket.leave(room);
        console.log(`User ${socket.id} left room: ${room}`);
      });
    });
  }

  // Send notification to specific user
  sendToUser(userId, event, data) {
    if (this.io) {
      this.io.to(`user_${userId}`).emit(event, data);
    }
  }

  // Send notification to users with specific role
  sendToRole(role, event, data) {
    if (this.io) {
      this.io.to(`role_${role}`).emit(event, data);
    }
  }

  // Send notification to specific room
  sendToRoom(room, event, data) {
    if (this.io) {
      this.io.to(room).emit(event, data);
    }
  }

  // Broadcast to all connected users
  broadcast(event, data) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }

  // Send at-risk student alert to mentors
  sendAtRiskAlert(mentorId, studentData) {
    this.sendToUser(mentorId, 'at_risk_alert', {
      type: 'AT_RISK_STUDENT',
      student: studentData,
      timestamp: new Date().toISOString()
    });
  }

  // Send performance update notification
  sendPerformanceUpdate(userId, performanceData) {
    this.sendToUser(userId, 'performance_update', {
      type: 'PERFORMANCE_UPDATE',
      data: performanceData,
      timestamp: new Date().toISOString()
    });
  }

  // Send assignment deadline reminder
  sendAssignmentReminder(studentIds, assignmentData) {
    studentIds.forEach(studentId => {
      this.sendToUser(studentId, 'assignment_reminder', {
        type: 'ASSIGNMENT_REMINDER',
        assignment: assignmentData,
        timestamp: new Date().toISOString()
      });
    });
  }

  // Send attendance alert
  sendAttendanceAlert(studentId, attendanceData) {
    this.sendToUser(studentId, 'attendance_alert', {
      type: 'ATTENDANCE_ALERT',
      data: attendanceData,
      timestamp: new Date().toISOString()
    });
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.connectedUsers.size;
  }

  // Get connected users by role
  getConnectedUsersByRole(role) {
    return Array.from(this.connectedUsers.values()).filter(user => user.role === role);
  }
}

module.exports = new WebSocketService();