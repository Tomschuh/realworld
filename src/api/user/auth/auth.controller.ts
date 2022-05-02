import { Body, Controller, Post } from '@nestjs/common';
import { UserRes} from '../user.interface';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post()
    async create(@Body('user') body: CreateUserDto): Promise<UserRes | never> {
        return await this.authService.create(body);
    }

    @Post('login')
    async login(@Body('user') body: LoginUserDto): Promise<UserRes | never> {
        return await this.authService.login(body);
    }
}
