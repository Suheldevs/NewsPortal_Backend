import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
   
    subCategoryRank:{
      type:Number,
      required:true,
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
     description: {
      type: String,
      default: '',
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
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

export default mongoose.model('Subcategory', subcategorySchema);
