import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    categoryRank:{
      type:Number,
      // required:true,
      unique:true
    },
    isActivated:{
      type:Boolean,
      default:true
    },
    hasPosts:{
      type:Boolean,
      default:true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index:true
    },
    description: {
      type: String,
      default: '',
    },
        metaData: {
      metaTitle: {
        type: String,
        default: '',
      },
      metaDescription: {
        type: String,
        default: '',
      },
      metaKeywords: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Category', categorySchema);
