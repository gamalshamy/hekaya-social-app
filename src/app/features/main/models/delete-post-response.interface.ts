
export interface DeletePostResponse {
    success: boolean;
    message: string;
    data: {
        post: {
            _id: string;
            privacy: string;
            user: string;
            sharedPost: string | null;
            likes: string[];
            createdAt: string;
            likesCount: number;
            isShare: boolean;
            id: string;
        };
    };
}
