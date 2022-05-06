import { Article } from '@prisma/client';
import { Comment } from '@prisma/client';
import { ArticleData, CommentData } from './article.interface';

/**
 * Map article to response object.
 *
 * @param currentUserId identificator of currently logged user.
 * @param param1 data used for mapping response obejct.
 * @returns article response obejct {@link ArticleData}
 */
export const mapArticleDataRes = (
  currentUserId: number,
  {
    favoritedBy,
    author,
    ...article
  }: Article & {
    author: {
      username: string;
      image?: string;
      bio?: string;
      followedBy: { id: number }[];
    };
    favoritedBy: { id: number }[];
    tagList: { name: string }[];
  }
): ArticleData => {
  const { followedBy, ...authorData } = author;
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    body: article.body,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt ? article.updatedAt.toISOString() : null,
    author: {
      ...authorData,
      following: followedBy.map((f) => f.id).includes(currentUserId),
    },
    tagList: article.tagList.map((t) => t.name),
    favorited: favoritedBy.map((f) => f.id).includes(currentUserId),
    favoritesCount: Array.isArray(favoritedBy) ? favoritedBy.length : 0,
  };
};

/**
 * Map comment to response obejct.
 *
 * @param currentUserId identificator of currently logged user.
 * @param param1 data used for mapping response obejct.
 * @returns comment response obejct {@link CommentData}.
 */
export const mapCommentDataRes = (
  currentUserId: number,
  {
    author,
    ...comment
  }: Comment & {
    author: {
      username: string;
      image?: string;
      bio?: string;
      followedBy: { id: number }[];
    };
  }
): CommentData => {
  const { followedBy, ...authorData } = author;
  return {
    id: comment.id,
    createdAt: comment.createdAt.toISOString(),
    body: comment.body,
    author: {
      ...authorData,
      following: followedBy.map((f) => f.id).includes(currentUserId),
    },
  };
};
