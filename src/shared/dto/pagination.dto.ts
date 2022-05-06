import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class PaginationDto {
  @ApiProperty()
  @IsNumber()
  limit?: number = 20;
  @ApiProperty()
  @IsNumber()
  offset?: number = 0;
}