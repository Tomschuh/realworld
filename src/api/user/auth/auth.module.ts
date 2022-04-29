import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { authConstants } from 'src/common/constants';
import { AuthHelper } from './auth.helper';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Module({
  providers: [
    AuthService,
    AuthHelper,
    JwtStrategy,
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
