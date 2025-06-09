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
    thumbnail: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: false,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subcategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: false,
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
      required: false,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'city',
      required: false,
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
      required: false,
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
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Article', articleSchema);
