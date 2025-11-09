const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { parseUSN, getCurrentSemester } = require('../utils/usnParser');
const { USER_ROLES } = require('../config/constants');

class AuthService {
  /**
   * Generate JWT tokens
   */
  generateTokens(userId) {
    const payload = { userId };
    
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
    
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
    });
    
    return { accessToken, refreshToken };
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Register new user
   */
  async register(userData) {
    try {
      const { email, password, role, usn, profile, department } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { email },
          ...(usn ? [{ usn }] : [])
        ]
      });

      if (existingUser) {
        throw new Error('User already exists with this email or USN');
      }

    // Parse USN for students
    let studentInfo = null;
    if (role === USER_ROLES.STUDENT && usn) {
      const usnData = parseUSN(usn);
      const currentSemester = getCurrentSemester(usnData.admissionYear, usnData.entryType);
      
      studentInfo = {
        admissionYear: usnData.admissionYear,
        entryType: usnData.entryType,
        currentSemester
      };
    }

    // Create user
    const user = new User({
      email,
      password,
      role,
      usn: role === USER_ROLES.STUDENT ? usn : undefined,
      profile,
      department: department || (studentInfo ? parseUSN(usn).department : null),
      studentInfo: role === USER_ROLES.STUDENT ? studentInfo : undefined
    });

    await user.save();

    // Generate tokens
    const tokens = this.generateTokens(user._id);
    
    // Save refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // Remove sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    return {
      user: userResponse,
      tokens
    };
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    // Find user
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokens = this.generateTokens(user._id);

    // Update refresh token synchronously (critical for auth)
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // Remove sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    const result = {
      user: userResponse,
      tokens
    };

    // Update last login asynchronously (non-critical)
    setImmediate(async () => {
      try {
        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
      } catch (error) {
        console.error('Failed to update lastLogin:', error);
      }
    });

    return result;
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    try {
      const decoded = this.verifyToken(refreshToken);
      
      const user = await User.findById(decoded.userId);
      if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = this.generateTokens(user._id);
      
      // Update refresh token
      user.refreshToken = tokens.refreshToken;
      await user.save();

      return tokens;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Logout user
   */
  async logout(userId) {
    await User.findByIdAndUpdate(userId, {
      $unset: { refreshToken: 1 }
    });
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await User.findById(userId)
      .select('-password -refreshToken')
      .populate('studentInfo.mentorId', 'profile.firstName profile.lastName email')
      .populate('teacherInfo.subjectsTeaching', 'subjectName subjectCode');
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, updateData) {
    const allowedUpdates = ['profile', 'phone'];
    const updates = {};
    
    Object.keys(updateData).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = updateData[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  /**
   * Change password
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }
}

module.exports = new AuthService();