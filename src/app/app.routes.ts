import { Routes } from '@angular/router';

export const routes: Routes = [

    { path: '', redirectTo: 'inicio', pathMatch: 'full' },

    {
        path: 'inicio',
        loadComponent: () => import('./features/inicio/inicio/inicio.component')
            .then(m => m.InicioComponent)
    },

    {
        path: 'catalogo',
        loadComponent: () => import('./features/catalogo/catalogo/catalogo.component')
            .then(m => m.CatalogoComponent)
    },

    {
        path: 'producto/:id', 
        loadComponent: () => import('./features/producto/producto/producto.component')
            .then(m => m.ProductoComponent)
    },

    {
        path: 'carrito', 
        loadComponent: () => import('./features/carrito/carrito/carrito.component')
            .then(m => m.CarritoComponent)
    },

    {
        path: 'checkout', 
        loadComponent: () => import('./features/checkout/checkout/checkout.component')
            .then(m => m.CheckoutComponent)
    },

    {
        path: 'catalogo-comun', 
        loadComponent: () => import('./shared/components/catalogo-comun/catalogo-comun/catalogo-comun.component')
            .then(m => m.CatalogoComunComponent)
    }
];
    