import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { catchNotFoundError } from "src/shared/prisma.error.catch";
import { PrismaService } from "src/shared/prisma/prisma.service";
import {
  ArticleRes,
  ArticlesRes,
  CommentRes,
  CommentsRes,
} from "./article.interface";
import { mapArticleDataRes, mapCommentDataRes } from "./article.mapper";
import {
  articleInclude,
  commentSelect,
  createListWhereClause,
  listQuery,
} from "./article.query";
import { CreateArticleDto } from "./dto/create-article.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateArticleDto } from "./dto/update-article.dto";

@Injectable()
export class ArticleService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query: any, currentUserId: number): Promise<ArticlesRes> {
    const whereClause = createListWhereClause(query);
    const _listQuery = listQuery(whereClause, query);
    const articles = await this.prismaService.article.findMany(_listQuery);

    const articlesCount = await this.prismaService.article.count({
      where: { AND: whereClause },
    });
    return {
      articles: articles.map((a) => mapArticleDataRes(currentUserId, a)),
      articlesCount: articlesCount,
    };
  }

  async feed(query: any, currentUserId: number): Promise<ArticlesRes> {
    const whereClause = {
      author: {
        followedBy: { some: { id: currentUserId } },
      },
    };
    const _listQuery = listQuery(whereClause, query);
    const articles = await this.prismaService.article.findMany(_listQuery);

    let articlesCount = await this.prismaService.article.count({
      where: whereClause,
    });

    return {
      articles: articles.map((a) => mapArticleDataRes(currentUserId, a)),
      articlesCount: articlesCount,
    };
  }

  async findOne(slug: string, currentUserId?: number): Promise<any> {
    let article: any = await this.prismaService.article.findUnique({
      where: {
        slug: slug,
      },
      include: articleInclude,
    });

    return { article: mapArticleDataRes(currentUserId, article) };
  }

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

  async update(
    slug: string,
    artilceDto: UpdateArticleDto,
    currentUserId: number
  ): Promise<ArticleRes> {
    await this.isArticleOwner(slug, currentUserId);

    const article = await this.prismaService.article
      .update({
        where: {
          slug: slug,
        },
        data: {
          ...artilceDto,
          updatedAt: new Date(),
          ...("title" in artilceDto
            ? { slug: await this.generateSlug(artilceDto.title) }
            : {}),
        },
        include: articleInclude,
      })
      .catch((err) => catchNotFoundError(err));

    return { article: mapArticleDataRes(currentUserId, article) };
  }
  // How to catch error from Prisma udpate? How to set default rejectOnNotFound findUnique?
  

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
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

  private async isSlugUnique(slug: string): Promise<boolean> {
    return !(await this.prismaService.article.findUnique({
      where: {
        slug: slug,
      },
    }));
  }

  async delete(slug: string, currentUserId: number): Promise<void> {
    await this.isArticleOwner(slug, currentUserId);

    await this.prismaService.article
      .delete({
        where: {
          slug: slug,
        },
      })
      .catch((err) => catchNotFoundError(err));
  }

  private async isArticleOwner(slug: string, currentUserId: number) {
    let article: any = await this.prismaService.article.findUnique({
      where: {
        slug: slug,
      },
      rejectOnNotFound: (err) =>
        new HttpException("Article not found", HttpStatus.NOT_FOUND),
    });
    if (article.authorId !== currentUserId) {
      throw new HttpException("Permission denied!", HttpStatus.FORBIDDEN);
    }
  }

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
      select: commentSelect,
    });

    return { comment: mapCommentDataRes(currentUserId, comment) };
  }

  async findAllComments(
    slug: string,
    currentUserId?: number
  ): Promise<CommentsRes> {
    let comments = await this.prismaService.comment.findMany({
      where: {
        article: {
          slug: slug,
        },
      },
      select: commentSelect,
    });

    return {
      comments: comments.map((c) => mapCommentDataRes(currentUserId, c)),
    };
  }

  async deleteComment(
    slug: string,
    commentId: number,
    currentUserId: number
  ): Promise<void> {
    this.isCommentOwner(commentId, currentUserId);
    await this.prismaService.comment.delete({
      where: {
        id: commentId,
      },
    })
    .catch((err) => catchNotFoundError(err));
  }

  private async isCommentOwner(commentId: number, currentUserId: number) {
    let comment: any = await this.prismaService.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (comment.authorId !== currentUserId) {
      throw new HttpException("Permission denied!", HttpStatus.FORBIDDEN);
    }
  }

  async favorite(slug: string, currentUserId: number): Promise<ArticleRes> {
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
    })
    .catch((err) => catchNotFoundError(err));

    return { article: mapArticleDataRes(currentUserId, article) };
  }

  async unfavorite(slug: string, currentUserId: number): Promise<ArticleRes> {
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
    })
    .catch((err) => catchNotFoundError(err));

    return { article: mapArticleDataRes(currentUserId, article) };
  }
}
