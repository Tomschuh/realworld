const authorInclude = {
    select: {
        username: true,
        bio: true,
        image: true,
        following: true
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

export const listQuery = (whereClause, query) => ({
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
