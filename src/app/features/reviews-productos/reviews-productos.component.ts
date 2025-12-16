import { Component, computed, inject, input, signal } from '@angular/core';
import { ProductoService } from '../../core/services/producto.service';
import { CommonModule } from '@angular/common';
import { Review } from '../../core/models/dto/producto/reviews';

@Component({
  selector: 'app-reviews-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews-productos.component.html',
  styles: [`
    .star-filled { color: #F59E0B; } /* Amber-500 */
    .star-empty { color: #E5E7EB; }  /* Gray-200 */
  `]
})
export class ReviewsProductosComponent {
    private productService = inject(ProductoService);

  // Input: ID del producto para buscar sus reseñas
  productId = input.required<number>();

  // Estado
  reviews = signal<Review[]>([]);
  loading = signal(true);

  // --- CÁLCULOS AUTOMÁTICOS (Metrics) ---
  
  // Promedio (Ej: 4.8)
  averageRating = computed(() => {
    const total = this.reviews().reduce((acc, r) => acc + r.rating, 0);
    return this.reviews().length ? (total / this.reviews().length).toFixed(1) : '0.0';
  });

  // Total de reseñas
  totalReviews = computed(() => this.reviews().length);

  // Distribución para las barras de progreso (5 stars, 4 stars...)
  starsDistribution = computed(() => {
    const counts = [0, 0, 0, 0, 0, 0]; // Index 1 to 5
    this.reviews().forEach(r => counts[r.rating]++);
    
    // Retornamos array invertido (5 primero) con porcentajes
    const total = this.totalReviews() || 1;
    return [5, 4, 3, 2, 1].map(star => ({
      star,
      count: counts[star],
      percent: (counts[star] / total) * 100
    }));
  });

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    // Convertimos el signal input a número si viene como string
    const id = Number(this.productId());
    
    this.productService.getReviewsByProduct(id).subscribe({
      next: (data) => {
        this.reviews.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  // Helper para generar array de estrellas para el HTML
  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  } 
}
