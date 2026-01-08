import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.scss'
})
export class CarruselComponent implements OnInit, OnDestroy {
  
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID); // Para evitar errores en SSR si usas
  
  // Datos del Carrusel (Puedes agregar más slides aquí)
  readonly slides = [
    { 
      id: 1, 
      imgUrl: 'assets/images/Modelos/4.webp', 
      title: 'Nueva Colección',
      promo: 'Hasta 50% OFF', 
      subtitle: 'Descubre nuestra mejor selección de temporada.', 
      link: '/catalogo',
      cta: 'COMPRAR AHORA'
    },
    { 
      id: 2, 
      imgUrl: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1920&auto=format&fit=crop', 
      title: 'Cuidado Personal',
      promo: '¡Nuevos Ingresos!', 
      subtitle: 'Todo lo que necesitas para tu rutina diaria.', 
      link: '/catalogo',
      cta: 'VER NOVEDADES'
    },
    { 
      id: 3, 
      imgUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1920&auto=format&fit=crop', 
      title: 'Ofertas Flash',
      promo: 'Solo por 24h', 
      subtitle: 'Aprovecha descuentos exclusivos en seleccionados.', 
      link: '/ofertas',
      cta: 'IR A OFERTAS'
    }
  ];
  
  // Estado reactivo
  currentIndex = signal(0);
  
  private intervalSubscription!: Subscription;
  private readonly rotationTimeMs = 5000; // 5 segundos

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoRotate();
    }
  }

  ngOnDestroy() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  startAutoRotate() {
    // Limpiamos cualquier subscripción previa para evitar duplicados
    if (this.intervalSubscription) this.intervalSubscription.unsubscribe();
    
    this.intervalSubscription = interval(this.rotationTimeMs).subscribe(() => {
      this.nextSlide();
    });
  }

  // Pausar al hacer hover (Mejor UX)
  pauseAutoRotate() {
    if (this.intervalSubscription) this.intervalSubscription.unsubscribe();
  }

  nextSlide() {
    this.currentIndex.update(index => (index + 1) % this.slides.length);
  }

  prevSlide() {
    this.currentIndex.update(index => 
      (index - 1 + this.slides.length) % this.slides.length
    );
  }

  goToSlide(index: number) {
    this.currentIndex.set(index);
    this.startAutoRotate(); // Reiniciamos el timer al interactuar
  }

  goToPromo(link: string) {
    this.router.navigateByUrl(link);
  }
}