import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { Post } from '../../models/post.interface';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-single-post',
  imports: [PostCardComponent],
  templateUrl: './single-post.component.html',
  styleUrl: './single-post.component.css',
})
export class SinglePostComponent {
  readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly postsService = inject(PostsService);

  readonly post = signal<Post | null>(null);

  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('postId');

    if (!postId) {
      this.error.set('Post not found.');
      return;
    }

    this.loadPost(postId);
  }

  loadPost(postId: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.postsService
      .getPostById(postId)
      .pipe(
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.post.set(response.data.post);
        },

        error: (error) => {
          this.error.set(
            error?.error?.message ||
            error?.error?.errors ||
            'Unable to load this post. Please try again.',
          );
        },
      });
  }

  goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/']);
    }
  }

}
