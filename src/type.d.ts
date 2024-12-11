import { Request } from 'src/@types/express';
import { Types } from 'mongoose';

declare module 'express' {
  interface Request {
    payload?: {
      _id: Types.ObjectId;
      token: string;
      email: string;
      password: string;
      username: string;
      profile: {
        gender: string;
        date_of_birth: string;
        image: string;
        terminate_at: Date;
      };
    };
  }
}
