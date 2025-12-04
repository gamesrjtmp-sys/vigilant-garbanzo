import { Component, effect, inject, input, signal } from '@angular/core';
import { Catalogo, ProductoJson } from '../../../../core/models/api/catalogo/catalogo';
import { CatalogoService } from '../../../../core/services/catalogo.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-catalogo-comun',
  standalone: true,
  imports: [],
  templateUrl: './catalogo-comun.component.html',
  styleUrl: './catalogo-comun.component.scss'
})
export class CatalogoComunComponent {

  private catalogoSrv = inject(CatalogoService);

  idCatalogo = input.required<number>();

  // Señal para saber en qué categoría estamos (simulada por ahora)
  categoriaActiva = signal<string>('Todos');

  // Datos Mock para el Sidebar (Ya que no vienen de BD aún)
  categorias = signal([
    { nombre: 'Todos los productos', count: 120 },
    { nombre: 'Nuevos Ingresos', count: 15 },
    { nombre: 'Más Vendidos', count: 32 },
    { nombre: 'Ofertas', count: 8 }
  ]);
  
  productos = toSignal(
    toObservable(this.idCatalogo).pipe(
      tap((id) => console.log('🔄 Cargando catálogo ID:', id)), // Debug limpio
      switchMap((id) => this.catalogoSrv.getProductosByCatalogo(id))
    ),
    { initialValue: [] as ProductoJson[] } // Valor inicial para evitar nulos
  );
}
