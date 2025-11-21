export interface Producto {
  id: number;
  Nombre : string;
  Precio: number; 
  Imagenes?: string[] | null;
  Descripcion?: string | null;
  Stock?: number | null;
}