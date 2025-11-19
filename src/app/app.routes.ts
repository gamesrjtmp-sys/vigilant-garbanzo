import { Routes } from '@angular/router';

export const routes: Routes = [

    { path: '', redirectTo: 'producto', pathMatch: 'full' },
    {
        path: 'producto',
        loadComponent: () =>
        import('./features/producto/producto/producto.component')
        .then(m => m.ProductoComponent)
    },
];
    