/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  role: 'admin' | 'user';
  profilePic?: string;
  isVerified: boolean;
  isBlocked: boolean;
  followers: string[];
  following: string[];
  loggedInAt?: Date;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  createPasswordResetToken(): string;
}

export interface UserModel extends Model<TUser> {
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  createPasswordResetToken(): string;
}

export type TUserRole = keyof typeof USER_ROLE;
