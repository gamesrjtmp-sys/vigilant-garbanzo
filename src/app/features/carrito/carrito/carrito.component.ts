import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CarritoService } from '../../../core/services/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrito.component.html',
  styles: [`
    /* Animaciones personalizadas para el drawer */
    .drawer-backdrop { background-color: rgba(0, 0, 0, 0.5); }
    .animate-slide-in-right { animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    
    @keyframes slideInRight {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
  `]
})
export class CarritoComponent {
  
  public cartService = inject(CarritoService);
  private router = inject(Router);

  close() {
    this.cartService.isOpen.set(false);
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  goToCheckout() {
    this.close();
    this.router.navigate(['/checkout']);
  }
}