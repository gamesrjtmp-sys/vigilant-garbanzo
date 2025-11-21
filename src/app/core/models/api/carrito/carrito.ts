import { ProductoDto } from "../../dto/producto/productoDto";

// src/app/domain/models/cart.model.ts
export interface CarritoItem {
  product: ProductoDto;
  quantity: number;
}