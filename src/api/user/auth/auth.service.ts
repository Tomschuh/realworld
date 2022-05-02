import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UserRes } from '../user.interface';
import { AuthHelper } from './auth.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly authHelper : AuthHelper
    ) {}

    async create(createUser: CreateUserDto) : Promise<UserRes | never> {
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

    async login(body: LoginUserDto) : Promise<UserRes | never> {
        const _user = await this.prismaService.user.findUnique({
            where: {
                email: body.email
            }
        })

        if (!_user && _user.password === await this.authHelper.encodePassword(body.password)) {
            throw new HttpException("Invalid username or password", HttpStatus.FORBIDDEN);
        }

        const payload = {email: _user.email, userId: _user.id };
        const token = this.authHelper.encodeJwtToken(payload)
        const {password, ...user} = _user;
        return { user: {token, ...user} };
    }
}
