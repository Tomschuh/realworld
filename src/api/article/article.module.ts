import { Module } from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
    controllers: [ArticleController],
    providers: [
        ArticleService,
        PrismaService,
    ]
})
export class ArticleModule { }
