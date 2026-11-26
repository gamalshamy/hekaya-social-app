import { Component, input, OnDestroy, OnInit, signal } from '@angular/core';
import { Post } from '../../models/post.interface';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TopCommentComponent } from '../top-comment/top-comment.component';
import { SharedPostComponent } from '../shared-post/shared-post.component';

@Component({
  selector: 'app-post-card',
  imports: [DatePipe, DecimalPipe, TopCommentComponent, SharedPostComponent],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css',
})
export class PostCardComponent implements OnInit, OnDestroy {
  readonly post = input.required<Post>();

  // Current time
  readonly currentTime = signal(Date.now());

  private refreshInterval?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.refreshInterval = setInterval(() => {
      this.currentTime.set(Date.now());
    }, 60_000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }


  formatPostDate(date: string): string {
    const postTimestamp = new Date(date).getTime();
    const diffInSeconds = Math.floor(
      (this.currentTime() - postTimestamp) / 1000
    );

    if (isNaN(postTimestamp)) return '';

    if (diffInSeconds < 0) return 'Just now';
    if (diffInSeconds < 60) return 'Just now';

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(diffInSeconds / 3600);
    if (hours < 24) return `${hours}h`;

    const days = Math.floor(diffInSeconds / 86400);
    if (days < 30) return `${days}d`;

    return new DatePipe('en-US').transform(date, 'MMM d, y') ?? '';
  }
}
