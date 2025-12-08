import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { TemporizadorBannerComponent } from '../temporizador-banner/temporizador-banner/temporizador-banner.component';
import { GridOfertaComponent } from '../grid-oferta/grid-oferta/grid-oferta.component';
import { CarruselComponent } from '../carrusel/carrusel/carrusel.component';
import { ProductoService } from '../../../core/services/producto.service';
import { ProductoDto } from '../../../core/models/dto/producto/productoDto';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { Producto } from '../../../core/models/api/producto/producto';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [TemporizadorBannerComponent,GridOfertaComponent,CarruselComponent],
  templateUrl:'./inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

  // Inyección de Dependencias
  private productoService = inject(ProductoService);

  // --- ESTADO REACTIVO (Signals) ---
  
  // 1. Datos: Usamos el Modelo Limpio (Producto), NO el DTO
  topOffers = signal<Producto[]>([]);

  // 2. Estado de UI
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.cargarOfertas();
  }

  cargarOfertas() {
    // Iniciar estado de carga
    this.loading.set(true);
    this.error.set(null);

    this.productoService.ListarProductosJson().subscribe({
      next: (data) => {
        // Lógica de Negocio: Filtrar o cortar las ofertas
        const ofertas = data.slice(0, 10); 
        this.topOffers.set(ofertas);
      },
      error: (err) => {
        console.error('Error cargando ofertas:', err);
        this.error.set("No se pudieron cargar las ofertas del mes.");
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
}

