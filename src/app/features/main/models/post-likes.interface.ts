
export interface PostLikeUser {
    _id: string;
    name: string;
    username: string;
    photo: string;
    followersCount: number;
    followingCount: number;
    bookmarksCount: number;
    id: string;
}

export interface PostLikesPagination {
    currentPage: number;
    limit: number;
    total: number;
    numberOfPages: number;
}

export interface PostLikesResponse {
    success: boolean;
    message: string;
    data: {
        likes: PostLikeUser[];
    };
    meta: {
        pagination: PostLikesPagination;
    };
}
