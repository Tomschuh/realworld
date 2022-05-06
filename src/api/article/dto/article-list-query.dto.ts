import { ApiProperty } from "@nestjs/swagger";
import { PaginationDto } from "@shared/dto/pagination.dto";
import { IsString } from "class-validator";

export class ArticleListQueryDto extends PaginationDto {
  @ApiProperty()
  @IsString()
  tag?: string;
  @ApiProperty()
  @IsString()
  author?: string;
  @ApiProperty()
  @IsString()
  favorited?: string;
}