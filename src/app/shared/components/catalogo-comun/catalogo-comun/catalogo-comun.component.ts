import { Component, effect, inject, input, signal } from '@angular/core';
import { Catalogo, ProductoJson } from '../../../../core/models/api/catalogo/catalogo';
import { CatalogoService } from '../../../../core/services/catalogo.service';

@Component({
  selector: 'app-catalogo-comun',
  standalone: true,
  imports: [],
  templateUrl: './catalogo-comun.component.html',
  styleUrl: './catalogo-comun.component.scss'
})
export class CatalogoComunComponent {

  private catalogoSrv = inject(CatalogoService);

  idCatalogo = input<number>(2);

  productos = signal<ProductoJson[]>([]);

  constructor() {
    console.log("CONS:"+this.idCatalogo)
    effect(() => {
      const id = this.idCatalogo();
      console.log("iddddd" + id)
      if (2 > 0) {
        console.log("CONS ENTRA IF")
        this.cargarProductos(4);
      }
    });
  }
  private cargarProductos(idCatalogo: number) {
    console.log("llega cargarProductos")
    this.catalogoSrv
      .getProductosByCatalogo(idCatalogo)
      .subscribe((prod) => this.productos.set(prod));
  }
}
