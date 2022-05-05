import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateArticleDto {
    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    readonly title : string;
    @ApiProperty({
        required: true
    })
    @IsNotEmpty()
    @ApiProperty({
        required: true
    })
    readonly description : string;
    @IsNotEmpty()
    @ApiProperty({
        required: true
    })
    readonly body : string;
    @ApiProperty({
        required: false,
        type: 'array',
        description: 'List of tags',
        example: ['Tropical animals', 'Regular animals']
    })
    readonly tagList? : string[];
}