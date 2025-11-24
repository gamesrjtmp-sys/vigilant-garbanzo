import { Injectable, signal, computed } from '@angular/core';
import { ApiService } from '../../core/http/api.service';
import { map, catchError, tap } from 'rxjs/operators';
import { ProductoDto } from '../models/dto/producto/productoDto';
import { mapProducto } from '../mappers/producto';

@Injectable({ providedIn: 'root' })
export class CatalogoService {

    private _productos = signal<ProductoDto[]>([]);

    readonly loading = signal(false);
    readonly error = signal<string | null>(null);

    readonly productos = this._productos.asReadonly();

    readonly total = computed(() => this._productos().length);
    
    constructor(private api: ApiService) {}

    loadAll(){  
        this.loading.set(true);
        this.error.set(null);
        
        this.api.get<ProductoDto[]>('producto')
            .pipe(
                map(list => list.map(mapProducto)),
            )
            .subscribe({
                next: productos => {
                    this._productos.set(productos);
                    console.log("Productos almacenados en la Signal:", this._productos()); 
                    console.log("Productos recibidos del API:", productos);
                },
                error: err => {
                    console.error(err);
                    this.error.set("No se pudo el producto");
                },
                complete: () => {
                    this.loading.set(false);
                }
            });
    }
}