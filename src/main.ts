import { HttpException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { errorDto } from '@shared/dto/error.dto';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app
    .useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (validationErrors: ValidationError[] = []) => {
          let errors : errorDto = {};
          validationErrors.forEach((er) => {
            errors[er.property] = Object.values(er.constraints);
          });
          return new HttpException( {errors : errors} , 422);
        },
      })
    )
    .setGlobalPrefix(configService.get<string>('API_PREFIX', ''));
  // Default timezone
  process.env.TZ = 'Europe/Prague';
  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Realworld example app.')
    .setDescription('The realworld app API description')
    .setVersion('1.0')
    .addTag('realworld')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(
    `${configService.get<string>('API_PREFIX', '')}/swagger`,
    app,
    document
  );
  const port = configService.get<number>('API_PORT');
  
  console.log(port);
  await app.listen(port);
}
bootstrap();
