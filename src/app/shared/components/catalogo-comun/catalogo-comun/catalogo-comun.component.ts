import { Component, effect, inject, input, numberAttribute, signal } from '@angular/core';
import { Catalogo, ProductoJson } from '../../../../core/models/api/catalogo/catalogo';
import { CatalogoService } from '../../../../core/services/catalogo.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ProductoDto } from '../../../../core/models/dto/producto/productoDto';
import { ProductCardComponent } from '../../product-card/product-card/product-card.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogo-comun',
  standalone: true,
  imports: [CommonModule,ProductCardComponent],
  templateUrl: './catalogo-comun.component.html',
  styleUrl: './catalogo-comun.component.scss'
})
export class CatalogoComunComponent {

  private catalogoSrv = inject(CatalogoService);
  private router = inject(Router);

  // Input de la URL (?id=2)
  idSubcategoria = input.required<number, string>({
    alias: 'id', 
    transform: numberAttribute 
  });

  // --- DATOS VISUALES PARA EL SIDEBAR (MOCK) ---
  // Esto reemplaza los filtros complejos por navegación simple
  categoriaActiva = signal<string>('Todos');
  
  categoriasSidebar = signal([
    { nombre: 'Todos los productos', count: 120 },
    { nombre: 'Lo más vendido', count: 45 },
    { nombre: 'Nuevos Ingresos', count: 12 },
    { nombre: 'Ofertas Flash', count: 8 }
  ]);

  // --- LÓGICA DE PRODUCTOS REACTIVA ---
  productos = toSignal(
    toObservable(this.idSubcategoria).pipe(
      switchMap((id) => this.catalogoSrv.getProductosBySubcategoria(id)),
      // 🔥 MAPPER ON-THE-FLY: Convertimos ProductoJson a ProductoDto aquí mismo
      // 🔥 MAPPER CORREGIDO
      map(jsonList => jsonList.map((item: any) => ({
        id: item.idProducto,
        Nombre: item.nombreProducto,
        Precio: item.precio,
        
        // LÓGICA DE IMÁGENES ROBUSTA:
        // 1. ¿Tiene array de 'imagenes'? Úsalo.
        // 2. ¿Tiene solo 'imagen' (texto)? Mételo en un array.
        // 3. ¿No tiene nada? Usa la foto por defecto.
        Imagenes: (item.imagenes && item.imagenes.length > 0)
                  ? item.imagenes
                  : (item.imagen ? [item.imagen] : ['assets/images/pelota.jpg']),

        Descripcion: item.descripcion || 'Sin descripción',
        Stock: 10 // Valor por defecto
      } as ProductoDto)))
    ),
    { initialValue: [] as ProductoDto[] }// Ahora la señal es de tipo DTO
  );

   onViewDetail(id: number) {
    this.router.navigate(['/producto', id]);
  }
}
