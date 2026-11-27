import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, input, linkedSignal, OnDestroy, OnInit, output, signal } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Post } from '../../models/post.interface';
import { PostsService } from '../../services/posts.service';
import { SharedPostComponent } from '../shared-post/shared-post.component';
import { TopCommentComponent } from '../top-comment/top-comment.component';
import { ShareDialogComponent } from '../share-dialog/share-dialog.component';

@Component({
  selector: 'app-post-card',
  imports: [DatePipe, DecimalPipe, TopCommentComponent, SharedPostComponent, ShareDialogComponent],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCardComponent implements OnInit, OnDestroy {
  readonly post = input.required<Post>();

  private readonly authService = inject(AuthService);
  private readonly postsService = inject(PostsService);

  readonly actionError = signal<string | null>(null);

  readonly isLiking = signal(false);
  // readonly likeError = signal<string | null>(null);

  readonly likeState = linkedSignal(() => {
    const post = this.post();
    const userId = this.authService.getCurrentUserId();

    return {
      isLiked: !!userId && post.likes.includes(userId),
      likesCount: post.likesCount,
    };
  });

  readonly isBookmarking = signal(false);
  // readonly bookmarkError = signal<string | null>(null);

  readonly bookmarkState = linkedSignal(() => this.post().bookmarked);

  //delete post
  readonly showPostMenu = signal(false);
  readonly showDeleteConfirmation = signal(false);
  readonly isDeleting = signal(false);
  readonly deleteError = signal<string | null>(null);

  readonly postDeleted = output<string>();

  readonly isPostOwner = computed(() => {
    const userId = this.authService.getCurrentUserId();

    return !!userId && this.post().user._id === userId;
  });

  // share post
  readonly showShareDialog = signal(false);
  readonly postShared = output<Post>();

  // Current time
  readonly currentTime = signal(Date.now());

  private refreshInterval?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.refreshInterval = setInterval(() => {
      this.currentTime.set(Date.now());
    }, 60_000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }


  formatPostDate(date: string): string {
    const postTimestamp = new Date(date).getTime();
    const diffInSeconds = Math.floor(
      (this.currentTime() - postTimestamp) / 1000
    );

    if (isNaN(postTimestamp)) return '';

    if (diffInSeconds < 0) return 'Just now';
    if (diffInSeconds < 60) return 'Just now';

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(diffInSeconds / 3600);
    if (hours < 24) return `${hours}h`;

    const days = Math.floor(diffInSeconds / 86400);
    if (days < 30) return `${days}d`;

    return new DatePipe('en-US').transform(date, 'MMM d, y') ?? '';
  }

  toggleLike(): void {
    if (this.isLiking()) {
      return;
    }

    const userId = this.authService.getCurrentUserId();

    if (!userId) {
      this.actionError.set('Please sign in to like this post.');
      return;
    }

    const post = this.post();
    const previousState = this.likeState();

    const nextLikedState = !previousState.isLiked;

    this.likeState.set({
      isLiked: nextLikedState,
      likesCount: Math.max(
        0,
        previousState.likesCount + (nextLikedState ? 1 : -1),
      ),
    });

    this.actionError.set(null);

    if (!navigator.onLine) {
      this.actionError.set('You are offline. Your reaction was not saved.');
      return;
    }

    this.isLiking.set(true);

    this.postsService.likePost(post._id).subscribe({
      next: (response) => {
        this.likeState.set({
          isLiked: response.data.liked,
          likesCount: response.data.likesCount,
        });

        this.isLiking.set(false);
      },

      error: (error) => {
        this.likeState.set(previousState);

        this.actionError.set(
          error?.error?.message ||
          error?.error?.errors ||
          'Unable to update your reaction. Please try again.',
        );

        this.isLiking.set(false);
      },
    });
  }

  toggleBookmark(): void {
    if (this.isBookmarking()) {
      return;
    }

    const post = this.post();
    const previousState = this.bookmarkState();
    const nextState = !previousState;

    this.bookmarkState.set(nextState);

    this.actionError.set(null);
    this.isBookmarking.set(true);

    this.postsService.bookmarkPost(post._id).subscribe({
      next: (response) => {
        this.bookmarkState.set(response.data.bookmarked);
        this.isBookmarking.set(false);
      },

      error: (error) => {
        this.bookmarkState.set(previousState);

        this.actionError.set(
          error?.error?.message ||
          error?.error?.errors ||
          'Unable to update bookmark. Please try again.',
        );

        this.isBookmarking.set(false);
      },
    });
  }

  // 3 dots [delete post, ....]
  togglePostMenu(): void {
    this.showPostMenu.update((value) => !value);
  }

  openDeleteConfirmation(): void {
    this.showPostMenu.set(false);
    this.deleteError.set(null);
    this.showDeleteConfirmation.set(true);
  }

  closeDeleteConfirmation(): void {
    if (this.isDeleting()) {
      return;
    }

    this.showDeleteConfirmation.set(false);
    this.deleteError.set(null);
  }

  confirmDeletePost(): void {
    if (this.isDeleting() || !this.isPostOwner()) {
      return;
    }

    this.isDeleting.set(true);
    this.deleteError.set(null);

    this.postsService.deletePost(this.post()._id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.showDeleteConfirmation.set(false);

        // Notify Timeline => that the post was deleted
        this.postDeleted.emit(this.post()._id);
      },

      error: (error) => {
        this.isDeleting.set(false);

        this.deleteError.set(
          error?.error?.message ||
          error?.error?.errors ||
          'Unable to delete this post. Please try again.',
        );
      },
    });
  }

  openShareDialog(): void {
    this.showShareDialog.set(true);
  }

  closeShareDialog(): void {
    this.showShareDialog.set(false);
  }

  onPostShared(sharedPost: Post): void {
    this.postShared.emit(sharedPost);
    this.showShareDialog.set(false);
  }
}
