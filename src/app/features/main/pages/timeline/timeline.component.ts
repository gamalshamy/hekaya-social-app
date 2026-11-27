import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { PostErrorComponent } from '../../components/post-error/post-error.component';
import { SkeletonPostComponent } from '../../components/skeleton-post/skeleton-post.component';
import { TimelineHeaderComponent } from '../../components/timeline-header/timeline-header.component';
import { Post } from '../../models/post.interface';
import { PostsPagination } from '../../models/posts-response.interface';
import { PostsService } from '../../services/posts.service';
import { CreatePostComponent } from '../../components/create-post/create-post.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-timeline',
  imports: [PostErrorComponent, SkeletonPostComponent, EmptyStateComponent, PostCardComponent, TimelineHeaderComponent, CreatePostComponent, InfiniteScrollDirective],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css',
})
export class TimelineComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  readonly posts = signal<Post[]>([]);
  readonly pagination = signal<PostsPagination | null>(null);

  readonly isLoading = this.postsService.isLoadingPosts;
  readonly error = this.postsService.postsError;

  readonly hasMorePosts = computed(() => {
    return this.pagination()?.nextPage != null;
  });

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    if (this.isLoading()) {
      return;
    }

    this.postsService.getAllPosts(1).subscribe({
      next: (response) => {
        this.posts.set(response.data.posts);
        this.pagination.set(response.meta.pagination);
      },
      error: (error) => {
        console.error('Failed to load posts:', error);
      },
    });
  }

  loadMorePosts(): void {
    const nextPage = this.pagination()?.nextPage;

    if (!nextPage || this.isLoading()) {
      return;
    }

    this.postsService.getAllPosts(nextPage).subscribe({
      next: (response) => {
        this.posts.update((currentPosts) => {
          const existingIds = new Set(
            currentPosts.map((post) => post._id),
          );

          const newPosts = response.data.posts.filter(
            (post) => !existingIds.has(post._id),
          );

          return [...currentPosts, ...newPosts];
        });

        this.pagination.set(response.meta.pagination);
      },
      error: (error) => {
        console.error('Failed to load more posts:', error);
      },
    });
  }

  refreshPosts(): void {
    if (!this.isLoading()) {
      this.loadPosts();
    }
  }

  onPostDeleted(postId: string): void {
    this.posts.update((currentPosts) =>
      currentPosts.filter((post) => post._id !== postId),
    );

    this.pagination.update((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        total: Math.max(0, current.total - 1),
      };
    });
  }

  onPostShared(sharedPost: Post): void {
    this.posts.update((currentPosts) => [
      sharedPost,
      ...currentPosts.filter((post) => post._id !== sharedPost._id),
    ]);

    this.pagination.update((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        total: current.total + 1,
      };
    });
  }
}
