import httpStatus from 'http-status';
import APIFeatures from '../../utils/apiFeatures';
import catchAsync from '../../utils/catchAsync';
import * as factory from '../../utils/handlerFactory';
import Post from './post.model';
import Comment from '../comment/comment.model';
import AppError from '../../errors/AppError';




export const createPost = factory.createOne(Post);


// export const getPost = catchAsync(async (req, res, next) => {
//   const { id } = req.params;


//   const post = await Post.findByIdAndUpdate(
//     id,
//     { $inc: { viewsCount: 1 } }, 
//     { new: true } 
//   ).populate('author category', 'name email profilePic');


//   if (!post) {
//     return next(new AppError(httpStatus.NOT_FOUND, `Post not found`));
//   }


//   const comments = await Comment.find({ post: id }).populate(
//     'author',
//     'name email profilePic',
//   );

//   // SEND RESPONSE
//   res.status(httpStatus.OK).json({
//     success: true,
//     statusCode: httpStatus.OK,
//     message: `Post retrieved successfully`,
//     data: {
//       ...post.toObject(),
//       comments,
//     },
//   });
// });
export const getPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const post = await Post.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $inc: { viewsCount: 1 } },
    { new: true }
  )
    .populate({
      path: 'author',
      select: 'name email profilePic isVerified', 
      match: { isDeleted: false },
    })
    .populate({
      path: 'category',
      select: 'name',
    });

  if (!post || !post.author) {
    return next(new AppError(httpStatus.NOT_FOUND, 'Post not found'));
  }

  
  const comments = await Comment.find({ post: id }).populate(
    'author',
    'name email profilePic isVerified', 
  );

  // SEND RESPONSE
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post retrieved successfully',
    data: {
      ...post.toObject(),
      comments,
    },
  });
});




// export const getAllPost=catchAsync(async (req, res) => {
//   const posts = await Post.find().populate(
//     'author category',
//     'name email profilePic',
//   );


//   res.status(httpStatus.OK).json({
//     success: true,
//     statusCode: httpStatus.OK,
//     message: `Posts retrieved successfully`,
//     data: posts,


//   });
// })
export const getAllPost = catchAsync(async (req, res) => {

  const posts = await Post.find({ isDeleted: false })
    .populate({
      path: 'author',
      select: 'name email profilePic isVerified',
      match: { isDeleted: false },
    })
    .populate({
      path: 'category',
      select: 'name',
    });


  const filteredPosts = posts.filter((post) => post.author !== null);

  // SEND RESPONSE
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Posts retrieved successfully',
    data: filteredPosts,
  });
});

// export const getAllPosts = catchAsync(async (req, res) => {


//   const features = new APIFeatures(Post.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();



//   const posts = await features.query
//     .populate('author category', 'name email profilePic')
//     .lean();


//   const postsWithCommentCount = await Promise.all(
//     posts.map(async (post) => {
//       const commentCount = await Comment.countDocuments({ post: post._id });
//       return {
//         ...post,
//         totalComments: commentCount,
//       };
//     }),
//   );


//   res.status(httpStatus.OK).json({
//     success: true,
//     statusCode: httpStatus.OK,
//     message: `Posts retrieved successfully`,
//     data: postsWithCommentCount,
//   });
// });

export const getAllPosts = catchAsync(async (req, res) => {
 
  const features = new APIFeatures(Post.find({ isDeleted: false }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

 
  const posts = await features.query
    .populate({
      path: 'author',
      select: 'name email profilePic isVerified',
      match: { isDeleted: false },
    })
    .populate({
      path: 'category',
      select: 'name',
    })
    .lean(); 

 
  const filteredPosts = posts.filter((post) => post.author !== null);

  
  const postsWithCommentCount = await Promise.all(
    filteredPosts.map(async (post) => {
      const commentCount = await Comment.countDocuments({ post: post._id });
      return {
        ...post,
        totalComments: commentCount,
      };
    }),
  );

  
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Posts retrieved successfully',
    data: postsWithCommentCount,
  });
});


// export const getMyPosts = catchAsync(async (req, res) => {

//   const features = new APIFeatures(
//     Post.find({ author: req.user.userId }),
//     req.query,
//   )
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   const posts = await features.query
//     .populate('author category', 'name email profilePic')
//     .lean();

//   const postsWithCommentCount = await Promise.all(
//     posts.map(async (post) => {
//       const commentCount = await Comment.countDocuments({ post: post._id });
//       return {
//         ...post,
//         totalComments: commentCount,
//       };
//     }),
//   );

//   res.status(httpStatus.OK).json({
//     success: true,
//     statusCode: httpStatus.OK,
//     message: `Posts retrieved successfully`,
//     data: postsWithCommentCount,
//   });
// });

export const getMyPosts = catchAsync(async (req, res) => {

  const features = new APIFeatures(
    Post.find({ author: req.user.userId, isDeleted: false }),
    req.query,
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

 
  const posts = await features.query
    .populate({
      path: 'author',
      select: 'name email profilePic isVerified',
      match: { isDeleted: false }, 
    })
    .populate({
      path: 'category',
      select: 'name',
    })
    .lean();


  const postsWithCommentCount = await Promise.all(
    posts.map(async (post) => {
      const commentCount = await Comment.countDocuments({ post: post._id });
      return {
        ...post,
        totalComments: commentCount,
      };
    }),
  );

 
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Posts retrieved successfully',
    data: postsWithCommentCount,
  });
});

export const updatePost = factory.updateOne(Post);
// export const deletePost = factory.deleteOne(Post);

export const deletePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  
  const post = await Post.findOneAndUpdate(
    { _id: id, author: req.user.userId, isDeleted: false }, 
    { isDeleted: true }, 
    { new: true }
  );

 
  if (!post) {
    return next(new AppError(httpStatus.NOT_FOUND, 'Post not found or already deleted'));
  }

  // SEND RESPONSE
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post deleted successfully',
    data: null, 
  });
});
