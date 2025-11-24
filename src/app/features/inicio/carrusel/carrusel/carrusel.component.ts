import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.scss'
})
export class CarruselComponent implements OnInit, OnDestroy {
  
  private router = inject(Router); // 👈 Inyección del Router
  
  // Array de imágenes y datos para el carrusel
  // 🚨 CORRECCIÓN: Se añade la propiedad 'link' para que el botón funcione.
  readonly slides = [
    { id: 1, imgUrl: 'assets/images/default_product-.webp', promo: 'Hasta 50% OFF', subtitle: 'Descubre nuestra mejor colección...', link: '/catalogo/black' },
    { id: 2, imgUrl: 'assets/images/default_product-.webp', promo: '¡Nuevos Juguetes!', subtitle: 'Diversión bajo el sol...', link: '/catalogo/verano' },
  ];
  
  // Estado reactivo: Señal para controlar qué slide se muestra
  currentIndex = signal(0);
  
  private intervalSubscription!: Subscription;
  private readonly rotationTimeMs = 5000; // Rotación cada 5 segundos

  ngOnInit() {
    this.startAutoRotate();
  }

  ngOnDestroy() {
    this.intervalSubscription.unsubscribe();
  }

  startAutoRotate() {
    this.intervalSubscription = interval(this.rotationTimeMs).subscribe(() => {
      this.nextSlide();
    });
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
    // Opcional: reiniciar el timer después de un clic manual
    this.intervalSubscription.unsubscribe();
    this.startAutoRotate(); 
  }

  // 🚨 MÉTODO FALTANTE: goToPromo
  goToPromo(link: string) {
    this.router.navigateByUrl(link); // Navega a la URL del slide
  }
}

