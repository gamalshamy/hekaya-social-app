import { Component, input } from '@angular/core';

@Component({
  selector: 'app-auth-error-alert',
  imports: [],
  templateUrl: './auth-error-alert.component.html',
  styleUrl: './auth-error-alert.component.css',
})
export class AuthErrorAlertComponent {
  readonly title = input<string>('Error:');
  readonly message = input.required<string>();
}
