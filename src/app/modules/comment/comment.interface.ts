import { Types } from 'mongoose';

export interface TComment {
  text: string;
  author: Types.ObjectId;
  post: Types.ObjectId;
}
