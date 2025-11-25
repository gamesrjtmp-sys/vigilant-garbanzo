import { Component, inject, signal } from '@angular/core';
import { CarritoService } from '../../../core/services/carrito.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss'
})
export class CarritoComponent {

    public cartService = inject(CarritoService); 
    
    close() {
        this.cartService.isOpen.set(false); 
    }
    
    // Evita cerrar si se hace clic dentro del contenido blanco
    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}
