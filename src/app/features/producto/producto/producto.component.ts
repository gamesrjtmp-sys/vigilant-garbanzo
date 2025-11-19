import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductoService } from '../../../core/services/producto.service';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.scss'
})
export class ProductoComponent {  

  constructor(public productoService: ProductoService) {}

   ngOnInit() {
    this.productoService.loadAll();
  }
}
