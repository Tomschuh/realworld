import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ArticleController } from './article.controller';
import { ArticleHelper } from './article.helper';
import { ArticleService } from './article.service';

@Module({
    controllers: [ArticleController],
    providers: [
        ArticleService,
        PrismaService,
        ArticleHelper
    ]
})
export class ArticleModule { }
