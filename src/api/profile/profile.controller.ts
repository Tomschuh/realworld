import { Controller, Delete, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { response } from 'express';
import { JwtAuthGuard } from '../user/auth/jwt.guard';
import { User } from '../user/user.decorator';
import { ProfileRes } from './profile.interface';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService,
    ) {}

    @Get(':username')
    async findOne(
        @Param('username') username: string, 
        @User('userId') currentUserId: number): Promise<ProfileRes> {
        return await this.profileService.findOne(username, currentUserId);
    }

    @Post(':username/follow')
    @UseGuards(JwtAuthGuard)
    async follow(
        @Param('username') username: string, 
        @User('userId') currentUserId: number,
        @Res() response: any): Promise<ProfileRes> {
        return response.status(200).send(await this.profileService.follow(username, currentUserId));
    }

    @Delete(':username/follow')
    @UseGuards(JwtAuthGuard)
    async unfollow(
        @Param('username') username: string, 
        @User('userId') currentUserId: number,): Promise<ProfileRes> {
        return await this.profileService.unfollow(username, currentUserId);
    }
}
