import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SignupRequest, SignupResponse } from '../models/signup.interface';
import { SigninRequest, SigninResponse } from '../models/signin.interface';
import { ChangePasswordRequest } from '../models/change-password.interface';
import { ApiError } from '../../../shared/models/api-error.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.baseUrl;
  private readonly TOKEN_KEY = 'token';
  private readonly router = inject(Router);

  // Loading Signals
  private readonly _isSigningUp = signal<boolean>(false);
  private readonly _isSigningIn = signal<boolean>(false);
  private readonly _isChangingPassword = signal<boolean>(false);

  // Error Signals
  private readonly _signupError = signal<string | null>(null);
  private readonly _signinError = signal<string | null>(null);
  private readonly _changePasswordError = signal<string | null>(null);

  // Public Readonly Signals
  readonly isSigningUp = this._isSigningUp.asReadonly();
  readonly isSigningIn = this._isSigningIn.asReadonly();
  readonly isChangingPassword = this._isChangingPassword.asReadonly();

  readonly signupError = this._signupError.asReadonly();
  readonly signinError = this._signinError.asReadonly();
  readonly changePasswordError = this._changePasswordError.asReadonly();

  // Extract API Error Message
  private getErrorMessage(error: HttpErrorResponse): string {
    const apiError = error.error as Partial<ApiError> | null;

    if (apiError) {
      if (typeof apiError.message === 'string' && apiError.message.trim()) {
        return apiError.message.trim();
      }
      if (typeof apiError.errors === 'string' && apiError.errors.trim()) {
        return apiError.errors.trim();
      }
    }

    return 'Something went wrong. Please try again.';
  }

  signup(data: SignupRequest): Observable<SignupResponse> {
    this._isSigningUp.set(true);
    this._signupError.set(null);

    return this.http.post<SignupResponse>(`${this.apiUrl}/users/signup`, data)
      .pipe(
        tap((response) => {
          this.saveToken(response.data.token);
        }),
        catchError((error: HttpErrorResponse) => {
          this._signupError.set(this.getErrorMessage(error));
          return throwError(() => error);
        }),
        finalize(() => this._isSigningUp.set(false))
      );
  }

  signin(data: SigninRequest): Observable<SigninResponse> {
    this._isSigningIn.set(true);
    this._signinError.set(null);

    return this.http.post<SigninResponse>(`${this.apiUrl}/users/signin`, data)
      .pipe(
        tap((response) => {
          this.saveToken(response.data.token);
        }),
        catchError((error: HttpErrorResponse) => {
          this._signinError.set(this.getErrorMessage(error));
          return throwError(() => error);
        }),
        finalize(() => this._isSigningIn.set(false))
      );
  }

  changePassword(data: ChangePasswordRequest): Observable<unknown> {
    this._isChangingPassword.set(true);
    this._changePasswordError.set(null);

    return this.http.patch(`${this.apiUrl}/users/change-password`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this._changePasswordError.set(this.getErrorMessage(error));
          return throwError(() => error);
        }),
        finalize(() => this._isChangingPassword.set(false))
      );
  }

  private saveToken(token: string): void {
    if (typeof window != 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (typeof window != 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  logout(): void {
    if (typeof window != 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }

    this.router.navigate(['/login']);
  }
}
