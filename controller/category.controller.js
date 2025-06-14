import Category from '../model/category.model.js';
import { sendResponse } from '../utils/sendResponse.js';
import { AppError } from '../utils/AppError.js';
import Slug from '../middleware/slug.js';

export const createCategory = async (req, res, next) => {
  try {
    const { title, description } = req.body;

    // ✅ Validation
    if (!title || !description) {
      throw new AppError('Title and Description are required', 400);
    }
    const existingTitle = await Category.findOne({ title });
    // const existingRank = await Category.findOne({ categoryRank });

    if (existingTitle) {
      throw new AppError('Category with this title already exists', 400);
    }
    // if (existingRank) {
    //   throw new AppError('Category with this rank already exists', 400);
    // }

    const slug = Slug(title);
    const newCategory = await Category.create({
      title,
      slug,
      description,
    });

    sendResponse(res, 201, 'Category created successfully', newCategory);
  } catch (error) {
    next(error); 
  }
};


// GET ALL ACTIVE CATEGORIES WITH POSTS
export const getActiveCategories = async (req, res, next) => {
  try {
    const categories = await Category.find(
      { isActivated: true, hasPosts: true },
      'title slug'
    ).sort({ categoryRank: 1 });

    sendResponse(res, 200, 'Active categories fetched successfully', categories);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE CATEGORY
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    sendResponse(res, 200, 'Category fetched successfully', category);
  } catch (error) {
    next(error);
  }
};

// UPDATE CATEGORY
export const updateCategory = async (req, res, next) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      throw new AppError('Category not found', 404);
    }

    sendResponse(res, 200, 'Category updated successfully', updatedCategory);
  } catch (error) {
    next(error);
  }
};

// DELETE CATEGORY
export const deleteCategory = async (req, res, next) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      throw new AppError('Category not found', 404);
    }

    sendResponse(res, 200, 'Category deleted successfully', deletedCategory);
  } catch (error) {
    next(error);
  }
};
