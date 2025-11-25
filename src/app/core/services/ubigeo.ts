import { Injectable } from '@angular/core';
import { of } from 'rxjs';

export interface Ubigeo { id: string; nombre: string; parentId?: string; }

@Injectable({ providedIn: 'root' })
export class UbigeoService {
  // Datos simulados (En producción, esto vendría de un JSON o API)
  private departamentos: Ubigeo[] = [
    { id: '01', nombre: 'Lima' },
    { id: '02', nombre: 'Arequipa' },
    { id: '03', nombre: 'Cusco' }
  ];

  private provincias: Ubigeo[] = [
    { id: '0101', nombre: 'Lima', parentId: '01' },
    { id: '0102', nombre: 'Cañete', parentId: '01' },
    { id: '0201', nombre: 'Arequipa', parentId: '02' }
  ];

  private distritos: Ubigeo[] = [
    { id: '010101', nombre: 'Miraflores', parentId: '0101' },
    { id: '010102', nombre: 'San Isidro', parentId: '0101' },
    { id: '010103', nombre: 'Surco', parentId: '0101' },
    { id: '010201', nombre: 'San Vicente', parentId: '0102' },
    { id: '020101', nombre: 'Yanahuara', parentId: '0201' }
  ];

  getDepartamentos() { return of(this.departamentos); }
  
  getProvincias(depId: string) {
    return of(this.provincias.filter(p => p.parentId === depId));
  }

  getDistritos(provId: string) {
    return of(this.distritos.filter(d => d.parentId === provId));
  }
}