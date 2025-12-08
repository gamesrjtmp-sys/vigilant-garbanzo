import { Routes } from '@angular/router';
import { LegalComponent } from './features/legal/legal/legal.component';
import { EnvioPoliticaComponent } from './features/legal/pages/envio-politica/envio-politica/envio-politica.component';
import { DevolucionPoliticaComponent } from './features/legal/pages/devolucion-politica/devolucion-politica/devolucion-politica.component';
import { PrivacidadPoliticaComponent } from './features/legal/pages/privacidad-politica/privacidad-politica/privacidad-politica.component';
import { LibroReclamacionesComponent } from './features/legal/pages/libro-reclamaciones/libro-reclamaciones/libro-reclamaciones.component';

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
    },

    {
    path: 'legal',
    component: LegalComponent,
    children: [
      { path: 'envios', component: EnvioPoliticaComponent },
      { path: 'devoluciones', component: DevolucionPoliticaComponent },
      { path: 'privacidad', component: PrivacidadPoliticaComponent }, // (Crea este con texto genérico)
      { path: 'reclamaciones', component: LibroReclamacionesComponent },
      { path: '', redirectTo: 'envios', pathMatch: 'full' }
    ]
  }


];
    