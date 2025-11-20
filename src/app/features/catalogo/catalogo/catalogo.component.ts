import { Component, inject, Input, signal } from '@angular/core';
import { ProductoService } from '../../../core/services/producto.service';
import { ProductoDto } from '../../../core/models/dto/producto/productoDto';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.scss'
})
export class CatalogoComponent {


    // public productoService = inject(ProductoService);

    // constructor() {}

    // ngOnInit() {
    //   this.productoService.loadAll();
    // }
  
    
    // @Input() producto: any = {
    //   nombre: "Zapatillas Nike Air Max",
    //   precio: 359.90,
    //   descripcion: "Zapatillas de alto rendimiento con cámara de aire mejorada.",
    //   imagenes: [
    //     "assets/images/default_product.webp",
    //     "assets/images/pelota.jpg",
    //     "assets/images/pelota.jpg"
    //   ]
    // };
  
    // imagenSeleccionada = this.producto.imagenes[0];
  
    // seleccionarImagen(img: string) {
    //   this.imagenSeleccionada = img;
    // }
}
