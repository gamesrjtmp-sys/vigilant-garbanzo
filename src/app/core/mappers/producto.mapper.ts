import { Producto } from "../models/api/producto/producto";
import { ProductoDto } from "../models/dto/producto/productoDto";


export function mapProducto(api: ProductoDto): Producto {
  return {
    id: api.id,
    Nombre: api.Nombre ?? 'Sin nombre',
    Precio: (api.Precio ?? 0) / 100,
    Imagenes: api.Imagenes && api.Imagenes.length > 0
        ? [...api.Imagenes]
        : ["assets/images/default_product.webp"],
    Descripcion: api.Descripcion ?? '',
    Stock: api.Stock ?? 0,
  };
}

  