import { Injectable } from '@nestjs/common';
import { catchNotFoundError } from 'src/shared/prisma.error.catch';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ProfileRes } from './profile.interface';
import { profileInclude } from './profile.query';

@Injectable()
export class ProfileService {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async findOne(username: string, currentUserId: number): Promise<ProfileRes> {
        const user = await this.prismaService.user.findUnique({
            where: { username: username },
            include: profileInclude
        });
        const {followedBy, password, updatedAt, createdAt, email, ...profile} = user;

        return { profile: { ...profile, following: this.following(followedBy, currentUserId) } }
    }

    async follow(username: string, currentUserId: number): Promise<ProfileRes> {
        const user = await this.prismaService.user.update({
            where: { username: username },
            data: {
                followedBy: {
                    connect: {
                        id: currentUserId,
                    },
                },
            },
            include: profileInclude
        })
        .catch((err) => catchNotFoundError(err));
        const {followedBy, password, updatedAt, createdAt, email, ...profile} = user;

        return { profile: { ...profile, following: this.following(followedBy, currentUserId) } }
    }

    async unfollow(username: string, currentUserId: number): Promise<ProfileRes> {
        let user = await this.prismaService.user.update({
            where: { username: username },
            data: {
                followedBy: {
                    disconnect: {
                        id: currentUserId,
                    },
                },
            },
            include: profileInclude
        })
        .catch((err) => catchNotFoundError(err));
        const {followedBy, password, updatedAt, createdAt, email, ...profile} = user;

        return { profile: { ...profile, following: this.following(followedBy, currentUserId) } }
    }

    private following(followedBy: any[], currentUserId: number): boolean {
        if ((followedBy.map(f=>f.id)).includes(currentUserId)) {
            return true;
        }
        return false;
    }
}
