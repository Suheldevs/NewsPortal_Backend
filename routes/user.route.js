import express from 'express';
import { sendResponse } from '../utils/sendResponse.js';
import { AppError } from '../utils/AppError.js';

const router = express.Router();

router.get('/sample', (req, res, next) => {
  try {
    const data = { name: 'Suhel', role: 'Developer' };
    sendResponse(res, 200, 'Data fetched successfully', data);
  } catch (error) {
    next(new AppError('Something went wrong', 500));
  }
});

router.get('/error', (req, res, next) => {
  next(new AppError('This is a custom error', 400, ['Invalid input']));
});

export default router;
