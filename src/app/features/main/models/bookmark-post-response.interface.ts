
export interface BookmarkPostResponse {
    success: boolean;
    message: string;
    data: {
        bookmarked: boolean;
        bookmarksCount: number;
    };
}
