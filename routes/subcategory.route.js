import express from 'express';
import { createSubcategory } from '../controller/subcategory.controller.js';
const router = express.Router();

router.post('/create', createSubcategory);

export default router;
