import { Module } from '@nestjs/common';
import { User, UserSchema } from './entities/user.entities';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { IsOldPasswordCorrect } from 'src/common/validator/is-old-password.validator';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AuthController, UserController],
  providers: [AuthService, UserService, IsOldPasswordCorrect],
})
export class UserModule {}
