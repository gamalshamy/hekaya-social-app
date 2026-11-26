import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-post-error',
  imports: [],
  templateUrl: './post-error.component.html',
  styleUrl: './post-error.component.css',
})
export class PostErrorComponent {
  readonly message = input.required<string>();
  readonly isRetrying = input<boolean>(false);
  readonly retry = output<void>();
}
