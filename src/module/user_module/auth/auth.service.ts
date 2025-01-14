import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../entities/user.entities';
import { LoginDto } from '../dto/login.dto';
import { encrypt } from 'vtoken';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async login(loginDto: LoginDto) {
    const user = await this.userModel
      .findOne({ email: loginDto.email })
      .select('+password +oauth_providers');

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordCorrect = await user.checkPassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async generateToken(user: UserDocument) {
    const token = encrypt(
      user._id,
      process.env.SECRET_KEY,
      parseInt(process.env.EXPIRES_IN),
    );

    const updateUser = await this.userModel
      .findOneAndUpdate({ _id: user._id }, { new: true })
      .select('+device +oauth_providers');

    return {
      token,
      user: updateUser.toObject(),
    };
  }

  async register(createUser: CreateUserDto) {
    const user = await this.userModel.findOne({ email: createUser.email });
    if (user) {
      throw new Error('User already exists');
    }

    return this.userModel.create(createUser);
  }
}
