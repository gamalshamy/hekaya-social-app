import { Component, computed, DestroyRef, inject, output, signal } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-create-post',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent {
  private readonly postsService = inject(PostsService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly MAX_BODY_LENGTH = 5000;
  private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024;

  private readonly ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ];

  readonly body = signal('');
  readonly selectedImage = signal<File | null>(null);
  readonly imagePreview = signal<string | null>(null);

  readonly imageError = signal<string | null>(null);
  readonly isDragging = signal(false);

  readonly isCreatingPost = this.postsService.isCreatingPost;
  readonly createPostError = this.postsService.createPostError;

  readonly postCreated = output<void>();

  readonly characterCount = computed(() => this.body().length);

  readonly canCreatePost = computed(() => {
    return (
      !!this.body().trim() ||
      this.selectedImage() !== null
    );
  });

  readonly isBodyNearLimit = computed(() => {
    return this.characterCount() >= this.MAX_BODY_LENGTH * 0.9;
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.clearImagePreview();
    });
  }

  onBodyChange(value: string): void {
    this.body.set(value);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.handleImage(file);
    }

    input.value = '';
  }

  handleImage(file: File): void {
    this.imageError.set(null);

    if (!this.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      this.imageError.set(
        'Unsupported image format. Please use JPG, PNG, WEBP or GIF.',
      );
      return;
    }

    if (file.size > this.MAX_IMAGE_SIZE) {
      this.imageError.set('Image size must not exceed 5 MB.');
      return;
    }

    this.clearImagePreview();

    this.selectedImage.set(file);
    this.imagePreview.set(URL.createObjectURL(file));
  }

  removeImage(): void {
    this.clearImagePreview();
    this.selectedImage.set(null);
    this.imageError.set(null);
  }

  private clearImagePreview(): void {
    const currentPreview = this.imagePreview();

    if (currentPreview) {
      URL.revokeObjectURL(currentPreview);
      this.imagePreview.set(null);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();

    const currentTarget = event.currentTarget as HTMLElement;
    const relatedTarget = event.relatedTarget as Node | null;

    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
      this.isDragging.set(false);
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);

    const file = event.dataTransfer?.files?.[0];

    if (file) {
      this.handleImage(file);
    }
  }

  submitPost(): void {
    if (!this.canCreatePost() || this.isCreatingPost()) {
      return;
    }

    const formData = new FormData();

    const body = this.body().trim();
    const image = this.selectedImage();

    if (body) {
      formData.append('body', body);
    }

    if (image) {
      formData.append('image', image);
    }

    this.postsService.createPost(formData).subscribe({
      next: () => {
        this.body.set('');
        this.selectedImage.set(null);
        this.imageError.set(null);

        this.clearImagePreview();

        this.postCreated.emit();
      },
      error: (error) => {
        console.error('Failed to create post:', error);
      },
    });
  }
}
