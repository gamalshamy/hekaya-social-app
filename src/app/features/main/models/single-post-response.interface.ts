import { Post } from "./post.interface";

export interface SinglePostResponse {
    success: boolean;
    message: string;
    data: {
        post: Post;
    };
}