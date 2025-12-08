import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from '../../core/http/api.service';
import { map, catchError, tap } from 'rxjs/operators';
import { ProductoDto } from '../models/dto/producto/productoDto';
import { mapProducto } from '../mappers/producto.mapper';
import { Producto } from '../models/api/producto/producto';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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



    private http = inject(HttpClient);
    private readonly JSON_URL = 'assets/data/catalogo/catalogo.json';

    getProductByIdJson(idProducto: number): Observable<ProductoDto | null> {
        return this.http.get<any>(this.JSON_URL).pipe(
            map(response => {
                // 1. Aplanamos la estructura para buscar en todos los productos a la vez
                const todosLosProductos = response.catalogos
                .flatMap((cat: any) => cat.subcategorias)
                .flatMap((sub: any) => sub.productos);

                // 2. Buscamos el producto específico
                const productoEncontrado = todosLosProductos.find((p: any) => p.idProducto === idProducto);

                if (!productoEncontrado) return null;

                // 3. Mapeamos de JSON (sucio) a DTO (limpio)
                return {
                id: productoEncontrado.idProducto,
                Nombre: productoEncontrado.nombreProducto,
                Precio: productoEncontrado.precio,
                // Convertimos la imagen string única en un array para tu slider
                Imagenes: productoEncontrado.imagen ? [productoEncontrado.imagen] : ['assets/images/pelota.jpg'],
                Descripcion: productoEncontrado.descripcion || 'Descripción detallada del producto no disponible.',
                Stock: 10, // Stock simulado
                // Puedes agregar más campos simulados si tu DTO lo requiere
                esOferta: false,
                llegaHoy: true
                } as ProductoDto;
        })
        );
    }

    ListarProductosJson() {
        this.loading.set(true);
        this.error.set(null);

        // 1. Petición al archivo JSON
        return this.http.get<any>(this.JSON_URL)
        .pipe(
            // 2. TRANSFORMACIÓN (La parte clave)
            map(response => {
            // Aplanamos la jerarquía: Array de Arrays -> Array Simple
            const rawProducts = response.catalogos
                .flatMap((cat: any) => cat.subcategorias)
                .flatMap((sub: any) => sub.productos);

            // Mapeamos campo por campo al formato que usa tu APP
            return rawProducts.map((p: any) => ({
                id: p.idProducto,
                Nombre: p.nombreProducto,
                Precio: p.precio,
                // Convertimos la imagen string a array (para que no rompa tu carrusel)
                Imagenes: p.imagen ? [p.imagen] : ['assets/images/pelota.jpg'],
                Descripcion: p.descripcion || 'Sin descripción disponible.',
                Stock: 10 // Stock simulado
            } as ProductoDto));
            }),

            // 3. EFECTOS SECUNDARIOS (Actualizar estado)
            tap(productos => {
            this._productos.set(productos);
            this.loading.set(false);
            }),

            // 4. MANEJO DE ERRORES
            catchError(err => {
            console.error('Error leyendo catalogos.json:', err);
            this.error.set('No se pudieron cargar los productos.');
            this.loading.set(false);
            return throwError(() => err);
            })
        );  
    }
}