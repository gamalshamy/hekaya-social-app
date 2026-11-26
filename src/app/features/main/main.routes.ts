import { Routes } from "@angular/router";

export const MAIN_ROUTES: Routes = [
    {
        path: "",
        redirectTo: "timeline",
        pathMatch: "full"
    },
    {
        path: 'timeline',
        loadComponent: () => import('./pages/timeline/timeline.component').then((c) => c.TimelineComponent),
        title: 'timeline'
    }
]