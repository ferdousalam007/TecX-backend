import * as request from '../../utils/helperRequest';
import Comment from './comment.model';

export const createComment = request.createOne(Comment);
export const getComment = request.getOne(Comment);
export const getAllComments = request.getAll(Comment);
export const updateComment = request.updateOne(Comment);
export const deleteComment = request.deleteOne(Comment);
