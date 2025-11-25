export interface UbigeoDto {
  id: string;
  name: string;          // Tu JSON trae "name" en inglés
  department_id?: string; // Solo Provincias y Distritos lo tienen
  province_id?: string;   // Solo Distritos lo tienen
}