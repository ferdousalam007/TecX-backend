import * as factory from '../../utils/handlerFactory';
import Comment from './comment.model';

export const createComment = factory.createOne(Comment);
export const getComment = factory.getOne(Comment);
export const getAllComments = factory.getAll(Comment);
export const updateComment = factory.updateOne(Comment);
export const deleteComment = factory.deleteOne(Comment);
