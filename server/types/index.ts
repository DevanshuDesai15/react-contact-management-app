import { Request } from 'express';

export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  validatePassword: (password: string) => Promise<boolean>;
}

export interface IContact {
  id: string;
  name: string;
  email: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest<P = any, ResBody = any, ReqBody = any> extends Request<P, ResBody, ReqBody> {
  user?: IUser;
}

export interface CreateContactRequest {
  name: string;
  email: string;
}

export interface UpdateContactRequest {
  name?: string;
  email?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}