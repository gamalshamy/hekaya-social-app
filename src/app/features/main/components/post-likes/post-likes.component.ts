import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { PostLikeUser } from '../../models/post-likes.interface';
import { PostsService } from '../../services/posts.service';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-post-likes',
  imports: [InfiniteScrollDirective],
  templateUrl: './post-likes.component.html',
  styleUrl: './post-likes.component.css',
})
export class PostLikesComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  readonly postId = input.required<string>();

  readonly users = signal<PostLikeUser[]>([]);
  readonly totalLikes = signal(0);
  readonly nextPage = signal<number | null>(1);

  readonly isLoadingLikes = signal(false);
  readonly likesError = signal<string | null>(null);

  private readonly pageLimit = 20;

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes(): void {
    const page = this.nextPage();

    if (page === null || this.isLoadingLikes()) {
      return;
    }

    this.isLoadingLikes.set(true);
    this.likesError.set(null);

    this.postsService
      .getPostLikes(this.postId(), page, this.pageLimit)
      .pipe(
        finalize(() => this.isLoadingLikes.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.users.update((currentUsers) => {
            const existingIds = new Set(
              currentUsers.map((user) => user._id),
            );

            const newUsers = response.data.likes.filter(
              (user) => !existingIds.has(user._id),
            );

            return [...currentUsers, ...newUsers];
          });

          const pagination = response.meta.pagination;

          this.totalLikes.set(pagination.total);

          this.nextPage.set(
            pagination.currentPage < pagination.numberOfPages
              ? pagination.currentPage + 1
              : null,
          );
        },

        error: (error) => {
          this.likesError.set(
            error?.message || 'Unable to load likes. Please try again.',
          );

          console.error('Failed to load post likes:', error);
        },
      });
  }
}
