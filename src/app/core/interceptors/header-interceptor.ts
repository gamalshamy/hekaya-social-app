import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/services/auth.service';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {

  const authRoutes = ['/users/signin', '/users/signup'];

  if (authRoutes.some((route) => req.url.includes(route))) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.getToken();

  if (!token) {
    return next(req);
  }

  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });



  return next(req);
};
