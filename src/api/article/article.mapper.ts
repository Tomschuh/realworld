import { ArticleData } from "./article.interface";

export const prepareArticleDataRes = (userId: number, {favoritedBy, ...article}) : ArticleData => {
    return {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        author: article.author,
        tagList: article.tagList.map(t => t.name),
        favorited: Array.isArray(favoritedBy) && favoritedBy.map(f => f.id).includes(userId),
        favoritesCount: Array.isArray(favoritedBy) ? favoritedBy.length : 0,
    };
 };