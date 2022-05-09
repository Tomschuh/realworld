import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthHelper } from './auth.helper';
import { PrismaService } from '@shared/prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from '../user.service';

@Module({
  providers: [
    AuthService,
    AuthHelper,
    PrismaService,
    JwtStrategy
  ],
  controllers: [AuthController],
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy : 'jwt', property: 'user' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secretOrPrivateKey: 'secret',
        // secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('expiration'),
        }
      }),
      inject: [ConfigService]
    })
  ],
  exports: [JwtModule]
})
export class AuthModule {}
