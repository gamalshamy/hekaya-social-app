import { Component, input, signal } from '@angular/core';
import { PostComment } from '../../models/post.interface';
import { DecimalPipe } from '@angular/common';
import { PostEngagementHeaderComponent } from '../post-engagement-header/post-engagement-header.component';
import { PostCommentsComponent } from '../../comments/components/post-comments/post-comments.component';

@Component({
  selector: 'app-top-comment',
  imports: [DecimalPipe, PostCommentsComponent],
  templateUrl: './top-comment.component.html',
  styleUrl: './top-comment.component.css',
})
export class TopCommentComponent {
  readonly comment = input.required<PostComment>();
  readonly commentsCount = input.required<number>();
  readonly postId = input.required<string>();

  readonly showEngagement = signal(false);
  readonly engagementTitle = signal('');

  openPostEngagement(title: string): void {
    this.showEngagement.set(!this.showEngagement());
    this.engagementTitle.set(title)
  }
}
