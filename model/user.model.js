import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: false,
      trim: true,
    },
    lname: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['admin', 'editor', 'user'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model('User', userSchema);
