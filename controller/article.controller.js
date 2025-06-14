import cloudinary from "../config/cloudinary.config.js";
import { modifyName } from "../config/multer.config.js";
import Slug from "../middleware/slug.js";
import Article from "../model/article.model.js";
import { sendResponse } from "../utils/sendResponse.js";
import fs from 'fs'
import Category from '../model/category.model.js'

//getallArticles
const getAllArticles = async (req, res, next) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    sendResponse(res, 200, 'Articles fetched successfully', articles);
  } catch (err) {
    next(err);
  }
};

//Get Article by ID
const getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) throw new Error('Article not found');
    sendResponse(res, 200, 'Article fetched successfully', article);
  } catch (err) {
    next(err);
  }
};

//get by category
const getArticlesByCategory = async (req, res, next) => {
  try {
    const { category, page = 0 } = req.query;
    const matchStage = {};

    if (category) {
      matchStage['categoryData.slug'] = category;
    }

    const articles = await Article.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'categoryData',
        },
      },
      { $unwind: '$categoryData' },

      { $match: matchStage },

      { $skip: Number(page) * 10 },
      { $limit: 10 },

      {
        $project: {
          title: 1,
          summary: 1,
          thumbnail1: 1,
          thumbnail2: 1,
          slug: 1,
          createdAt: 1,
          'categoryData.title': 1,
          'categoryData.slug': 1,
        },
      },
    ]);

    sendResponse(res, 200, 'Articles fetched successfully', articles);
  } catch (err) {
    next(err);
  }
};


//get by subcategory
const getArticleBySubCategory = async (req,res,next)=>{
  try{
    const {subcategory, page=0} = req.query
    if(!subcategory){
      throw new Error('Please provide a subcategory')
    }
    const articleData = await Article.aggregate([
      {
        $lookup:{
          from:'subcategories',
          localField:'subcategoryId',
          foreignField:'_id',
          as:'subcategoryData'
        }
      },
      {$unwind:'$subcategoryData'},
      {$match:{'subcategoryData.slug':subcategory}},
      {$skip:Number(page) * 10},
      {$limit:10},
      {$project:{
        title:1,
        slug:1,
        thumbnail1:1,
        thumbnail2:1,
         createdAt: 1,
          'subcategoryData.title': 1,
          'subcategoryData.slug': 1,
      }}
    ])
    sendResponse(res, 200, "article fetch Successfully", articleData)
  }
  catch(err){
    next(err)
  }
}

//get by city
const getArticleByCity = async (req, res,next)=>{
  try{
    const {city  , page=0} = req.query
    if(!city){
      throw new Error('Please Provide a City Name',400)
    }
    const Data = await Article.aggregate([
      {$lookup:{
        from:'cities',
        localField:'cityId',
        foreignField:'_id',
        as:'cityData'
      }},
      {$unwind:'$cityData'},
      {$match:{'cityData.slug':city}},
      {$skip:Number(page)*10},
      {$limit:10},
       {$project:{
        title:1,
        slug:1,
        thumbnail1:1,
        thumbnail2:1,
         createdAt: 1,
          'cityData.title': 1,
          'cityData.slug': 1,
      }}
    ])
    sendResponse(res, 200, 'Data Fetch Successfull', Data)
  }
  catch(err){
    next(err)
  }
}

//get by state
const getArticleByState = async (req, res,next)=>{
  try{
    const {state  , page=0} = req.query
    if(!state){
      throw new Error('Please Provide a State Name',400)
    }
    const Data = await Article.aggregate([
      {$lookup:{
        from:'states',
        localField:'stateId',
        foreignField:'_id',
        as:'stateData'
      }},
      {$unwind:'$stateData'},
      {$match:{'stateData.slug':state}},
      {$skip:Number(page)*10},
      {$limit:10},
       {$project:{
        title:1,
        slug:1,
        thumbnail1:1,
        thumbnail2:1,
         createdAt: 1,
          'stateData.title': 1,
          'stateData.slug': 1,
      }}
    ])
    sendResponse(res, 200, 'Data Fetch Successfull', Data)
  }
  catch(err){
    next(err)
  }
}

//get by tag
const getArticleByTag = async(req,res,next)=>{
  try{
    const {tag , page = 0 } = req.query
    if(!tag){
      throw new Error('Please Provide a Tag')
    }
    const Data = await Article.find({tags:{$in:[tag]}})
    sendResponse(res,200, 'Data fetch Successfull', Data)
  }
  catch(err){
    next(err)
  }
}



