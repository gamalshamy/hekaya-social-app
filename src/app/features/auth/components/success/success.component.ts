import { Component, input } from '@angular/core';

@Component({
  selector: 'app-success',
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css',
})
export class SuccessComponent {
  readonly message = input.required<string>();
}
