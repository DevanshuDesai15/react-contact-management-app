export interface IUser {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContact {
  id: string;
  name: string;
  email: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
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
  email: string;
  password: string;
  name?: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}