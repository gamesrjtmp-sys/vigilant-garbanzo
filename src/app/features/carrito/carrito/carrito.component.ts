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

 // La inyección es correcta.
    public cartService = inject(CarritoService); 

    // 🚨 ELIMINA: public isOpen = signal(false);
    // 🚨 ELIMINA: public totalQuantity = signal(20);

    // Método toggleCart() ya no es necesario aquí, lo llama el menú directamente al servicio.

    close() {
        // Correcto: Llama al servicio para cerrar la señal global
        this.cartService.isOpen.set(false); 
    }
    
    // Evita cerrar si se hace clic dentro del contenido blanco
    stopPropagation(event: Event) {
        event.stopPropagation();
    }
}
