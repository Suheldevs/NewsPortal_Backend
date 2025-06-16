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
    subCategoryRank: {
      type: Number,
      required: true,
      unique: true,
    },
    isActivated: {
      type: Boolean,
      default: true,
    },
    hasPosts: {
      type: Boolean,
      default: true,
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

subcategorySchema.pre('save', async function (next) {
  if (this.isNew && !this.subCategoryRank) {
    try {
      const maxRankSubcategory = await mongoose
        .model('Subcategory')
        .findOne({})
        .sort({ subCategoryRank: -1 })
        .select('subCategoryRank');

      this.subCategoryRank = maxRankSubcategory
        ? maxRankSubcategory.subCategoryRank + 1
        : 1;

      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

export default mongoose.model('Subcategory', subcategorySchema);
