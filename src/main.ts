import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // API Prefix
  app.setGlobalPrefix('/api/v1');

  // Validation
  app.useGlobalPipes(new ValidationPipe());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Swigger Docs
  const config = new DocumentBuilder()
    .setTitle('Start With Me🚀')
    .setDescription('The Start with me API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1, docExpansion: 'none' },
  });

  // Listen
  await app.listen(3000);
}
bootstrap();
