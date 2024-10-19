import { Types } from 'mongoose';

export interface TPost {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  content: string;
  author: Types.ObjectId;
  category: Types.ObjectId;
  images: string[];
  isPremium: boolean;
  isDeleted: boolean;
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
  viewsCount: number;
}
