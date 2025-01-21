import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../entities/user.entities';
import { ChangePasswordDto, LoginDto } from '../dto/auth.dto';
import { encrypt } from 'vtoken';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

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

  async changePassword(
    changePasswordBody: ChangePasswordDto,
    userId: Types.ObjectId,
  ) {
    const user = await this.userModel.findById(userId).select('+password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordCorrect = await user.checkPassword(
      changePasswordBody.old_password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.password = changePasswordBody.new_password;
    await user.save();
    return user;
  }

  async editInfo(userId: Types.ObjectId, updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate(userId, updateUserDto, {
      new: true,
    });
  }
}
