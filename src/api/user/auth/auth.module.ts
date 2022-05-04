import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { authConstants } from '@common/constants';
import { AuthHelper } from './auth.helper';
import { PrismaService } from '@shared/prisma/prisma.service';

@Module({
  providers: [
    AuthService,
    AuthHelper,
    PrismaService
  ],
  controllers: [AuthController],
  imports: [
    PassportModule.register({ defaultStrategy : 'jwt', property: 'user' }),
    JwtModule.register({
      secret: authConstants.secret,
      signOptions: { expiresIn: authConstants.expiration },
    }),
  ],
})
export class AuthModule {}
