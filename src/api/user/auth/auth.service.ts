import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UserResponse } from '../user.interface';
import { AuthHelper } from './auth.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly authHelper : AuthHelper
    ) {}

    async create(createUser: CreateUserDto) : Promise<UserResponse | never> {
        let users: User[] = await this.prismaService.user.findMany({
            where: { 
                OR : [
                    {
                        username: createUser.username
                    },
                    {
                        email: createUser.email
                    }
                ]
            }
        });

        if (users.length > 0) {
            throw new HttpException('Username and email must be unique!', HttpStatus.BAD_REQUEST)
        }

        const user = await this.prismaService.user.create({
            data: {
                email: createUser.email,
                username: createUser.username,
                password: await this.authHelper.encodePassword(createUser.password)
            }
        });
        return { user };
    }

    async login(body: LoginUserDto) : Promise<UserResponse | never> {
        const { email, password }: LoginUserDto = body;
        const user = await this.prismaService.user.findUnique({
            where: {
                email: email
            }
        })

        if (!user && user.password === await this.authHelper.encodePassword(password)) {
            throw new HttpException("Invalid username or password", HttpStatus.FORBIDDEN);
        }

        const payload = {email: user.email, sub: user.id };
        const token = this.authHelper.encodeJwtToken(payload)
        return { user: {token, ...user} };
    }
}
