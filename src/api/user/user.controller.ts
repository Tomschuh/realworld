import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { type } from 'os';
import { JwtAuthGuard } from './auth/jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.decorator';
import { UserRes } from './user.interface';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService) {}

    @Get()
    @ApiBearerAuth()
    @ApiResponse({status: 200, description: 'Return currently logged user.'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @UseGuards(JwtAuthGuard)
    async currentUser(
        @User('userId') currentUserId: number): Promise<UserRes> {
        return await this.userService.getCurrentUser(currentUserId);
    }

    @Put()
    @ApiBearerAuth()
    @ApiBody({type: UpdateUserDto})
    @ApiParam({type: 'number', description: 'user id', required: true, name: 'userId'})
    @ApiResponse({status: 200, description: 'User successfully updated.'})
    @ApiResponse({status: 400, description: 'Invalid request'})
    @ApiResponse({status: 401, description: 'Unauthorized'})
    @ApiResponse({status: 403, description: 'Operation forbidden.'})
    @ApiResponse({status: 404, description: 'User not found.'})
    @UseGuards(JwtAuthGuard)
    async update(
        @Body('user') user: UpdateUserDto, 
        @User('userId') currentUserId: number): Promise<UserRes> {
        return await this.userService.update(user, currentUserId);
    }
}
