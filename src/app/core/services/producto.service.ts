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

    ListarProductos() {
        this.loading.set(true);
        this.error.set(null);
        return this.api.get<Producto[]>(`producto`)
            .pipe(
                map(dtos => dtos.map(dto => mapProducto(dto))), 
                tap(productos => {
                    this._productos.set(productos);
                    this.loading.set(false);
                }),
                catchError(err => {
                    this.error.set('Error cargando productos');
                    this.loading.set(false);
                    throw err;
                })
            );  
    }

}