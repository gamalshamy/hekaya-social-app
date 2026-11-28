import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { CommentsResponse } from '../models/comments-response.interface';
import { CreateCommentResponse } from '../models/create-comment-response.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.baseUrl;

  getPostComments(
    postId: string,
    page = 1,
    limit = 10,
  ): Observable<CommentsResponse> {
    const params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    return this.http.get<CommentsResponse>(
      `${this.apiUrl}/posts/${postId}/comments`,
      { params },
    );
  }

  // Create Comment
  createComment(postId: string, content?: string, image?: File | null): Observable<CreateCommentResponse> {
    const formData = new FormData();

    if (content?.trim()) {
      formData.append('content', content.trim());
    }

    if (image) {
      formData.append('image', image);
    }

    return this.http.post<CreateCommentResponse>(
      `${this.apiUrl}/posts/${postId}/comments`,
      formData,
    );
  }
}
