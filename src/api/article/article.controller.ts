import { Controller, Get, Param } from '@nestjs/common';
import { UserController } from '../user/user.controller';
import { User } from '../user/user.decorator';
import { ArticleService } from './article.service';
import { Article } from './interface/article.interface';

@Controller('articles')
export class ArticleController {
    constructor(private articleService: ArticleService) {}

    @Get()
    async findAll(): Promise<Article[]> {
        return await this.articleService.findAll();
    }

    @Get(':slug')
    async findOne(@Param('slug') slug: string, @User('id') id: number) : Promise<any>{
        return await this.articleService.findOne(slug);
    }
}


