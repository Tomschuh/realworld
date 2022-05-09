import { ApiProperty } from "@nestjs/swagger";
import { PaginationDto } from "@shared/dto/pagination.dto";
import { IsString, ValidateIf } from "class-validator";

export class ArticleListQueryDto extends PaginationDto {
  @ApiProperty({
    required: false
  })
  @IsString()  
  @ValidateIf((object, value) => value)
  tag?: string;
  @ApiProperty({
    required: false
  })
  @IsString()
  @ValidateIf((object, value) => value)
  author?: string;
  @ApiProperty({
    required: false
  })
  @ValidateIf((object, value) => value)
  @IsString()
  favorited?: string;
}