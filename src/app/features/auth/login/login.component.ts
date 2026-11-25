import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { SoundService } from '../../../core/services/sound.service';
import { SuccessComponent } from '../components/success/success.component';
import { Router, RouterLink } from '@angular/router';
import { AuthErrorAlertComponent } from '../components/auth-error-alert/auth-error-alert.component';
import { AuthShowcaseComponent } from '../components/auth-showcase/auth-showcase.component';

@Component({
  selector: 'app-login',
  imports: [SuccessComponent, ReactiveFormsModule, RouterLink, AuthErrorAlertComponent, AuthShowcaseComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly soundService = inject(SoundService);

  readonly showPassword = signal(false);
  readonly success = signal(false);

  readonly apiError = this.authService.signinError;
  readonly isSubmitting = this.authService.isSigningIn;

  readonly signinForm = this.fb.nonNullable.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  isInvalid(controlName: string): boolean {
    const control = this.signinForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  getErrorText(controlName: string): string | null {
    const control = this.signinForm.get(controlName);

    if (!control || !control.touched || !control.errors) {
      return null;
    }

    if (control.hasError('required')) {
      const messages: Record<string, string> = {
        email: 'Email or username is required.',
        password: 'Password is required.',
      };

      return messages[controlName] ?? 'This field is required.';
    }

    return null;
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  onButtonClick(): void {
    this.soundService.playClick();
  }

  onSubmit(): void {
    this.success.set(false);

    if (this.signinForm.invalid) {
      this.signinForm.markAllAsTouched();
      return;
    }

    this.authService.signin(this.signinForm.getRawValue()).subscribe({
      next: (response) => {
        // localStorage.setItem('token', response.data.token);

        this.success.set(true);
        this.soundService.playSuccess();

        this.signinForm.reset();
        this.showPassword.set(false);

        setTimeout(
          () => {
            this.router.navigate(['/timeline']);
          }, 1000);
      },
      error: () => {
        this.soundService.playError();
      },
    });
  }
}
