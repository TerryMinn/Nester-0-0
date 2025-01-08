import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ImageMutipleValidationPipe
  implements
    PipeTransform<Express.Multer.File[], Promise<Express.Multer.File[]>>
{
  async transform(files: Express.Multer.File[]) {
    if (!files) {
      return;
    }

    for (const file of files) {
      if (!this.isFileValid(file)) {
        throw new BadRequestException(
          `File type '${file.mimetype}' is not allowed or size exceeds the maximum limit of 10MB.`,
        );
      }
    }

    return files;
  }

  private isFileValid(file: Express.Multer.File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSizeInBytes = 10 * 1024 * 1024;

    return allowedTypes.includes(file.mimetype) && file.size <= maxSizeInBytes;
  }
}

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      return;
    }

    if (!this.isFileValid(file)) {
      throw new BadRequestException(
        `File type '${file.mimetype}' is not allowed or size exceeds the maximum limit of 10MB.`,
      );
    }

    return file;
  }

  private isFileValid(file: Express.Multer.File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSizeInBytes = 50 * 1024 * 1024;

    return allowedTypes.includes(file.mimetype) && file.size <= maxSizeInBytes;
  }
}
