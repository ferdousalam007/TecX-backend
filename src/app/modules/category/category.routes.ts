import express from 'express';
import auth from '../../middlewares/auth';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from './category.controller';

const router = express.Router();

router.route('/').get(getAllCategories).post(auth('admin'), createCategory);

router
  .route('/:id')
  .get(getCategory)
  .patch(auth('admin'), updateCategory)
  .delete(auth('admin'), deleteCategory);

export const CategoryRoutes = router;
