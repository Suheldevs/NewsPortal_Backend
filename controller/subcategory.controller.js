import Subcategory from '../model/subcategory.model.js';
import { sendResponse } from '../utils/sendResponse.js';
import { AppError } from '../utils/AppError.js';
import Slug from '../middleware/slug.js'; 

// ✅ Create Subcategory
export const createSubcategory = async (req, res, next) => {
  try {
    const {
      title,
      description,
      categoryId,
    } = req.body;

    // Check required fields
    if (!title || !description || !categoryId) {
      throw new AppError('Title, description and Category ID are required', 400);
    }

    const slug = Slug(title);

    // Check if slug or subCategoryRank already exists
    const existing = await Subcategory.findOne({ slug });
    if (existing) {
      throw new AppError('Subcategory with same slug or rank already exists', 409);
    }

    const newSubcategory = new Subcategory({
      title,
      slug,
      description,
      categoryId,
    });

    const savedSubcategory = await newSubcategory.save();

    sendResponse(res, 201, 'Subcategory created successfully', savedSubcategory);
  } catch (error) {
    next(error);
  }
};
