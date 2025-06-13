import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
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
    thumbnail1: {
      type: String,
      default:''
    },
    thumbnail2: {
      type: String,
      default:''
    },
    content: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory',
    },
    tags: {
      type: [String],
      default: [],
    },
    isInternational: {
      type: Boolean,
      default: false,
    },
    isBreaking: {
      type: Boolean,
      default: false,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'state',
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'city',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    readingTime: {
      type: String,
    },
    seo: {
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
    publishedAt: {
      type: Date,
      default:Date.now()
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Article', articleSchema);
