import { Component, inject, Input } from '@angular/core';
import { Producto } from '../../../../core/models/api/producto/producto';
import { ProductoComponent } from '../../../producto/producto/producto.component';
import { Router } from '@angular/router';
import { InicioComponent } from '../../inicio/inicio.component';
import { ProductoDto } from '../../../../core/models/dto/producto/productoDto';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card/product-card.component';

@Component({
  selector: 'app-grid-oferta',
  standalone: true,
  imports: [ProductoComponent,InicioComponent,CommonModule,ProductCardComponent],
  templateUrl: './grid-oferta.component.html',
  styleUrl: './grid-oferta.component.scss'
})
export class GridOfertaComponent {
  
   // Inyección de dependencias (Estilo moderno Angular 18+)
  private router = inject(Router);

  // INPUT REQUERIDO: Recibe la lista de productos desde el padre (InicioComponent)
  // El '!' indica que, aunque empieza indefinido, Angular garantiza que tendrá valor al ejecutarse.
  @Input({ required: true }) products!: ProductoDto[];

  // --- MÉTODOS LLAMADOS DESDE EL HTML ---

  // 1. Navegación al Detalle
  // Se ejecuta cuando el hijo emite (verDetalle)="onViewDetail($event)"
  onViewDetail(id: number) {
    this.router.navigate(['/producto', id]);
  }
}

