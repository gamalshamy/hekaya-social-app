
export interface LikePostResponse {
    success: boolean;
    message: string;
    data: {
        liked: boolean;
        likesCount: number;
        post: {
            _id: string;
            body?: string;
            privacy: string;
            user: {
                _id: string;
                name: string;
                username: string;
                photo: string;
                followersCount: number;
                followingCount: number;
                bookmarksCount: number;
                id: string;
            };
            sharedPost: string | null;
            likes: string[];
            createdAt: string;
            likesCount: number;
            isShare: boolean;
            id: string;
        };
    };
}
