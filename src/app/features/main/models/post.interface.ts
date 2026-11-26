
export type PostPrivacy = 'public' | 'followers' | 'only-me';

export interface PostUser {
    _id: string;
    name: string;
    username: string;
    photo: string;
}

export interface PostCommentCreator {
    _id: string;
    name: string;
    username: string;
    photo: string;
}

export interface PostComment {
    _id: string;
    content?: string;
    image?: string;
    commentCreator: PostCommentCreator;
    post: string;
    parentComment: string | null;
    likes: string[];
    createdAt: string;
}

export interface SharedPost {
    _id: string;
    body?: string;
    image?: string;
    privacy: PostPrivacy;
    user: PostUser;
    sharedPost: SharedPost | null;
    likes: string[];
    createdAt: string;
    commentsCount: number;
    topComment: PostComment | null;
    sharesCount: number;
    likesCount: number;
    isShare: boolean;
    id: string;
}

export interface Post {
    _id: string;
    body?: string;
    image?: string;
    privacy: PostPrivacy;
    user: PostUser;
    sharedPost: SharedPost | null;
    likes: string[];
    createdAt: string;
    commentsCount: number;
    topComment: PostComment | null;
    sharesCount: number;
    likesCount: number;
    isShare: boolean;
    id: string;
    bookmarked: boolean;
}
