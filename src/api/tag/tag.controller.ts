import { Controller, Get } from '@nestjs/common';
import { TagListRes } from './tag.interface';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
    constructor(
        private readonly tagService: TagService,
    ) {}

    @Get()
    async findAll(): Promise<TagListRes> {
        return await this.tagService.findAll();
    }
}