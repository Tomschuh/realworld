import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { catchPrismaNotFoundError } from '@shared/prisma/prisma.error.catch';
import { PrismaService } from '@shared/prisma/prisma.service';
import { UserRequestData } from '@shared/request.include.user';
import { UserRes } from '../user.interface';
import { AuthHelper } from './auth.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayloadData } from './jwt.token';

/**
 * {@link AuthService}
 * 
 * @author Tom Schuh
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authHelper: AuthHelper
  ) {}

  /**
   * Creates user according to dto object.
   *  
   * @param createUser contains all necessary data for creating user.
   * @returns created user in wrapper object {@link UserRes}
   */
  async create(createUser: CreateUserDto): Promise<UserRes | never> {
    let users: User[] = await this.prismaService.user.findMany({
      where: {
        OR: [
          {
            username: createUser.username,
          },
          {
            email: createUser.email,
          },
        ],
      },
    });

    if (users.length > 0) {
      throw new HttpException(
        'Username and email must be unique!',
        HttpStatus.BAD_REQUEST
      );
    }

    const user = await this.prismaService.user.create({
      data: {
        email: createUser.email,
        username: createUser.username,
        password: await this.authHelper.encodePassword(createUser.password),
      },
    });
    return { user };
  }

  /**
   * Verify correctness of user's credentials and return JWT token,
   * which is used for authentication.
   * 
   * @param body contains user's credentials.
   * @returns logged user in wrapper object {@link UserRes}
   */
  async login(body: LoginUserDto): Promise<UserRes | never> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!(await this.authHelper.verifyPassword(body.password, user.password))) {
      throw new HttpException('Invalid password!', HttpStatus.UNAUTHORIZED);
    }

    const payload : JwtPayloadData = { email: user.email, userId: user.id };
    const token = this.authHelper.encodeJwtToken(payload);
    const { password, ...userData } = user;
    return { user: { token, ...userData } };
  }

  async getUserRequestData(id: number): Promise<UserRequestData> {
    // try {
      
    // } catch (error) {
    //   if (error instanceof Prisma.PrismaClientKnownRequestError) {
    //     catchPrismaNotFoundError(error);
    //   }
    //   throw error;
    // }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      rejectOnNotFound: false
    });

    return { id: user.id, email: user.email }
  }
}
