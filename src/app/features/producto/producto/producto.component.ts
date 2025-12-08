import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../../core/services/producto.service';
import { ProductoDto } from '../../../core/models/dto/producto/productoDto';
// 1. IMPORTAR EL SERVICIO DE CARRITO
import { CarritoService } from '../../../core/services/carrito.service';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.scss'
})
export class ProductoComponent implements OnInit {  

  private productoService = inject(ProductoService);
  private router = inject(Router);
  // 2. INYECTAR EL SERVICIO (Público si lo usas en el HTML, privado si no)
  private carritoService = inject(CarritoService); 
  
  // Signals de estado
  producto = signal<ProductoDto | null>(null);
  loading = signal(true);
  imagenSeleccionada = signal<string | null>(null);

  @Input() id!: string; 

  ngOnInit() {
    this.cargarProductoJson();
  }

  cargarProducto() {
    const productId = Number(this.id);
    
    this.productoService.getProductById(productId).subscribe({
      next: (data) => {
        this.producto.set(data);
        
        // Inicializar imagen seleccionada con la primera
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

   cargarProductoJson() {
    const productId = Number(this.id);
    console.log("aqui llega")
    this.productoService.getProductByIdJson(productId).subscribe({
      next: (data) => {
        this.producto.set(data);
        
        // Inicializar imagen seleccionada con la primera
        if (data?.Imagenes && data.Imagenes.length > 0) {
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

  // --- ACCIONES DE COMPRA ---

  // Opción 1: Agregar al carrito (Mantiene al usuario en la página y abre el drawer)
  agregarCarrito(): void {
    const prod = this.producto();
    if (!prod) return; // Validación de seguridad

    // Llamamos al servicio. El servicio ya se encarga de abrir el drawer (isOpen.set(true))
    this.carritoService.addToCart(prod);
  }

  // Opción 2: Comprar ahora (Reemplaza carrito y lleva al checkout)
  comprar(): void {
    const prod = this.producto();
    if (!prod) return;

    // Usamos el método especial buyNow del servicio
    this.carritoService.buyNow(prod);
    
    // Navegamos inmediatamente al checkout
    this.router.navigate(['/checkout']);
  }
}