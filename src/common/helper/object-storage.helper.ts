import * as Minio from 'minio';
import * as sharp from 'sharp';

export class ObjectStorageHelper {
  result = {};
  constructor(
    private readonly minioClient: Minio.Client = new Minio.Client({
      endPoint: process.env.OBJ_ENDPOINT,
      accessKey: process.env.OBJ_ACCESS_KEY,
      secretKey: process.env.OBJ_SECRET_KEY,
    }),
    private bucketName: string = process.env.OBJ_BUCKET,
  ) {}

  private variants = [
    { name: 'thumbnail', width: 150, height: 150 },
    { name: 'medium', width: 600, height: 600 },
    { name: 'large', width: 1200, height: 1200 },
  ];

  private async resizeImage(
    file: Express.Multer.File,
    width: number,
    height: number,
  ): Promise<Buffer> {
    return await sharp(file.buffer).resize(width, height).toBuffer();
  }

  async uploadImageObject(file: Express.Multer.File, folder: string) {
    this.variants.map(async (variant) => {
      const buffer = await this.resizeImage(
        file,
        variant.width,
        variant.height,
      );

      const objectName = `${Date.now()}_${file.originalname}`;

      await this.minioClient.putObject(
        this.bucketName,
        `${folder}/${objectName}`,
        buffer,
      );

      const Location = `${process.env.SPACE_URL}/${this.bucketName}/${folder}/${objectName}`;

      this.result[variant.name] = Location;
    });

    return this.result;
  }
}
