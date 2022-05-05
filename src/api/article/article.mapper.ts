import { ArticleData, CommentData } from "./article.interface";

export const mapArticleDataRes = (currentUserId: number, {favoritedBy, author, ...article}: any) : ArticleData => {
    const {followedBy, ...authorData } = author; 
    return {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        createdAt: article.createdAt.toISOString(),
        updatedAt: article.updatedAt ? article.updatedAt.toISOString() : null,
        author: {
            ...authorData,
            following: mapAuthorFollowings(followedBy, currentUserId)
        },
        tagList: article.tagList.map(t => t.name),
        favorited: Array.isArray(favoritedBy) && favoritedBy.map(f => f.id).includes(currentUserId),
        favoritesCount: Array.isArray(favoritedBy) ? favoritedBy.length : 0,
    };
 };

 export const mapCommentDataRes = (currentUserId: number, {author, ...comment}: any): CommentData => {
    const {followedBy, ...authorData } = author; 
    return {
        ...comment,
        author: {
            ...authorData,
            following: mapAuthorFollowings(followedBy, currentUserId),
        },
    }
 }

const mapAuthorFollowings = (followedBy: any[], currentUserId: number): boolean => {
    if ((followedBy.map(f=>f.id)).includes(currentUserId)) {
        return true;
    }
    return false;
};