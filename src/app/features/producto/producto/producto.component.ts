import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
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
  public carritoService = inject(CarritoService); 
  
  // Signals de estado
  producto = signal<ProductoDto | null>(null);
  loading = signal(true);
  imagenSeleccionada = signal<string | null>(null);

  // ID del producto "Extra" en tu JSON (Caja de Repuesto: 2003)
  readonly EXTRA_PRODUCT_ID = 2003; 
  
  // ID del producto principal que activa el Add-on (Ej: La máquina Vaporizador: 3003)
  // CAMBIA ESTE ID por el ID real de tu máquina en el JSON
  readonly MACHINE_PRODUCT_ID = 3002; 
  extraColageno = signal<ProductoDto | null>(null); // Datos del extra cargados del JSON
   // 2. ESTADO DEL ADD-ON
  extraQuantity = signal(0);

  // 3. PRECIO TOTAL VISUAL (Para el botón)
  totalPrice = computed(() => {
    const basePrice = this.producto()?.Precio || 0;
    const extraPrice = (this.extraColageno()?.Precio || 0) * this.extraQuantity();
    return basePrice + extraPrice;
  });
  
   // Computed: Solo mostramos el bloque si estamos viendo la máquina y el extra cargó bien
  showAddonBlock = computed(() => {
    const currentProd = this.producto();
    return currentProd?.id === this.MACHINE_PRODUCT_ID && this.extraColageno() !== null;
  });

  // ... ngOnInit y cargarProducto igual ...

  // toggleExtra() {
  //   this.wantsExtra.update(v => !v);
  // }

  @Input() id!: string; 

  ngOnInit() {
    this.cargarProductoJson();
    this.cargarExtra();
  }

  // Método auxiliar para cargar la info de las pastillas del JSON
  cargarExtra() {
    this.productoService.getProductByIdJson(this.EXTRA_PRODUCT_ID).subscribe({
      next: (data) => {
        if (data) this.extraColageno.set(data);
      }
    });
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


  updateExtraQuantity(change: number) {
    this.extraQuantity.update(v => Math.max(0, v + change));
  }

  // Opción 1: Agregar al carrito (Mantiene al usuario en la página y abre el drawer)
  agregarCarrito(): void {
     const prod = this.producto();
    if (!prod) return;
    
    // 1. Agregar producto principal
    this.carritoService.addToCart(prod);

    // 2. Agregar extras solo si corresponde y hay cantidad > 0
    const extra = this.extraColageno();
    const qty = this.extraQuantity();
    
    if (this.showAddonBlock() && extra && qty > 0) {
      this.carritoService.addToCart(extra, qty);
    }
  }

  // Opción 2: Comprar ahora (Reemplaza carrito y lleva al checkout)
  comprar(): void {
     const prod = this.producto();
    if (!prod) return;

    // 1. Limpiar carrito y agregar principal
    this.carritoService.items.set([]);
    this.carritoService.addToCart(prod);
    this.carritoService.isOpen.set(false); // Asegurar que el drawer no estorbe

    // 2. Agregar extras si aplica
    const extra = this.extraColageno();
    const qty = this.extraQuantity();
    
    if (this.showAddonBlock() && extra && qty > 0) {
      this.carritoService.addToCart(extra, qty);
    }
    
    // 3. Ir a pagar
    this.router.navigate(['/checkout']);
  }
}