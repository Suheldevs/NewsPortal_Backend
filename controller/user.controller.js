import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../utils/sendResponse.js';
import { AppError } from '../utils/AppError.js';


export const signUp = async (req, res, next) => {
  try {
    const { fname, lname, email, password, phone, bio, profilePic } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    const hashedPassword = await bcrypt.hash(password);

    // Create new user
    const newUser = new User({
      fname,
      lname,
      email,
      password: hashedPassword,
      phone,
      bio,
      profilePic
    });

    await newUser.save();

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    sendResponse(res, 201, 'User registered successfully', userResponse);
  } catch (error) {
    next(error);
  }
};

// Sign In / Login User
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError('Account is deactivated. Please contact support', 403);
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    sendResponse(res, 200, 'Login successful', {
      user: userResponse,
      token
    });
  } catch (error) {
    next(error);
  }
};

// Get All Users
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, isActive } = req.query;
    
    // Build filter object
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      select: '-password', // Exclude password field
      sort: { createdAt: -1 }
    };

    const users = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .exec();

    const total = await User.countDocuments(filter);

    const responseData = {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    };

    sendResponse(res, 200, 'Users retrieved successfully', responseData);
  } catch (error) {
    next(error);
  }
};

// Get User by ID
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    sendResponse(res, 200, 'User retrieved successfully', user);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid user ID format', 400));
    }
    next(error);
  }
};

// Update User
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.password;
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Check if email is being updated and if it's already taken
    if (updateData.email) {
      const existingUser = await User.findOne({ 
        email: updateData.email, 
        _id: { $ne: id } 
      });
      if (existingUser) {
        throw new AppError('Email already exists', 400);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password');

    if (!updatedUser) {
      throw new AppError('User not found', 404);
    }

    sendResponse(res, 200, 'User updated successfully', updatedUser);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid user ID format', 400));
    }
    next(error);
  }
};

// Update Password
export const updatePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError('Current password and new password are required', 400);
    }

    if (newPassword.length < 6) {
      throw new AppError('New password must be at least 6 characters long', 400);
    }

    const user = await User.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await User.findByIdAndUpdate(id, { password: hashedNewPassword });

    sendResponse(res, 200, 'Password updated successfully');
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid user ID format', 400));
    }
    next(error);
  }
};

// Delete User (Soft Delete - Deactivate)
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    sendResponse(res, 200, 'User deactivated successfully', user);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid user ID format', 400));
    }
    next(error);
  }
};

// Permanently Delete User
export const permanentDeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    sendResponse(res, 200, 'User permanently deleted successfully');
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid user ID format', 400));
    }
    next(error);
  }
};

// Reactivate User
export const reactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    sendResponse(res, 200, 'User reactivated successfully', user);
  } catch (error) {
    if (error.name === 'CastError') {
      return next(new AppError('Invalid user ID format', 400));
    }
    next(error);
  }
};