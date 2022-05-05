import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';
import { TagListRes } from './tag.interface';

/**
 * {@link TagService}
 * 
 * @author Tom Schuh
 */
@Injectable()
export class TagService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Finds and returns all tags.
   * 
   * @returns list of tags in wrapper obejct {@link TagListRes}.
   */
  async findAll(): Promise<TagListRes> {
    const tags = (await this.prismaService.tag.findMany({})).map((t) => t.name);
    return { tags: tags };
  }
}
