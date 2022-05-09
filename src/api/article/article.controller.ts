import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { JwtAuthGuard } from '../user/auth/jwt.guard';
import { User } from '../user/user.decorator';
import { ArticleRes, ArticlesRes, CommentRes, CommentsRes } from './article.interface';
import { ArticleService } from './article.service';
import { ArticleListQueryDto } from './dto/article-list-query.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

/**
 * {@link ArticleController} is handling communication with article module.
 * 
 * @author Tom Schuh
 */
@ApiTags('articles')
@Controller('articles')
export class ArticleController {
    constructor(private articleService: ArticleService) {}

    @Get()
    @ApiOperation({description: 'Return list of articles, filtered by query params and sorted by most recent.'})
    @ApiParam({type: 'string', name: 'tag', description: 'Filter by tag.'})
    @ApiParam({type: 'string', name: 'author', description: 'Filter by author username.'})
    @ApiParam({type: 'string', name: 'favorited', description: 'Filter your favorited (only logged users).'})
    @ApiParam({type: 'string', name: 'limit', description: 'Limit of list size.'})
    @ApiParam({type: 'string', name: 'offset', description: 'List offset.'})
    @ApiResponse({status: 200, description: 'List of articles successfully return.'})
    @ApiResponse({status: 400, description: 'Invalid request.'})
    async findAll(
        @Param() query?: ArticleListQueryDto, 
        @User('userId') userId?: number): Promise<ArticlesRes> {
        return await this.articleService.findAll(query, userId);
    }
    @Get('feed')
    @ApiBearerAuth()
    @ApiOperation({description: `Return list of articles of yours followings, filtered by query params. 
    (Only for logged). Sorted by most recent.`})
    @ApiParam({type: 'string', name: 'limit', description: 'Limit of list size.'})
    @ApiParam({type: 'string', name: 'offset', description: 'List offset.'})
    @ApiResponse({status: 200, description: 'List of articles successfully return.'})
    @ApiResponse({status: 400, description: 'Invalid request.'})
    async feed(
        @Query() query: PaginationDto, 
        @User('userId') userId: number): Promise<ArticlesRes> {
        return await this.articleService.feed(query, userId);
    }

    @Get(':slug')
    @ApiBearerAuth()
    @ApiOperation({description: 'Return single article by given slug.'})
    @ApiParam({type: 'string', name: 'slug', description: 'Article indentificatior.'})
    @ApiResponse({status: 200, description: 'Article successfully returned.'})
    @ApiResponse({status: 404, description: 'Article not found!'})
    async findOne(
        @Param('slug') slug: string, 
        @User('userId') currentUserId: number): Promise<ArticleRes>{
        return await this.articleService.findOne(slug, currentUserId);
    }

    @Post()
    @ApiBearerAuth()
    @ApiBody({type: [CreateArticleDto]})
    @ApiResponse({status: 201, description: 'Article created.'})
    @ApiResponse({status: 403, description: 'Operation forbidden.'})
    @ApiResponse({status: 400, description: 'Invalid request.'})
    @UseGuards(JwtAuthGuard)
    async create(
        @Body('article') article: CreateArticleDto, 
        @User('userId') currentUserId: number): Promise<ArticleRes> {
        return (await this.articleService.create(article, currentUserId));
    }

    @Put(':slug')
    @ApiBearerAuth()
    @ApiOperation({description: `Update user's single article.`})
    @ApiBody({type: UpdateArticleDto})
    @ApiParam({type: 'string', name: 'slug', description: 'Article indentificatior.'})
    @ApiResponse({status: 200, description: 'Article updted!'})
    @ApiResponse({status: 400, description: 'Invalid request!'})
    @ApiResponse({status: 401, description: 'Unauthorized!'})
    @ApiResponse({status: 403, description: 'Operation forbidden!'})
    @ApiResponse({status: 404, description: 'Article not found!'})
    @UseGuards(JwtAuthGuard)
    async update(
        @Param('slug') slug: string,
        @Body('article') article: UpdateArticleDto, 
        @User('userId') currentUserId: number): Promise<ArticleRes> {
        return await this.articleService.update(slug, article, currentUserId);
    }

