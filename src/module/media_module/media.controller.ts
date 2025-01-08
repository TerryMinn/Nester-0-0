import {
  Controller,
  Res,
  UseGuards,
  Post,
  BadRequestException,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response, Request, response } from 'express';
import { MediaService } from './media.service';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ImageMutipleValidationPipe,
  ImageValidationPipe,
} from 'src/common/pipe/image-validation.pipe';
import { Representation } from 'src/common/helper/representation.helper';

@Controller('media')
@ApiTags('media')
// @UseGuards(AuthGuard)
// @ApiBearerAuth()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @Post('upload/photo')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @Res() response: Response,
    @UploadedFile(ImageValidationPipe)
    file: Express.Multer.File,
  ) {
    try {
      const res = await this.mediaService.uploadPhoto(file);

      return new Representation('Success', res, response).sendSingle();
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
