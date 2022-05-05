import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    readonly username: string;
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