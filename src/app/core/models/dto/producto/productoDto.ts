export interface ProductoDto {
  Id: number;
  Nombre: string;
  Precio: number; // backend usa cents
  Imagenes?: string[] | null;
  Descripcion?: string | null;
  Stock?: number | null;
}