import { Component, input } from '@angular/core';
import { PostComment } from '../../models/post.interface';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-top-comment',
  imports: [DecimalPipe],
  templateUrl: './top-comment.component.html',
  styleUrl: './top-comment.component.css',
})
export class TopCommentComponent {
  readonly comment = input.required<PostComment>();
  readonly commentsCount = input.required<number>();
}
