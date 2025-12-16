export interface Review {
  id: number;
  productId: number; // Para relacionarlo con el producto
  user: string;      // Nombre del cliente
  rating: number;    // 1 a 5 estrellas
  date: string;      // Fecha en formato string (ISO)
  comment: string;   // El texto de la opinión
  verified: boolean; // ¿Compró el producto? (Badge de confianza)
  avatar: string;    // Inicial o URL de foto
}