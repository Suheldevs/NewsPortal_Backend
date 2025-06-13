// routes/user.route.js
import express from 'express';
import {
  signUp,
  signIn,
  // getAllUsers,
  getUserById,
  // updateUser,
  // updatePassword,
  // deleteUser,
  // permanentDeleteUser,
  // reactivateUser
} from '../controller/user.controller.js';
// import { validateSignUp, validateSignIn, validateUpdateUser } from '../middleware/validation.middleware.js';
// import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public Routes
router.post('/signup', signUp);
router.post('/signin', signIn);

// Protected Routes (Require Authentication)
// router.use(authenticateToken); 
// // User Profile Routes
router.get('/profile/:id', getUserById);
// router.put('/profile/:id', validateUpdateUser, updateUser);
// router.put('/password/:id', updatePassword);

// // Admin Only Routes
// router.get('/', authorizeRoles(['admin']), getAllUsers);
// router.delete('/:id', authorizeRoles(['admin']), deleteUser);
// router.delete('/permanent/:id', authorizeRoles(['admin']), permanentDeleteUser);
// router.put('/reactivate/:id', authorizeRoles(['admin']), reactivateUser);

export default router;