//save article
const createArticle = async (req, res, next) => {
    let cloudinaryResult = null;
    try {
        const {
            title, summary, content, authorId, categoryId, subcategoryId,
            tags, isInternational, isBreaking, state, city, status, isFeatured,
            readingTime, seo
        } = req.body;

        if (!title?.trim() || !content?.trim()) {
            throw new Error('Title and Content are required.');
        }
       const file = req.file;
        if (!file) {
            throw new Error('Please Provide At least One Image of Article');
        }
        cloudinaryResult = await cloudinary.uploader.upload(file.path, {
            folder: 'testfornews',
            public_id: modifyName(file)
        });
        const thumbnail1 = file.path; 
        const thumbnail2 = cloudinaryResult.secure_url; 
        const slug = Slug(title);
        const matchSlug = await Article.findOne({ slug });
        if (matchSlug) {
            throw new Error('Title Must be Unique');
        }
        const newArticle = new Article({
            title,
            slug,
            thumbnail1,
            thumbnail2,
            summary,
            content,
            authorId,
            categoryId,
            subcategoryId,
            tags,
            isInternational,
            isBreaking,
            state,
            city,
            status,
            isFeatured,
            readingTime,
            seo
        });
        await newArticle.save();
        sendResponse(res, 201, 'Article saved successfully', newArticle);
    } catch (err) {
        if (req?.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        if (cloudinaryResult?.public_id) {
            await cloudinary.uploader.destroy(cloudinaryResult.public_id);
        }

        next(err);
    }
};


// Update Article
const updateArticle = async (req, res, next) => {
  let newCloudinaryResult = null;
  try {
    const existingArticle = await Article.findById(req.params.id);
    if (!existingArticle) throw new Error('Article not found');

    const {
      title, summary, content, authorId, categoryId, subcategoryId,
      tags, isInternational, isBreaking, state, city, status, isFeatured,
      readingTime, seo
    } = req.body;

    if (title) existingArticle.slug = title && title !== existingArticle.title ? Slug(title) : existingArticle.slug;
    if (title) existingArticle.title = title;
    if (summary) existingArticle.summary = summary;
    if (content) existingArticle.content = content;
    if (authorId) existingArticle.authorId = authorId;
    if (categoryId) existingArticle.categoryId = categoryId;
    if (subcategoryId) existingArticle.subcategoryId = subcategoryId;
    if (tags) existingArticle.tags = tags;
    if (state) existingArticle.state = state;
    if (city) existingArticle.city = city;
    if (status !== undefined) existingArticle.status = status;
    if (isFeatured !== undefined) existingArticle.isFeatured = isFeatured;
    if (isBreaking !== undefined) existingArticle.isBreaking = isBreaking;
    if (isInternational !== undefined) existingArticle.isInternational = isInternational;
    if (readingTime) existingArticle.readingTime = readingTime;
    if (seo) existingArticle.seo = seo;


    if (req.file) {
      const file = req.file;

      if (existingArticle.thumbnail1 && fs.existsSync(existingArticle.thumbnail1)) {
        fs.unlinkSync(existingArticle.thumbnail1);
      }
      const oldPublicId = existingArticle.thumbnail2?.split('/').pop().split('.')[0];
      if (oldPublicId) await cloudinary.uploader.destroy(`testfornews/${oldPublicId}`);

 
      newCloudinaryResult = await cloudinary.uploader.upload(file.path, {
        folder: 'testfornews',
        public_id: modifyName(file),
      });

      existingArticle.thumbnail1 = file.path;
      existingArticle.thumbnail2 = newCloudinaryResult.secure_url;
    }

    await existingArticle.save();
    sendResponse(res, 200, 'Article updated successfully', existingArticle);
  } catch (err) {
    if (req?.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    if (newCloudinaryResult?.public_id) await cloudinary.uploader.destroy(newCloudinaryResult.public_id);
    next(err);
  }
};

// Delete Article
const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) throw new Error('Article not found');

    if (article.thumbnail1 && fs.existsSync(article.thumbnail1)) {
      fs.unlinkSync(article.thumbnail1);
    }

    const publicId = article.thumbnail2?.split('/').pop().split('.')[0];
    if (publicId) await cloudinary.uploader.destroy(`testfornews/${publicId}`);

    // 3. Delete DB record
    await Article.findByIdAndDelete(req.params.id);
    sendResponse(res, 200, 'Article deleted successfully');
  } catch (err) {
    next(err);
  }
};

export { createArticle ,getAllArticles, getArticleById,updateArticle,deleteArticle,getArticlesByCategory, getArticleBySubCategory, getArticleByState, getArticleByTag };
