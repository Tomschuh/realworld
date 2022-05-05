import { ApiProperty } from "@nestjs/swagger";

export class UpdateArticleDto {
  @ApiProperty({
    required: false
  })
  title?: string;
  @ApiProperty({
    required: false
  })
  description?: string;
  @ApiProperty({
    required: false
  })
  body?: string;
}