    @Delete(':slug')
    @ApiBearerAuth()
    @ApiOperation({description: `Delete user's single article.`})
    @ApiParam({type: 'string', name: 'slug', description: 'Article indentificatior.'})
    @ApiResponse({status: 200, description: 'Article deleted!'})
    @ApiResponse({status: 401, description: 'Unauthorized!'})
    @ApiResponse({status: 403, description: 'Operation forbidden!'})
    @ApiResponse({status: 404, description: 'Article not found!'})
    @UseGuards(JwtAuthGuard)
    async delete(
        @Param('slug') slug: string, 
        @User('userId') currentUserId: number): Promise<void> {
        return await this.articleService.delete(slug, currentUserId);
    }

    @Post(':slug/comments')
    @ApiBearerAuth()
    @ApiOperation({description: `Add comment to single article`})
    @ApiBody({type: CreateCommentDto})
    @ApiParam({type: 'string', name: 'slug', description: 'Article indentificatior.'})
    @ApiResponse({status: 200, description: 'Comment created!'})
    @ApiResponse({status: 400, description: 'Invalid request!'})
    @ApiResponse({status: 401, description: 'Unauthorized!'})
    @ApiResponse({status: 404, description: 'Article not found!'})
    @UseGuards(JwtAuthGuard)
    async createComment(
        @Param('slug') slug: string, 
        @Body('comment') comment: CreateCommentDto, 
        @User('userId') currentUserId: number): Promise<CommentRes> {
        return await this.articleService.createComment(slug, comment, currentUserId);
    }

    @Get(':slug/comments')
    @ApiBearerAuth()
    @ApiOperation({description: `Find all comment of single article.`})
    @ApiParam({type: 'string', name: 'slug', description: 'Article indentificatior.'})
    @ApiResponse({status: 200, description: 'List of comments successfully returned.'})
    @ApiResponse({status: 404, description: 'Article not found!'})
    async findAllComments(
        @Param('slug') slug: string, 
        @User('userId') currentUserId: number): Promise<CommentsRes> {
        return await this.articleService.findAllComments(slug, currentUserId);
    }

    @Delete(':slug/comments/:commentId')
    @ApiBearerAuth()
    @ApiOperation({description: `Delete single comment.`})
    @ApiParam({type: 'string', name: 'slug', description: 'Article indentificator.'})
    @ApiParam({type: 'number', name: 'commnet id', description: 'Comment indentificator.'})
    @ApiResponse({status: 200, description: 'Comment was successfully deleted.'})
    @ApiResponse({status: 401, description: 'Unauthorized!'})
    @ApiResponse({status: 403, description: 'Operation forbidden!'})
    @ApiResponse({status: 404, description: 'Comment not found'})
    @UseGuards(JwtAuthGuard)
    async deleteComment(
        @Param('slug') slug: string, 
        @Param('commentId', ParseIntPipe) commentId: number,
        @User('userId') currentUserId: number): Promise<void> {
        return await this.articleService.deleteComment(slug, commentId, currentUserId);
    }

    @Post(':slug/favorite')
    @HttpCode(200)
    @ApiBearerAuth()
    @ApiOperation({description: `Mark article as user's favorite.`})
    @ApiParam({type: 'string', name: 'slug', description: 'Article indentificator'})
    @ApiResponse({status: 200, description: 'Article successfully marked.'})
    @ApiResponse({status: 401, description: 'Unauthorized!'})
    @ApiResponse({status: 403, description: 'Operation forbidden!'})
    @ApiResponse({status: 404, description: 'Article not found!'})
    @UseGuards(JwtAuthGuard)
    async favorite(@Param('slug') slug: string, @User('userId') currentUserId: number): Promise<ArticleRes> {
        return await this.articleService.favorite(slug, currentUserId);
    }

    @Delete(':slug/favorite')
    @ApiOperation({description: `Unmark article as user's favorite`})
    @ApiParam({type: 'string', name: 'slug', description: 'Article indentificatior.'})
    @ApiResponse({status: 200, description: 'Article successfully marked.'})
    @ApiResponse({status: 401, description: 'Unauthorized!'})
    @ApiResponse({status: 403, description: 'Operation forbidden!'})
    @ApiResponse({status: 404, description: 'Article not found!'})
    @UseGuards(JwtAuthGuard)
    async unfavorite(@Param('slug') slug: string, @User('userId') currentUserId: number): Promise<ArticleRes> {
        return await this.articleService.unfavorite(slug, currentUserId);
    }
}


