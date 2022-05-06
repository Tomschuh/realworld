import { Injectable } from '@nestjs/common';
import { catchNotFoundError } from '@shared/prisma/prisma.error.catch';
import { PrismaService } from '@shared/prisma/prisma.service';
import { ProfileRes } from './profile.interface';
import { profileInclude } from './profile.query';

/**
 * {@link ProfileService}
 *
 * @author Tom Schuh
 */
@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Finds and returns user's profile by given username.
   *
   * @param username user identificator used for finding profile.
   * @param currentUserId identificator of currently logged user.
   * @returns profile in wrapper object {@link ProfileRes}.
   */
  async findOne(username: string, currentUserId: number): Promise<ProfileRes> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { username: username },
        include: profileInclude,
      });
      const { followedBy, password, updatedAt, createdAt, email, ...profile } =
        user;

      return {
        profile: {
          ...profile,
          following: followedBy.map((f) => f.id).includes(currentUserId),
        },
      };
    } catch (error) {
      catchNotFoundError(error);
    }
  }

  /**
   * Adds user's profile in logged user's followings.
   *
   * @param username user identificator used for following.
   * @param currentUserId identificator of currently logged user.
   * @returns followed profile in wrapper obejct {@link ProfileRes}.
   */
  async follow(username: string, currentUserId: number): Promise<ProfileRes> {
    try {
      const user = await this.prismaService.user.update({
        where: { username: username },
        data: {
          followedBy: {
            connect: {
              id: currentUserId,
            },
          },
        },
        include: profileInclude,
      });
      const { followedBy, password, updatedAt, createdAt, email, ...profile } =
        user;

      return {
        profile: {
          ...profile,
          following: followedBy.map((f) => f.id).includes(currentUserId),
        },
      };
    } catch (error) {
      catchNotFoundError(error);
    }
  }

  /**
   * Removes user's profile from logged user's followings.
   *
   * @param username user identificator used for following.
   * @param currentUserId identificator of currently logged user.
   * @returns unfollowed profile in wrapper obejct {@link ProfileRes}.
   */
  async unfollow(username: string, currentUserId: number): Promise<ProfileRes> {
    try {
      let user = await this.prismaService.user.update({
        where: { username: username },
        data: {
          followedBy: {
            disconnect: {
              id: currentUserId,
            },
          },
        },
        include: profileInclude,
      });
      const { followedBy, password, updatedAt, createdAt, email, ...profile } =
        user;

      return {
        profile: {
          ...profile,
          following: followedBy.map((f) => f.id).includes(currentUserId),
        },
      };
    } catch (error) {
      catchNotFoundError(error);
    }
  }
}
