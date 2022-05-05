import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator'

export class LoginUserDto {
    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    readonly email: string;
    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    readonly password: string;
}