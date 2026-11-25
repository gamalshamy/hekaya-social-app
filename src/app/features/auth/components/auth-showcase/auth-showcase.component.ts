import { Component, input } from '@angular/core';

@Component({
  selector: 'app-auth-showcase',
  imports: [],
  templateUrl: './auth-showcase.component.html',
  styleUrl: './auth-showcase.component.css',
})
export class AuthShowcaseComponent {
  readonly badgeText = input<string>('Welcome back to hekaya');
}
