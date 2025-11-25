import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { ProductoService } from '../../../core/services/producto.service';
import { ProductoDto } from '../../../core/models/dto/producto/productoDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.scss'
})
export class ProductoComponent {  

 public productoService = inject(ProductoService);
  
  // Signals de estado
  producto = signal<ProductoDto | null>(null);
  loading = signal(true);
  // NUEVO: Signal para la imagen que el usuario selecciona (click)
  imagenSeleccionada = signal<string | null>(null);

  @Input() id!: string; 

  private router = inject(Router)

  ngOnInit() {
    this.cargarProducto();
  }

  cargarProducto() {
    const productId = Number(this.id);
    
    this.productoService.getProductById(productId).subscribe({
      next: (data) => {
        this.producto.set(data);
      
        if (data.Imagenes && data.Imagenes.length > 0) {
            this.imagenSeleccionada.set(data.Imagenes[0]);
        }
        this.loading.set(false);
      },
      error: (err) => {
          console.error(err);
          this.loading.set(false);
      }
    });
  }
  seleccionarImagen(img: string) {
      this.imagenSeleccionada.set(img);
  }

  comprar(): void {
    // 3. Ejecutar la navegación programática
    this.router.navigate(['/checkout']);
  }

  // Si necesitas pasar parámetros (por ejemplo, el ID del carrito):
  public goToCheckoutWithId(cartId: number): void {
    // Ejemplo: /checkout/12345
    this.router.navigate(['/checkout', cartId]);
  }
}
