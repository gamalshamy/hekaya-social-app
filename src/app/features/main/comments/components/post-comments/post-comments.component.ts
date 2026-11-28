import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { finalize } from 'rxjs';
import { PostComment } from '../../models/comments-response.interface';
import { CommentsService } from '../../services/comments.service';
import { CreateCommentResponse } from '../../models/create-comment-response.interface';
import { CreateCommentComponent } from '../create-comment/create-comment.component';

@Component({
  selector: 'app-post-comments',
  imports: [InfiniteScrollDirective, CreateCommentComponent],
  templateUrl: './post-comments.component.html',
  styleUrl: './post-comments.component.css',
})
export class PostCommentsComponent implements OnInit, OnDestroy {
  private readonly commentsService = inject(CommentsService);

  readonly postId = input.required<string>();

  readonly comments = signal<PostComment[]>([]);
  readonly totalComments = signal(0);
  readonly nextPage = signal<number | null>(1);

  readonly isLoadingComments = signal(false);
  readonly commentsError = signal<string | null>(null);

  private readonly pageLimit = 10;

  readonly currentTime = signal(Date.now());
  private refreshInterval?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.loadComments();

    this.refreshInterval = setInterval(() => {
      this.currentTime.set(Date.now());
    }, 60000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  formatCommentDate(date: string): string {
    const commentTimestamp = new Date(date).getTime();

    if (isNaN(commentTimestamp)) {
      return '';
    }

    const diffInSeconds = Math.floor(
      (this.currentTime() - commentTimestamp) / 1000,
    );

    if (diffInSeconds < 0 || diffInSeconds < 60) {
      return 'Just now';
    }

    const minutes = Math.floor(diffInSeconds / 60);

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(diffInSeconds / 3600);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(diffInSeconds / 86400);

    if (days < 7) {
      return `${days}d ago`;
    }

    const weeks = Math.floor(days / 7);

    if (weeks < 4) {
      return `${weeks}w ago`;
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  }

  loadComments(): void {
    const page = this.nextPage();

    if (page === null || this.isLoadingComments()) {
      return;
    }

    this.isLoadingComments.set(true);
    this.commentsError.set(null);

    this.commentsService
      .getPostComments(this.postId(), page, this.pageLimit)
      .pipe(
        finalize(() => this.isLoadingComments.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.comments.update((currentComments) => {
            const existingIds = new Set(
              currentComments.map((comment) => comment._id),
            );

            const newComments = response.data.comments.filter(
              (comment) => !existingIds.has(comment._id),
            );

            return [...currentComments, ...newComments];
          });

          const pagination = response.meta.pagination;

          this.totalComments.set(pagination.total);

          this.nextPage.set(
            pagination.currentPage < pagination.numberOfPages
              ? pagination.currentPage + 1
              : null,
          );
        },

        error: (error) => {
          this.commentsError.set(
            error?.error?.message ||
            error?.error?.errors ||
            'Unable to load comments. Please try again.',
          );

          console.error('Failed to load post comments:', error);
        },
      });
  }

  retry(): void {
    this.loadComments();
  }

  onCommentCreated(
    comment: CreateCommentResponse['data']['comment'],
  ): void {
    this.comments.update((currentComments) => [
      { ...comment, repliesCount: 0 },
      ...currentComments,
    ]);

    this.totalComments.update((total) => total + 1);
  }
}
