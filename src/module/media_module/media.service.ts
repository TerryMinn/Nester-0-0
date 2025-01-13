import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectStorageHelper } from 'src/common/helper/object-storage.helper';

@Injectable()
export class MediaService {
  constructor(private readonly objectStorageHelper: ObjectStorageHelper) {}

  async uploadPhoto(file: Express.Multer.File, v?: string) {
    const response = await this.objectStorageHelper.uploadImageObject(
      file,
      'photo',
      v,
    );
    return response;
  }
}
