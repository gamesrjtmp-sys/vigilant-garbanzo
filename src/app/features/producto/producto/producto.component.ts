import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, Input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from '../../../core/services/producto.service';
import { ProductoDto } from '../../../core/models/dto/producto/productoDto';
import { CarritoService } from '../../../core/services/carrito.service';
import { ReviewsProductosComponent } from '../../reviews-productos/reviews-productos.component';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule,ReviewsProductosComponent],
  templateUrl: './producto.component.html',
  styles: [`
    .star-filled { color: #F59E0B; } /* Amber-500 */
    .star-empty { color: #E5E7EB; }  /* Gray-200 */
  `]
})
export class ProductoComponent implements OnInit {  

  // ------------------------------
  // Inyecciones
  // ------------------------------
  private productoService = inject(ProductoService);
  private router = inject(Router);
  public carritoService = inject(CarritoService);

  // ------------------------------
  // Inputs
  // ------------------------------
  @Input() id!: string;

  // ------------------------------
  // Signals
  // ------------------------------
  producto = signal<ProductoDto | null>(null);
  loading = signal(true);
  imagenSeleccionada = signal<string | null>(null);

  extraColageno = signal<ProductoDto | null>(null);
  extraQuantity = signal(0);

  // --- SIGNALS DE RESEÑAS (NUEVO) ---
  averageRating = signal(0);
  reviewsCount = signal(0);

  reviewsSummary = signal({ average: 0, count: 0 });

  // ------------------------------
  // Constantes
  // ------------------------------
  readonly EXTRA_PRODUCT_ID = 2003; 
  readonly MACHINE_PRODUCT_ID = 3002;

  // ------------------------------
  // Computed
  // ------------------------------
  totalPrice = computed(() => {
    const basePrice = this.producto()?.Precio || 0;
    const extraPrice = (this.extraColageno()?.Precio || 0) * this.extraQuantity();
    return basePrice + extraPrice;
  });

  showAddonBlock = computed(() => {
    const currentProd = this.producto();
    return currentProd?.id === this.MACHINE_PRODUCT_ID && this.extraColageno() !== null;
  });

  // ------------------------------
  // Lifecycle
  // ------------------------------
  ngOnInit() {
    this.cargarProductoJson();
    this.cargarExtra();
    this.cargarResumenResenas(); 
  }

  // ------------------------------
  // Cargar datos
  // ------------------------------
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

    this.productoService.getProductByIdJson(productId).subscribe({
      next: (data) => {
        this.producto.set(data);

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

  // ------------------------------
  // UI Actions
  // ------------------------------
  seleccionarImagen(img: string) {
    this.imagenSeleccionada.set(img);
  }

  updateExtraQuantity(change: number) {
    this.extraQuantity.update(v => Math.max(0, v + change));
  }

  // ------------------------------
  // Acciones de compra
  // ------------------------------
  agregarCarrito(): void {
    const prod = this.producto();
    if (!prod) return;

    this.carritoService.addToCart(prod);

    const extra = this.extraColageno();
    const qty = this.extraQuantity();

    if (this.showAddonBlock() && extra && qty > 0) {  
      this.carritoService.addToCart(extra, qty);
    }
  }

  comprar(): void {
    const prod = this.producto();
    if (!prod) return;

    this.carritoService.items.set([]);
    this.carritoService.addToCart(prod);
    this.carritoService.isOpen.set(false);

    const extra = this.extraColageno();
    const qty = this.extraQuantity();

    if (this.showAddonBlock() && extra && qty > 0) {
      this.carritoService.addToCart(extra, qty);
    }

    this.router.navigate(['/checkout']);
  }
// --- NUEVO: Cargar Resumen de Reseñas ---
  cargarResumenResenas() {
    const productId = Number(this.id);
    this.productoService.getReviewsByProduct(productId).subscribe(reviews => {
      if (reviews.length > 0) {
        const total = reviews.reduce((acc, r) => acc + r.rating, 0);
        this.reviewsSummary.set({
          average: total / reviews.length,
          count: reviews.length
        });
      } else {
        this.reviewsSummary.set({ average: 0, count: 0 });
      }
    });
  }

  // --- NUEVO: Scroll Suave a Reseñas ---
  scrollToReviews() {
    const element = document.getElementById('seccion-resenas');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
