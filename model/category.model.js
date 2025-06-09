import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    // icon: {
    //   type: String,
    //   default: '',
    // },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Category', categorySchema);
