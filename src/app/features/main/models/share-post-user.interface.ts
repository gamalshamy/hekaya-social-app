export interface SharePostResponse {
    success: boolean;
    message: string;
    data: {
        post: {
            _id: string;
            body: string | null;
            privacy: string;
            user: SharePostUser;
            sharedPost: OriginalSharedPost | null;
            likes: string[];
            createdAt: string;
            commentsCount: number;
            topComment: SharePostComment | null;
            sharesCount: number;
            likesCount: number;
            isShare: boolean;
            id: string;
        };
    };
}

export interface SharePostUser {
    _id: string;
    name: string;
    username: string;
    photo: string;
    // followersCount: number;
    // followingCount: number;
    // bookmarksCount: number;
    // id: string;
}

export interface OriginalSharedPost {
    _id: string;
    body: string | null;
    image?: string;
    privacy: string;
    user: SharePostUser;
    sharedPost: string | null;
    likes: string[];
    createdAt: string;
    commentsCount: number;
    topComment: SharePostComment | null;
    sharesCount: number;
    likesCount: number;
    isShare: boolean;
    id: string;
}

export interface SharePostComment {
    _id: string;
    content?: string;
    commentCreator: SharePostUser;
    post: string;
    parentComment: string | null;
    likes: string[];
    createdAt: string;
}
