import { DecimalPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-timeline-header',
  imports: [DecimalPipe],
  templateUrl: './timeline-header.component.html',
  styleUrl: './timeline-header.component.css',
})
export class TimelineHeaderComponent {
  readonly isLoading = input.required<boolean>();
  readonly totalPosts = input<number | null>(null);

  readonly refresh = output<void>();

  onRefresh(): void {
    if (!this.isLoading()) {
      this.refresh.emit();
    }
  }
}
