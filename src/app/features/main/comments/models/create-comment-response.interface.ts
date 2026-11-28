export interface CreateCommentResponse {
    success: boolean;
    message: string;

    data: {
        comment: {
            _id: string;
            content?: string;
            image?: string;

            commentCreator: {
                _id: string;
                name: string;
                username: string;
                photo: string;
                followersCount: number;
                followingCount: number;
                bookmarksCount: number;
                id: string;
            };

            post: string;
            parentComment: string | null;
            likes: string[];
            createdAt: string;
            likesCount: number;
            isReply: boolean;
            id: string;
        };
    };
}