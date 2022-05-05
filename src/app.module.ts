import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/user/auth/auth.module';
import { ApiModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';
import { HttpLoggerMiddleware } from '@shared/middleware/http.logger.middleware';

@Module({
  imports: [
    ApiModule, 
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.STAGE}`],
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
