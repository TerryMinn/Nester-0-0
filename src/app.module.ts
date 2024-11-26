import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      process.env.NODE_ENV === 'production'
        ? process.env.DB_PROD
        : process.env.ENV_STAGE === 'test'
          ? process.env.DB_LOCAL
          : process.env.DB_STAG,
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
