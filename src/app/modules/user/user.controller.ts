import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import User from './user.model';
import * as factory from '../../utils/handlerFactory';

export const getMe = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId).populate(
    'followers following',
    'name email profilePic isVerified',
  );
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'User retrieved successfully',
    data: user,
  });
});

export const updateMe = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'User updated successfully',
    data: user,
  });
});

export const createUser = factory.createOne(User);
export const getUser = factory.getOne(User);
// export const getAllUsers = factory.getAll(User);
export const getAllUsers = catchAsync(async (req, res, next) => {
  try {
    let query = User.find({ isDeleted: false });
    if (req.query.populate === 'true') {
      query = query.populate('followers following', 'name email profilePic isVerified');
    }
    const users = await query;
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error) {
    next(error);
  }
});
export const updateUser = factory.updateOne(User);
// export const deleteUser = factory.deleteOne(User);

export const deleteUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;


  const user = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    { new: true, runValidators: true },
  );


  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      statusCode: httpStatus.NOT_FOUND,
      message: 'User not found',
    });
  }

  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'User deleted successfully',
    data: user,
  });
});
