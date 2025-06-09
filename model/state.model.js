import mongoose from 'mongoose';

const stateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model('State', stateSchema);
