import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import User from './user.model';
import * as factory from '../../utils/handlerFactory';

export const getMe = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId).populate(
    'followers following',
    'name email profilePic',
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
export const getAllUsers = factory.getAll(User);
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);
