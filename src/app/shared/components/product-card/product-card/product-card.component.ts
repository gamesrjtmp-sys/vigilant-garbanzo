import { Component, input } from '@angular/core';
import { ProductoDto } from '../../../../core/models/dto/producto/productoDto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {

  producto = input.required<ProductoDto>();
}
