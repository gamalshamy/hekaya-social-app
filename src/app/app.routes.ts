import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AUTH_ROUTES } from './features/auth/auth.routes';

export const routes: Routes = [
    // {
    //     path:'', redirectTo'', pathMatch:'full'
    // },
    {
        path: 'auth', component: AuthLayoutComponent,
        children: AUTH_ROUTES
    },
    {
        path: '**',
        loadComponent: () => import('./shared/components/not-found/not-found.component').then((c) => c.NotFoundComponent)
    }
];
