const authorInclude = {
    select: {
        username: true,
        bio: true,
        image: true,
        followedBy: {
            select: {
                id: true,
            },
        },
    }
}

const tagInclude = {
    select: {
        name: true
    }
}

const favoritedByInclude = {
    select: {
        id: true,
    }
}

export const articleInclude = {
    author: authorInclude,
    tagList: tagInclude,
    favoritedBy: favoritedByInclude,
}

export const commentSelect = {
    id: true,
    body: true,
    createdAt: true,
    updatedAt: true,
    author: authorInclude,
}

export const listQuery = (whereClause: any, query: any) => ({
    where: {
        AND: whereClause,
    },
    include: articleInclude,
    ...('limit' in query ? {take: query.limit} : {}),
    ...('offset' in query ? {skip: query.offset} : {}),
    orderBy: {
        createdAt: 'desc' as const,
    }
});

export const createListWhereClause = (query: any) => {
    const queries = [];
    if ('tag' in query) {
        queries.push({
            tagList: {
                 some: {
                     name: query.tag,
                 }
            },
        });
    }
    if ('author' in query) {
        queries.push({
            author: {
                username: {
                    equals: query.author,
                },
            },
        });
    }
    if ('favorited' in query) {
        queries.push({
            favoritedBy: {
                some: {
                    username: query.favorited,
                },
            },
        });
    }
    return queries;
}