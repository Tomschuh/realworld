import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.decorator';
import { UserRes } from './user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async currentUser(
        @User('userId') currentUserId: number): Promise<UserRes> {
        return await this.userService.getCurrentUser(currentUserId);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    async update(
        @Body('user') user: UpdateUserDto, 
        @User('userId') currentUserId: number): Promise<UserRes> {
        return await this.userService.update(user, currentUserId);
    }
}
