import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post, UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../user/auth/jwt.guard';
import { User } from '../user/user.decorator';
import { ProfileRes } from './profile.interface';
import { ProfileService } from './profile.service';

/**
 * {@link ProfileController} is handling communication with profile module.
 *
 * @author Tom Schuh
 */
@ApiTags('profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  @ApiBearerAuth()
  @ApiParam({ type: 'string', required: true, name: 'username' })
  @ApiResponse({ status: 200, description: 'Get a user profile' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(
    @Param('username') username: string,
    @User('userId') currentUserId: number
  ): Promise<ProfileRes> {
    return await this.profileService.findOne(username, currentUserId);
  }

  @Post(':username/follow')
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiParam({ type: 'string', required: true, name: 'username' })
  @ApiResponse({ status: 200, description: 'User profile followed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseGuards(JwtAuthGuard)
  async follow(
    @Param('username') username: string,
    @User('userId') currentUserId: number
  ): Promise<ProfileRes> {
    return await this.profileService.follow(username, currentUserId);
  }

  @Delete(':username/follow')
  @ApiBearerAuth()
  @ApiParam({ type: 'string', required: true, name: 'username' })
  @ApiResponse({ status: 200, description: 'User profile unfollowed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseGuards(JwtAuthGuard)
  async unfollow(
    @Param('username') username: string,
    @User('userId') currentUserId: number
  ): Promise<ProfileRes> {
    return await this.profileService.unfollow(username, currentUserId);
  }
}
