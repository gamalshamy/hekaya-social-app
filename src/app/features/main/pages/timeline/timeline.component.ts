import { Component, inject, OnInit, signal } from '@angular/core';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { PostErrorComponent } from '../../components/post-error/post-error.component';
import { SkeletonPostComponent } from '../../components/skeleton-post/skeleton-post.component';
import { TimelineHeaderComponent } from '../../components/timeline-header/timeline-header.component';
import { Post } from '../../models/post.interface';
import { PostsPagination } from '../../models/posts-response.interface';
import { PostsService } from '../../services/posts.service';
import { CreatePostComponent } from '../../components/create-post/create-post.component';

@Component({
  selector: 'app-timeline',
  imports: [PostErrorComponent, SkeletonPostComponent, EmptyStateComponent, PostCardComponent, TimelineHeaderComponent, CreatePostComponent],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css',
})
export class TimelineComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  readonly posts = signal<Post[]>([]);
  readonly pagination = signal<PostsPagination | null>(null);

  readonly isLoading = this.postsService.isLoadingPosts;
  readonly error = this.postsService.postsError;

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postsService.getAllPosts().subscribe({
      next: (response) => {
        this.posts.set(response.data.posts);
        this.pagination.set(response.meta.pagination);
      },
      error: (error) => {
        console.error('Failed to load posts:', error);
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
}
