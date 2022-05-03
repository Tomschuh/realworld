import { BadRequestException, HttpException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      const errorRes = { errors: {} };
      validationErrors.forEach(er => {
        errorRes.errors[er.property] = Object.values(er.constraints);
      })
      return new HttpException(errorRes, 422);
    }
  }));
  await app.listen(3000);
}
bootstrap();
