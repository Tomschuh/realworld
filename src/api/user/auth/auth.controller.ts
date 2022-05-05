import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRes } from '../user.interface';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

/**
 * {@link AuthContoller} is handling communication with authentication module.
 * 
 * @author Tom Schuh
 */
@ApiTags('auth')
@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid request.' })
  async create(@Body('user') body: CreateUserDto): Promise<UserRes | never> {
    return await this.authService.create(body);
  }

  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: 'Login successfull.' })
  @ApiResponse({ status: 400, description: 'Invalid request.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async login(@Body('user') body: LoginUserDto): Promise<UserRes | never> {
    return await this.authService.login(body);
  }
}
