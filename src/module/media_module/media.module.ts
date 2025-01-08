import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user_module/entities/user.entities';
import { ObjectStorageHelper } from 'src/common/helper/object-storage.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [MediaController],
  providers: [MediaService, ObjectStorageHelper],
})
export class MediaModule {}
