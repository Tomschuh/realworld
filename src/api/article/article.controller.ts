import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../user/auth/jwt.guard';
import { User } from '../user/user.decorator';
import { ArticleRes, ArticlesRes, CommentRes, CommentsRes } from './article.interface';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticleController {
    constructor(private articleService: ArticleService) {}

    @Get()
    async findAll(
        @Query() query: any, 
        @User('userId') userId: number): Promise<ArticlesRes> {
        return await this.articleService.findAll(query, userId);
    }
    @Get('feed')
    async feed(
        @Query() query: any, 
        @User('userId') userId: number): Promise<ArticlesRes> {
        return await this.articleService.feed(query, userId);
    }

    @Get(':slug')
    async findOne(
        @Param('slug') slug: string, 
        @User('userId') currentUserId: number): Promise<ArticleRes>{
        return await this.articleService.findOne(slug, currentUserId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async create(
        @Body('article') article: CreateArticleDto, 
        @User('userId') currentUserId: number): Promise<ArticleRes> {
        let test : ArticleRes = (await this.articleService.create(article, currentUserId));
        console.log(test);
        console.log(typeof test.article.createdAt)
        return test;
    }

    @Put(':slug')
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('slug') slug: string,
        @Body('article') article: UpdateArticleDto, 
        @User('userId') currentUserId: number): Promise<ArticleRes> {
        return await this.articleService.update(slug, article, currentUserId);
    }

    @Delete(':slug')
    @UseGuards(JwtAuthGuard)
    async delete(
        @Param('slug') slug: string, 
        @User('userId') currentUserId: number): Promise<void> {
        return await this.articleService.delete(slug, currentUserId);
    }

    @Post(':slug/comments')
    @UseGuards(JwtAuthGuard)
    async createComment(
        @Param('slug') slug: string, 
        @Body('comment') comment: CreateCommentDto, 
        @User('userId') currentUserId: number): Promise<CommentRes> {
        return await this.articleService.createComment(slug, comment, currentUserId);
    }

    @Get(':slug/comments')
    async findAllComments(
        @Param('slug') slug: string, 
        @User('userId') currentUserId: number): Promise<CommentsRes> {
        return await this.articleService.findAllComments(slug, currentUserId);
    }

    @Delete(':slug/comments/:commentId')
    @UseGuards(JwtAuthGuard)
    async deleteComment(
        @Param('slug') slug: string, 
        @Param('commentId', ParseIntPipe) commentId: number,
        @User('userId') currentUserId: number): Promise<void> {
        return await this.articleService.deleteComment(slug, commentId, currentUserId);
    }

    @Post(':slug/favorite')
    @UseGuards(JwtAuthGuard)
    async favorite(@Param('slug') slug: string, @User('userId') currentUserId: number): Promise<ArticleRes> {
        return await this.articleService.favorite(slug, currentUserId);
    }

    @Delete(':slug/favorite')
    @UseGuards(JwtAuthGuard)
    async unfavorite(@Param('slug') slug: string, @User('userId') currentUserId: number): Promise<ArticleRes> {
        return await this.articleService.unfavorite(slug, currentUserId);
    }
}


