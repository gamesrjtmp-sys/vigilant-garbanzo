import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-temporizador-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './temporizador-banner.component.html',
  styleUrl: './temporizador-banner.component.scss'
})
export class TemporizadorBannerComponent implements OnInit, OnDestroy {
  
  // La fecha objetivo para el fin de la promoción
  private readonly targetDate = new Date('2025-12-01T00:00:00');
  
  // Signal para almacenar el tiempo restante (en días, horas, etc.)
  timeLeft = signal({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  private timerSubscription!: Subscription;

  ngOnInit() {
    this.startCountdown();
  }

  ngOnDestroy() {
    // Es CRÍTICO desuscribirse
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  startCountdown() {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.updateTimeLeft();
    });
  }

  updateTimeLeft() {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;

    if (distance < 0) {
      this.timeLeft.set({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      this.timerSubscription.unsubscribe();
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.timeLeft.set({ days, hours, minutes, seconds });
  }
}
