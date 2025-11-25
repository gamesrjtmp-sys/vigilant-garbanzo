import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, shareReplay, tap } from 'rxjs';
import { UbigeoDto } from '../models/dto/ubigeo/ubigeoDto';
import { mapUbigeo } from '../mappers/ubigeo.mapper';

export interface Ubigeo { id: string; nombre: string; parentId?: string; }

@Injectable({ providedIn: 'root' })
export class UbigeoService {

   private http = inject(HttpClient);

    // Rutas a tus archivos en assets
    private readonly DEP_URL = 'assets/data/departamentos.json';
    private readonly PROV_URL = 'assets/data/provincias.json';
    private readonly DIST_URL = 'assets/data/distritos.json';

    // Cachés
    private depCache$: Observable<UbigeoDto[]> | null = null;
    private provCache$: Observable<UbigeoDto[]> | null = null;
    private distCache$: Observable<UbigeoDto[]> | null = null;

    // --- MÉTODOS PRIVADOS (RAW) ---

    private getRawDepartamentos(): Observable<UbigeoDto[]> {
        if (!this.depCache$) {
        this.depCache$ = this.http.get<UbigeoDto[]>(this.DEP_URL).pipe(
            // 2. Usamos 'tap' para ver los datos cuando lleguen
            //tap(data => console.log('📦 JSON RAW Departamentos:', data)),
            
            shareReplay(1) // Guarda la respuesta en memoria
        );
        }
        return this.depCache$;
    }

    private getRawProvincias(): Observable<UbigeoDto[]> {
        if (!this.provCache$) {
        this.provCache$ = this.http.get<UbigeoDto[]>(this.PROV_URL).pipe(shareReplay(1));
        }
        return this.provCache$;
    }

    private getRawDistritos(): Observable<UbigeoDto[]> {
        if (!this.distCache$) {
        this.distCache$ = this.http.get<UbigeoDto[]>(this.DIST_URL).pipe(shareReplay(1));
        }
        return this.distCache$;
    }

    // --- MÉTODOS PÚBLICOS (ADAPTADOS CON MAPPER) ---

    // 1. Departamentos
    getDepartamentos(): Observable<Ubigeo[]> {
        return this.getRawDepartamentos().pipe(
        // Usamos el mapper importado en lugar de escribir la lógica aquí
        map(data => data.map(item => mapUbigeo(item)))
        );
    }

    // 2. Provincias (Filtradas por Dpto)
    getProvincias(depId: string): Observable<Ubigeo[]> {
        return this.getRawProvincias().pipe(
        map(data => data
            .filter(p => p.department_id === depId)
            .map(item => mapUbigeo(item)) // Reutilizamos el mapper
        )
        );
    }

    // 3. Distritos (Filtrados por Prov)
    getDistritos(provId: string): Observable<Ubigeo[]> {
        return this.getRawDistritos().pipe(
        map(data => data
            .filter(d => d.province_id === provId)
            .map(item => mapUbigeo(item)) // Reutilizamos el mapper
        )
        );
    }
}