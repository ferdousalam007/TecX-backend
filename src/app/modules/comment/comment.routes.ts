import express from 'express';
import auth from '../../middlewares/auth';
import {
  createComment,
  deleteComment,
  getAllComments,
  getComment,
  updateComment,
} from './comment.controller';

const router = express.Router();

router
  .route('/')
  .get(getAllComments)
  .post(auth('admin', 'user'), createComment);

router
  .route('/:id')
  .get(getComment)
  .patch(auth('admin', 'user'), updateComment)
  .delete(auth('admin', 'user'), deleteComment);

export const CommentRoutes = router;
