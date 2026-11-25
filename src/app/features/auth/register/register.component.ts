import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { SuccessComponent } from '../components/success/success.component';
import { SoundService } from '../../../core/services/sound.service';
import { AuthErrorAlertComponent } from '../components/auth-error-alert/auth-error-alert.component';
import { AuthShowcaseComponent } from '../components/auth-showcase/auth-showcase.component';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, SuccessComponent, AuthErrorAlertComponent, AuthShowcaseComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly soundService = inject(SoundService);

  // UI Signals
  readonly showPassword = signal(false);
  readonly showRePassword = signal(false);
  readonly success = signal(false);

  readonly apiError = this.authService.signupError;
  readonly isSubmitting = this.authService.isSigningUp;

  readonly genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ] as const;

  private readonly passwordMatchValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const rePassword = control.get('rePassword')?.value;

    if (!password || !rePassword) {
      return null;
    }

    return password === rePassword
      ? null
      : { passwordMismatch: true };
  };

  readonly signupForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],

      username: ['', [Validators.required, Validators.minLength(3)]],

      email: ['', [Validators.required, Validators.email]],

      dateOfBirth: ['', Validators.required],

      gender: ['', Validators.required],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).+$/
          ),
        ],
      ],

      rePassword: ['', Validators.required],
    },
    {
      validators: this.passwordMatchValidator,
    },
  );

  // Check Invalid Control
  isInvalid(controlName: string): boolean {
    const control = this.signupForm.get(controlName);

    return !!control && control.invalid && control.touched;
  }

  getErrorText(controlName: string): string | null {
    const control = this.signupForm.get(controlName);

    if (!control || !control.touched || !control.errors) {
      if (
        controlName === 'rePassword' &&
        this.signupForm.hasError('passwordMismatch') &&
        this.signupForm.controls.rePassword.touched
      ) {
        return 'Passwords do not match.';
      }

      return null;
    }

    if (control.hasError('required')) {
      const messages: Record<string, string> = {
        name: 'Full name is required.',
        username: 'Username is required.',
        email: 'Email address is required.',
        dateOfBirth: 'Date of birth is required.',
        gender: 'Please select your gender.',
        password: 'Password is required.',
        rePassword: 'Please confirm your password.',
      };

      return messages[controlName] ?? 'This field is required.';
    }

    if (control.hasError('minlength')) {
      if (controlName === 'name')
        return 'Name must be at least 3 characters.'
      else if (controlName === 'username')
        return 'Username must be at least 3 characters.'
      else if (controlName === 'password')
        return 'Password must be at least 8 characters.'
    }

    if (control.hasError('pattern') && controlName === 'password') {
      return 'Password must contain uppercase, lowercase, number, and special character.';
    }

    if (control.hasError('email')) {
      return 'Please enter a valid email address.';
    }

    return null;
  }


  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  toggleRePasswordVisibility(): void {
    this.showRePassword.update((value) => !value);
  }

  onButtonClick(): void {
    this.soundService.playClick();
  }

  onSubmit(): void {
    this.success.set(false);

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.authService.signup(this.signupForm.getRawValue()).subscribe({
      next: () => {
        this.success.set(true);
        this.soundService.playSuccess();

        this.signupForm.reset();
        this.showPassword.set(false);
        this.showRePassword.set(false);

        setTimeout(
          () => {
            this.router.navigate(['/timeline']);
          }, 1000);
      },

      error: () => {
        this.soundService.playError();
        //======== API error is handled by AuthService ========//
      },
    });
  }
}
