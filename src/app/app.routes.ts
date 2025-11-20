import { Routes } from '@angular/router';

export const routes: Routes = [


    // 1. Redirección inicial: Manda al usuario al CATÁLOGO (Lista)
    { path: '', redirectTo: 'catalogo', pathMatch: 'full' },

    // 2. Ruta del Catálogo (Lista de productos) - NO pide ID
    {
        path: 'catalogo',
        loadComponent: () => import('./features/catalogo/catalogo/catalogo.component')
            .then(m => m.CatalogoComponent)
    },

    // 3. Ruta del Detalle (Producto único) - SÍ pide ID
    {
        path: 'producto/:id', 
        loadComponent: () => import('./features/producto/producto/producto.component')
            .then(m => m.ProductoComponent)
    }
];
    