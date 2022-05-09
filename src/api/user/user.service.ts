import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { catchPrismaNotFoundError } from '@shared/prisma/prisma.error.catch';
import { PrismaService } from '@shared/prisma/prisma.service';
import { UserRequestData } from '@shared/request.include.user';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRequestRes, UserRes } from './user.interface';

/**
 * {@link UserService}
 * 
 * @author Tom schuh
 */
@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Return currently logged user.
   * 
   * @param currentUserId identificator of currently logged user.
   * @returns currently logged user in wrapper object {@link UserRes}.
   */
  async getCurrentUser(currentUserId: number): Promise<UserRes> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: currentUserId,
      },
    });

    return { user: user };
  }

  /**
   * Updates currently logged user according to object dto.
   * 
   * @param userDto contains all data for user update.
   * @param currentUserId identificator of currently logged user.
   * @returns updated user in wrapper object {@link UserRes}.
   */
  async update(
    userDto: UpdateUserDto,
    currentUserId: number
  ): Promise<UserRes> {
    try {
      const user = await this.prismaService.user
      .update({
        where: {
          id: currentUserId,
        },
        data: {
          ...userDto,
          updatedAt: new Date(),
        },
      });

      return { user: user };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        catchPrismaNotFoundError(error);
      }
      throw error;
    }
  }
}
