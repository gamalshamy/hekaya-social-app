import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AUTH_ROUTES } from './features/auth/auth.routes';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { MAIN_ROUTES } from './features/main/main.routes';

export const routes: Routes = [
    // {
    //     path:'', redirectTo'', pathMatch:'full'
    // },
    {
        path: '',
        component: AuthLayoutComponent,
        children: AUTH_ROUTES
    },
    {
        path: '',
        component: MainLayoutComponent,
        children: MAIN_ROUTES
    },
    {
        path: '**',
        loadComponent: () => import('./shared/components/not-found/not-found.component').then((c) => c.NotFoundComponent)
    }
];
