import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/user/auth/auth.module';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';
import { HttpLoggerMiddleware } from '@shared/middleware/http.logger.middleware';
import { AuthMiddleware } from './api/user/auth/auth.middleware';
import { UserService } from './api/user/user.service';
import { PrismaService } from '@shared/prisma/prisma.service';
import { AuthService } from './api/user/auth/auth.service';
import { AuthHelper } from './api/user/auth/auth.helper';
import path from 'path';

@Module({
  imports: [
    ApiModule, 
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.STAGE}`,
      isGlobal: true
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AuthService, PrismaService, AuthHelper],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
