import { Component, inject, input, output, signal } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Post } from '../../models/post.interface';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-share-dialog',
  imports: [DecimalPipe],
  templateUrl: './share-dialog.component.html',
  styleUrl: './share-dialog.component.css',
})
export class ShareDialogComponent {
  private readonly postsService = inject(PostsService);
  private readonly authService = inject(AuthService);

  readonly post = input.required<Post>();

  readonly shared = output<Post>();
  readonly closed = output<void>();

  readonly currentUser = this.authService.currentUser;

  readonly shareBody = signal('');
  readonly isSharing = signal(false);
  readonly shareError = signal<string | null>(null);

  onShareBodyChange(value: string): void {
    this.shareBody.set(value);
  }

  close(): void {
    if (this.isSharing()) {
      return;
    }

    this.closed.emit();
  }

  submitShare(): void {
    if (this.isSharing()) {
      return;
    }

    const body = this.shareBody().trim() || ' ';

    this.isSharing.set(true);
    this.shareError.set(null);

    this.postsService.sharePost(this.post()._id, body).subscribe({
      next: (response) => {
        this.isSharing.set(false);
        this.shared.emit(response.data.post as Post);
      },

      error: (error) => {
        this.isSharing.set(false);

        this.shareError.set(
          error?.error?.message ||
          error?.error?.errors ||
          'Unable to share this post. Please try again.',
        );
      },
    });
  }
}
