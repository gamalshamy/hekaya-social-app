import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiError } from '../../../shared/models/api-error.interface';
import { PostsResponse } from '../models/posts-response.interface';
import { CreatePostResponse } from '../models/create-post-response.interface';
import { LikePostResponse } from '../models/like-post-response.interface';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.baseUrl;

  private readonly _isLoadingPosts = signal(false);
  private readonly _postsError = signal<string | null>(null);
  private readonly _isCreatingPost = signal(false);
  private readonly _createPostError = signal<string | null>(null);

  readonly isLoadingPosts = this._isLoadingPosts.asReadonly();
  readonly postsError = this._postsError.asReadonly();
  readonly isCreatingPost = this._isCreatingPost.asReadonly();
  readonly createPostError = this._createPostError.asReadonly();






  private getErrorMessage(error: HttpErrorResponse): string {
    const apiError = error.error as Partial<ApiError> | null;

    if (apiError) {
      if (typeof apiError.message === 'string' && apiError.message.trim()) {
        return apiError.message.trim();
      }

      if (typeof apiError.errors === 'string' && apiError.errors.trim()) {
        return apiError.errors.trim();
      }
    }

    return 'Something went wrong. Please try again.';
  }

  getAllPosts(): Observable<PostsResponse> {
    this._isLoadingPosts.set(true);
    this._postsError.set(null);

    return this.http
      .get<PostsResponse>(`${this.apiUrl}/posts`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this._postsError.set(this.getErrorMessage(error));
          return throwError(() => error);
        }),
        finalize(() => this._isLoadingPosts.set(false)),
      );
  }


  createPost(formData: FormData): Observable<CreatePostResponse> {
    this._isCreatingPost.set(true);
    this._createPostError.set(null);

    return this.http
      .post<CreatePostResponse>(`${this.apiUrl}/posts`, formData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this._createPostError.set(this.getErrorMessage(error));
          return throwError(() => error);
        }),
        finalize(() => this._isCreatingPost.set(false)),
      );
  }

  likePost(postId: string): Observable<LikePostResponse> {
    return this.http.put<LikePostResponse>(
      `${this.apiUrl}/posts/${postId}/like`,
      null,
    );
  }
}
