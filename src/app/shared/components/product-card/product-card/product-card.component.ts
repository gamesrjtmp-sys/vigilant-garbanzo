import { Component, inject, input } from '@angular/core';
import { ProductoDto } from '../../../../core/models/dto/producto/productoDto';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../../../core/services/carrito.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  
  producto = input.required<ProductoDto>();
  private carritoService = inject(CarritoService); 

  agregarCarrito(): void {
    const prod = this.producto();
    if (!prod) return; // Validación de seguridad

    // Llamamos al servicio. El servicio ya se encarga de abrir el drawer (isOpen.set(true))
    this.carritoService.addToCart(prod);
  }
}
