import mongoose from 'mongoose';

const citySchema = new mongoose.Schema(
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
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('City', citySchema);
