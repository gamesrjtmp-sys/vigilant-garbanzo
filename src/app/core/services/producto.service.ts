import { Injectable, signal, computed } from '@angular/core';
import { ApiService } from '../../core/http/api.service';
import { map, catchError, tap } from 'rxjs/operators';
import { ProductoDto } from '../models/dto/producto/productoDto';
import { mapProducto } from '../mappers/producto';
import { Producto } from '../models/api/producto/producto';

@Injectable({ providedIn: 'root' })
export class ProductoService {

    private _productos = signal<ProductoDto[]>([]);

    readonly loading = signal(false);
    readonly error = signal<string | null>(null);

    readonly total = computed(() => this._productos().length);

    readonly productos = this._productos.asReadonly();
    
    constructor(private api: ApiService) {}

    getProductById(id: number) {
        return this.api.get<Producto>(`producto/${id}`)
            .pipe(
                map(dto => mapProducto(dto))
            );
    }


//#region 

  // estado local
//   private _productos = signal<Producto[]>([]);
//   readonly productos = this._productos.asReadonly();

//   readonly loading = signal(false);
//   readonly error = signal<string | null>(null);

//   // derivado útil
//   readonly total = computed(() => this._productos().length);

//   constructor(private api: ApiService) {}

  // carga inicial o refresh
//   loadAll() {
//     this.loading.set(true);
//     this.error.set(null);

//     this.api.get<ProductoApiDto[]>('productos')
//       .pipe(
//         map(list => list.map(mapProducto)),
//         tap(mapped => this._productos.set(mapped)),
//         catchError(err => {
//           console.error('Error cargando productos', err);
//           this.error.set('No se pudo cargar productos');
//           return of([] as Producto[]);
//         }),
//       )
//       .subscribe(() => this.loading.set(false));
//   }

//   // obtener uno del state, si no existe podríamos pedir a la API
//   getByIdFromState(id: number): Producto | undefined {
//     return this._productos().find(p => p.id === id);
//   }

//   // traer por id desde la API (si lo deseas)
//   loadById(id: number) {
//     this.loading.set(true);
//     return this.api.get<ProductoApiDto>(`productos/${id}`).pipe(
//       map(mapProducto),
//       tap(p => {
//         const list = this._productos();
//         const idx = list.findIndex(x => x.id === p.id);
//         if (idx >= 0) list[idx] = p;
//         else list.push(p);
//         this._productos.set([...list]);
//       }),
//       catchError(err => {
//         this.error.set('No se pudo cargar el producto');
//         return of(undefined);
//       }),
//       tap(() => this.loading.set(false))
//     );
//   }

//   // crear, actualizar, etc.
//   create(productoDto: any) {
//     return this.api.post('productos', productoDto);
//   }
//#endregion
}