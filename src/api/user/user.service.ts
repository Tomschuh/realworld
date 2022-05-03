import { Injectable } from '@nestjs/common';
import { catchNotFoundError } from 'src/shared/prisma.error.catch';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRes } from './user.interface';

@Injectable()
export class UserService {
    constructor(
        private readonly prismaService: PrismaService,
    ) {}

    async getCurrentUser(currentUserId: number): Promise<UserRes> {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: currentUserId,
            },
        });

        return { user: user };
    }

    async update(userDto: UpdateUserDto, currentUserId: number): Promise<UserRes> {
        const user = await this.prismaService.user.update({
            where: {
                id: currentUserId,
            },
            data: {
                ...userDto,
                updatedAt: new Date()
            }
        })
        .catch((err) => catchNotFoundError(err));

        return { user: user };
    }
}
