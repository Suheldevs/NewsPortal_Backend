import express from 'express'
import { upload } from '../config/multer.config.js'
const router = express.Router()
import {createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticlesByCategory,
getArticleBySubCategory,
getArticleByState,
getArticleByTag} from '../controller/article.controller.js'

router.post('/new/save', upload.single('thumbnail'), createArticle)


// GET /api/articles
router.get('/getall', getAllArticles);

// GET /api/articles/:id
router.get('get/:id', getArticleById);

//Get by category
router.get('/',getArticlesByCategory)

//get by subcategory
router.get('/sub-category',getArticleBySubCategory)


//get by city
router.get('/city',getArticleByState)


//get by tag
router.get('/tag',getArticleByTag)

// PUT /api/articles/:id
router.put('/update/:id', upload.single('file'), updateArticle);

// DELETE /api/articles/:id
router.delete('/delete/:id', deleteArticle);

export default router