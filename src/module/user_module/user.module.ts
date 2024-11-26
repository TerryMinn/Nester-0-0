import { Module } from '@nestjs/common';
import { User, UserSchema } from './entities/user.entities';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [],
  providers: [],
})
export class UserModule {}
