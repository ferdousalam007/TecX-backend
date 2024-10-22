import express from 'express';
import auth from '../../middlewares/auth';
import {
  getAllPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  getMyPosts,
  getAllPost,
  getBannerPost,
} from './post.controller';

const router = express.Router();

router.route('/').get(getAllPosts).post(auth('admin', 'user'), createPost);
router.get('/allpost', getAllPost);
router.get('/bannerpost', getBannerPost);

router.get('/my-posts', auth('user', 'admin'), getMyPosts);
router
  .route('/:id')
  .get(getPost)
  .patch(auth('admin', 'user'), updatePost)
  .delete(auth('admin', 'user'), deletePost);
export const PostRoutes = router;
