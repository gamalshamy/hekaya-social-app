import { Component, computed, input, output, signal } from '@angular/core';
import { PostLikesComponent } from '../post-likes/post-likes.component';

export type EngagementSection = 'loves' | 'comments';

@Component({
  selector: 'app-post-engagement-header',
  imports: [PostLikesComponent],
  templateUrl: './post-engagement-header.component.html',
  styleUrl: './post-engagement-header.component.css',
})
export class PostEngagementHeaderComponent {
  readonly postId = input.required<string>();

  readonly isLiked = input(false);
  readonly likesCount = input(0);
  readonly commentsCount = input(0);

  readonly closed = output<void>();
  readonly likeToggled = output<boolean>();

  readonly activeSection = signal<EngagementSection>('loves');

  readonly title = computed(() =>
    this.activeSection() === 'loves' ? 'Loves' : 'Comments',
  );

  selectSection(section: EngagementSection): void {
    this.activeSection.set(section);
  }

  toggleLike(): void {
    this.likeToggled.emit(!this.isLiked());
  }

  close(): void {
    this.closed.emit();
  }
}
