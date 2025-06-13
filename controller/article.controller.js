import Slug from "../middleware/slug";
import Article from "../model/article.model";
import { sendResponse } from "../utils/sendResponse";

const createArticle = async (req, res, next) => {
    try {
        const { title, thumbnail, summary, content, authorId, categoryId, subcategoryId, tags, isInternational, isBreaking, state, city, status, isFeatured, readingTime, seo } = req.body
        if (!title || !slug || !content) {
            throw new Error('Please Provid Title and Contect of Article', 400)
        }
        const matchSlug = Article.findOne({ slug })
        if (matchSlug) {
            throw new Error('Title Must be Uniqe', 400)
        }
        const slug = Slug(title)
        console.log(slug)
        return;
        const newArticle = new Article({
            title,
            thumbnail,
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
        await newUser.save()
        sendResponse(req, 201, 'Article save successfully', newUser)
    }
    catch (err) {

    }
}


export {createArticle}