export interface CommentsResponse {
    success: boolean;
    message: string;

    data: {
        comments: PostComment[];
    };

    meta: {
        pagination: CommentsPagination;
    };
}

export interface CommentsPagination {
    currentPage: number;
    limit: number;
    total: number;
    numberOfPages: number;
}

export interface PostComment {
    _id: string;
    content?: string | null;
    image?: string | null;
    commentCreator: CommentUser;
    post: string;
    parentComment: string | null;
    likes: string[];
    createdAt: string;
    repliesCount: number;
}

export interface CommentUser {
    _id: string;
    name: string;
    username: string;
    photo: string;
}