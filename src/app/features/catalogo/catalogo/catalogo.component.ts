import { Component, inject, Input, signal } from '@angular/core';
import { ProductoService } from '../../../core/services/producto.service';
import { ProductoDto } from '../../../core/models/dto/producto/productoDto';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { Producto } from '../../../core/models/api/producto/producto';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card/product-card.component';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [RouterLink,DecimalPipe,ProductCardComponent],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.scss'
})
export class CatalogoComponent {

public productoService = inject(CatalogoService);
  private router = inject(Router);

  ngOnInit() {
    this.productoService.loadAll();
  }
  
  verDetalle(id: number) {
    this.router.navigate(['/producto', id]);
  }
}
