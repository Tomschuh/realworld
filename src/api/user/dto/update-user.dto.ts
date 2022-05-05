import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @ApiProperty()
    email?: string;
    @ApiProperty()
    username?: string;
    @ApiProperty()
    password?: string;
    @ApiProperty({
        description: 'URL of the image'
    })
    image?: string;
    @ApiProperty({
        description: 'Something about user'
    })
    bio?: string;
}