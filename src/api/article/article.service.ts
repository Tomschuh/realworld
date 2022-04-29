import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { setTimeout } from 'timers/promises';
import { Article } from './interface/article.interface';

const author = {
    select: {
        username: true,
        bio: true,
        image: true,
        following: true
    }
}

const tags = {
    select: {
        name: true
    }
}

@Injectable()
export class ArticleService {
    constructor(private prisma: PrismaService) { }

    async findAll(): Promise<any> {
        return await this.prisma.article.findMany({

        });
    }

    async findOne(slug: string, userId?: number): Promise<any> {
        let article: any = await this.prisma.article.findUnique({
            where: { 
                slug: slug 
            },
            include: {
                author: author,
                tagList: tags
            }
        });

        return { article };
    }
}
