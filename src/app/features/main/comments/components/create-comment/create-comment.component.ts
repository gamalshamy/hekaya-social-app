import { Component, inject, input, output, signal } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { CreateCommentResponse } from '../../models/create-comment-response.interface';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-create-comment',
  imports: [],
  templateUrl: './create-comment.component.html',
  styleUrl: './create-comment.component.css',
})
export class CreateCommentComponent {
  private readonly commentsService = inject(CommentsService);

  readonly postId = input.required<string>();

  readonly commentCreated = output<CreateCommentResponse['data']['comment']>();

  readonly commentContent = signal('');
  readonly selectedImage = signal<File | null>(null);
  readonly imagePreview = signal<string | null>(null);

  readonly isSubmitting = signal(false);
  readonly commentError = signal<string | null>(null);

  ngOnDestroy(): void {
    this.clearImagePreview();
  }

  onImageSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.commentError.set('Please select a valid image.');
      inputElement.value = '';
      return;
    }

    this.clearImagePreview();

    this.selectedImage.set(file);
    this.imagePreview.set(URL.createObjectURL(file));
    this.commentError.set(null);
  }

  removeImage(inputElement: HTMLInputElement): void {
    this.clearImagePreview();
    this.selectedImage.set(null);
    inputElement.value = '';
  }

  private clearImagePreview(): void {
    const preview = this.imagePreview();

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    this.imagePreview.set(null);
  }

  createComment(event: Event, inputElement: HTMLInputElement): void {
    event.preventDefault();

    const content = this.commentContent().trim();
    const image = this.selectedImage();

    if (!content && !image) {
      this.commentError.set('Write a comment or select an image.');
      return;
    }

    if (this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.commentError.set(null);

    this.commentsService
      .createComment(this.postId(), content, image)
      .pipe(
        finalize(() => this.isSubmitting.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.commentCreated.emit(response.data.comment);

          this.commentContent.set('');
          this.selectedImage.set(null);
          this.clearImagePreview();

          inputElement.value = '';
        },

        error: (error) => {
          this.commentError.set(
            error?.error?.message ||
            error?.error?.errors ||
            'Unable to create comment. Please try again.',
          );

          console.error('Failed to create comment:', error);
        },
      });
  }
}
