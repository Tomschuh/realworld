import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { TagListRes } from './tag.interface';

@Injectable()
export class TagService {
    constructor(
        private readonly prismaService: PrismaService,
    ) {}

    async findAll(): Promise<TagListRes> {
        const tags = (await this.prismaService.tag.findMany({})).map(t => t.name);
        return { tags: tags };
    }
}