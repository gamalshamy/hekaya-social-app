import { Routes } from "@angular/router";

export const MAIN_ROUTES: Routes = [
    {
        path: "",
        redirectTo: "timeline",
        pathMatch: "full"
    },
    {
        path: 'timeline',
        loadComponent: () => import('./timeline/timeline.component').then((c) => c.TimelineComponent),
        title: 'timeline'
    }
]