import { Post } from './post.interface';

export interface PostsPagination {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage: number | null;
    total: number;
}

export interface PostsResponse {
    success: boolean;
    message: string;
    data: {
        posts: Post[];
    };
    meta: {
        pagination: PostsPagination;
    };
}
