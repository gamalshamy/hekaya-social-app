export interface CreatePostResponse {
    success: boolean;
    message: string;
    data: {
        post: CreatedPost;
    };
}

export interface CreatedPost {
    _id: string;
    id: string;
    body?: string;
    image?: string;
    privacy: string;
    user: string;
    sharedPost: null;
    likes: string[];
    createdAt: string;
    likesCount: number;
    isShare: boolean;
}