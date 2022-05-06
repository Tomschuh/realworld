import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { catchNotFoundError } from '@shared/prisma/prisma.error.catch';
import { PrismaService } from '@shared/prisma/prisma.service';
import {
  ArticleRes,
  ArticlesRes,
  CommentRes,
  CommentsRes,
} from './article.interface';
import { mapArticleDataRes, mapCommentDataRes } from './article.mapper';
import {
  articleInclude,
  commentInclude,
  createListWhereClause,
} from './article.prisma.query';
import { ArticleListQueryDto } from './dto/article-list-query.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

/**
 * {@link ArticleService}
 *
 * @author Tom Schuh
 */
@Injectable()
export class ArticleService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Finds and returns list of articles filtered by query {@link }.
   * The articles are sorted by most recent.
   *
   * @param query contains query used for filter list of articles.
   * @param currentUserId identificator of currently logged user.
   * @returns list of articles in wrapper object {@link ArticlesRes}
   */
  async findAll(
    query: ArticleListQueryDto,
    currentUserId?: number
  ): Promise<ArticlesRes> {
    const whereClause = createListWhereClause(query);

    const articles = await this.prismaService.article.findMany({
      where: {
        AND: whereClause,
      },
      include: articleInclude,
      ...(query.limit ? { take: query.limit } : {}),
      ...(query.offset ? { skip: query.offset } : {}),
      orderBy: {
        createdAt: 'desc' as const,
      },
    });

    const articlesCount = await this.prismaService.article.count({
      where: { AND: whereClause },
    });

    return {
      articles: articles.map((a) => mapArticleDataRes(currentUserId, a)),
      articlesCount: articlesCount,
    };
  }

  /**
   * Finds and returns list of articles filtered by query and only from user's following.
   * Articles are sorted by most recent.
   *
   * @param query contains query used for filter list of articles.
   * @param currentUserId identificator of currently logged user.
   * @returns list of articles in wrapper object {@link ArticlesRes}
   */
  async feed(
    query: PaginationDto,
    currentUserId: number
  ): Promise<ArticlesRes> {
    const whereClause = {
      author: {
        followedBy: { some: { id: currentUserId } },
      },
    };

    const articles = await this.prismaService.article.findMany({
      where: {
        author: {
          followedBy: { some: { id: currentUserId } },
        },
      },
      include: articleInclude,
      ...(query.limit ? { take: query.limit } : {}),
      ...(query.offset ? { skip: query.offset } : {}),
      orderBy: {
        createdAt: 'desc' as const,
      },
    });

    const articlesCount = await this.prismaService.article.count({
      where: whereClause,
    });

    return {
      articles: articles.map((a) => mapArticleDataRes(currentUserId, a)),
      articlesCount: articlesCount,
    };
  }

  /**
   * Finds and returns one an article by given slug.
   *
   * @param slug article identificator.
   * @param currentUserId identificator of currently logged user.
   * @returns one article in wrapper object {@link ArticleRes}.
   */
  async findOne(slug: string, currentUserId?: number): Promise<ArticleRes> {
    try {
      const article = await this.prismaService.article.findUnique({
        where: {
          slug: slug,
        },
        include: articleInclude,
      });

      return { article: mapArticleDataRes(currentUserId, article) };
    } catch (error) {
      catchNotFoundError(error);
    }
  }

  /**
   * Creates an article according to dto object.
   *
   * @param articleDto object contianing data for article creation.
   * @param currentUserId identificator of currently logged user.
   * @returns single article in wrapper object {@link ArticleRes}.
   */
  async create(
    articleDto: CreateArticleDto,
    currentUserId: number
  ): Promise<ArticleRes> {
    const { tagList, ..._article } = articleDto;
    const article = await this.prismaService.article.create({
      data: {
        slug: await this.generateSlug(articleDto.title),
        author: {
          connect: {
            id: currentUserId,
          },
        },
        tagList: {
          connectOrCreate: tagList.map((tag) => {
            return {
              where: {
                name: tag,
              },
              create: {
                name: tag,
              },
            };
          }),
        },
        ..._article,
      },
      include: articleInclude,
    });

    return { article: mapArticleDataRes(currentUserId, article) };
  }

  /**
   * Updates an article by given dto object.
   *
   * @param slug article identificator.
   * @param articleDto object contianing data for article creation.
   * @param currentUserId identificator of currently logged user.
   * @returns single article in wrapper object {@link ArticleRes}.
   */
  async update(
    slug: string,
    articleDto: UpdateArticleDto,
    currentUserId: number
  ): Promise<ArticleRes> {
    await this.isArticleOwner(slug, currentUserId);
    try {
      const article = await this.prismaService.article.update({
        where: {
          slug: slug,
        },
        data: {
          ...articleDto,
          updatedAt: new Date(),
          ...('title' in articleDto
            ? { slug: await this.generateSlug(articleDto.title) }
            : {}),
        },
        include: articleInclude,
      });

      return { article: mapArticleDataRes(currentUserId, article) };
    } catch (error) {
      catchNotFoundError(error);
    }
  }

  /**
   * Generates slug according to article title and check if is slug unique.
   * If not, an incremental number will be added to the end of the line.
   *
   * @param title article title.
   * @returns generated slug.
   */
  private async generateSlug(title: string): Promise<string> {
    let slug: string = this.createSlug(title);
    let i: number = 1;
    while (!(await this.isSlugUnique(slug))) {
      slug = this.createSlug(title + ` ${i++}`);
    }
    return slug;
  }

  private createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace('-', '')
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
  }

  private async isSlugUnique(slug: string): Promise<boolean> {
    return !(await this.prismaService.article.findUnique({
      where: {
        slug: slug,
      },
      rejectOnNotFound: false,
    }));
  }

  /**
   * Delete article owned by logged user.
   *
   * @param slug article identificator.
   * @param currentUserId identificator of currently logged user.
   */
  async delete(slug: string, currentUserId: number): Promise<void> {
    await this.isArticleOwner(slug, currentUserId);
    try {
      await this.prismaService.article.delete({
        where: {
          slug: slug,
        },
      });
    } catch (error) {
      catchNotFoundError(error);
    }
  }

  /**
   * Finds an article and check if an user is an owner.
   *
   * @param slug article identificator.
   * @param userId user identificator.
   */
  private async isArticleOwner(slug: string, userId: number) {
    try {
      const article = await this.prismaService.article.findUnique({
        where: {
          slug: slug,
        },
      });
      if (article.authorId !== userId) {
        throw new HttpException(
          'Only the article owner can manipulate the article!',
          HttpStatus.FORBIDDEN
        );
      }
    } catch (error) {
      catchNotFoundError(error);
    }
  }

  /**
   * Creates a {@link Comment} according to dto object for an article.
   *
   * @param slug article identificator.
   * @param commentDto contians data for article creation.
   * @param currentUserId identificator of currently logged user.
   * @returns commnet in wrapper object {@link CommentRes}
   */
  async createComment(
    slug: string,
    commentDto: CreateCommentDto,
    currentUserId: number
  ): Promise<CommentRes> {
    const comment = await this.prismaService.comment.create({
      data: {
        author: {
          connect: { id: currentUserId },
        },
        article: {
          connect: { slug: slug },
        },
        body: commentDto.body,
      },
      include: commentInclude,
    });

    return { comment: mapCommentDataRes(currentUserId, comment) };
  }

  /**
   * Finds and returns all comments of one an article.
   *
   * @param slug article identificator.
   * @param currentUserId identificator of currently logged user.
   * @returns list of comments in wrapper object {@link CommentsRes}.
   */
  async findAllComments(
    slug: string,
    currentUserId?: number
  ): Promise<CommentsRes> {
    const comments = await this.prismaService.comment.findMany({
      where: {
        article: {
          slug: slug,
        },
      },
      include: commentInclude,
    });

    return {
      comments: comments.map((c) => mapCommentDataRes(currentUserId, c)),
    };
  }

  /**
   * Delete logged user's comment.
   *
   * @param slug article identificator.
   * @param commentId comment identificator.
   * @param currentUserId identificator of currently logged user.
   */
  async deleteComment(
    slug: string,
    commentId: number,
    currentUserId: number
  ): Promise<void> {
    this.isCommentOwner(commentId, currentUserId);
    try {
      await this.prismaService.comment.delete({
        where: {
          id: commentId,
        },
      });
    } catch (error) {
      catchNotFoundError(error);
    }
  }

  /**
   * Finds an comment and check if an user is an owner.
   *
   * @param commentId comment identificator.
   * @param userId user identificator.
   */
  private async isCommentOwner(commentId: number, userId: number) {
    try {
      const comment = await this.prismaService.comment.findUnique({
        where: {
          id: commentId,
        },
      });

      if (comment.authorId !== userId) {
        throw new HttpException(
          'Only the comment owner can manipulate the comment.',
          HttpStatus.FORBIDDEN
        );
      }
    } catch (error) {
      catchNotFoundError(error);
    }
  }

  /**
   * Adds an article to user's favorite articles.
   *
   * @param slug article identificator.
   * @param currentUserId identificator of currently logged user.
   * @returns favorite article in wrapper object {@link ArticleRes}.
   */
  async favorite(slug: string, currentUserId: number): Promise<ArticleRes> {
    try {
      const article = await this.prismaService.article.update({
        where: {
          slug: slug,
        },
        data: {
          favoritedBy: {
            connect: {
              id: currentUserId,
            },
          },
        },
        include: articleInclude,
      });

      return { article: mapArticleDataRes(currentUserId, article) };
    } catch (error) {
      catchNotFoundError(error);
    }
  }

  /**
   * Removes an article from user's favorite articles.
   *
   * @param slug article identificator.
   * @param currentUserId identificator of currently logged user.
   * @returns favorite article in wrapper object {@link ArticleRes}.
   */
  async unfavorite(slug: string, currentUserId: number): Promise<ArticleRes> {
    try {
      const article = await this.prismaService.article.update({
        where: {
          slug: slug,
        },
        data: {
          favoritedBy: {
            disconnect: {
              id: currentUserId,
            },
          },
        },
        include: articleInclude,
      });
      return { article: mapArticleDataRes(currentUserId, article) };
    } catch (error) {
      catchNotFoundError(error);
    }
  }
}
