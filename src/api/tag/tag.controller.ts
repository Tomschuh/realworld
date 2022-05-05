import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagListRes } from './tag.interface';
import { TagService } from './tag.service';

/**
 * {@link TagController} is handling communication with tag module.
 * 
 * @author Tom Schuh
 */
@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Successfully returned list of tags.' })
  async findAll(): Promise<TagListRes> {
    return await this.tagService.findAll();
  }
}
