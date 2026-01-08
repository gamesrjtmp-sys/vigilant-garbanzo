export interface Catalogo {
  idCatalogo: number;
  nombreCatalogo: string;
  subcategorias: Subcategoria[];
}

export interface Subcategoria {
  idSubcategoria: number;
  nombreSubcategoria: string;
  productos: ProductoJson[];
}

export interface ProductoJson {
  idProducto: number;
  idCatalogo: number;
  idSubcategoria: number;
  nombreProducto: string;
  precio: number;
  imagenes: string[];
}