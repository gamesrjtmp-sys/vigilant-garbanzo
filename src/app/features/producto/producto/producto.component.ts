import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { ProductoService } from '../../../core/services/producto.service';
import { ProductoDto } from '../../../core/models/dto/producto/productoDto';

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

  ngOnInit() {
    this.cargarProducto();
  }

  cargarProducto() {
    const productId = Number(this.id);
    
    this.productoService.getProductById(productId).subscribe({
      next: (data) => {
        // 1. Guardamos el producto
       
        // data.Imagenes =  [
        //   "assets/images/pelota.jpg",
        //   "assets/images/pelota.jpg",
        //   "assets/images/pelota.jpg"
        // ]

        this.producto.set(data);
        
        // 2. Inicializamos la imagen seleccionada con la primera del array (si existe)
        if (data.Imagenes && data.Imagenes.length > 0) {
            this.imagenSeleccionada.set(data.Imagenes[0]);
        }

        // 3. Quitamos el loading
        this.loading.set(false);
      },
      error: (err) => {
          console.error(err);
          this.loading.set(false);
      }
    });
  }
  
  // NUEVO: Método para cambiar la imagen al hacer click
  seleccionarImagen(img: string) {
      this.imagenSeleccionada.set(img);
  }

  comprar() {
      console.log("Comprando ID:", this.id);
  }
}
