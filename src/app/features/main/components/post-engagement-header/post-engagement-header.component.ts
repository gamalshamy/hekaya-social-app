import { Component, computed, input, output, signal } from '@angular/core';
import { PostLikesComponent } from '../post-likes/post-likes.component';

@Component({
  selector: 'app-post-engagement-header',
  imports: [PostLikesComponent],
  templateUrl: './post-engagement-header.component.html',
  styleUrl: './post-engagement-header.component.css',
})
export class PostEngagementHeaderComponent {
  readonly postId = input.required<string>();
  readonly getTitle = input('comments');
  title = signal('')

  readonly isLiked = input(false);
  readonly likesCount = input(0);
  readonly commentsCount = input(0);

  readonly closed = output<void>();
  readonly likeToggled = output<boolean>();

  ngOnInit(): void {
    this.title.set(this.getTitle())
  }

  showComments() {
    this.title.set('comments')
  }

  showLoves() {
    this.title.set('loves')
  }


  toggleLike(): void {
    this.likeToggled.emit(!this.isLiked());
  }

  close(): void {
    this.closed.emit();
  }
}
