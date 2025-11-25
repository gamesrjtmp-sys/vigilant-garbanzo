import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { ReactiveFormsModule, } from '@angular/forms';
import { CheckoutComponent } from '../checkout/checkout.component';

@Component({
  selector: 'app-checkout-pasos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CheckoutComponent],
  templateUrl: './checkout-pasos.component.html',
  styleUrl: './checkout-pasos.component.scss'
})
export class CheckoutPasosComponent {
// Input Signal Requerido
  currentStep = input.required<number>();
  
  steps = ['Datos', 'Pago', 'Confirmar'];

  // Signal Computada: Calcula el porcentaje (0%, 50%, 100%)
  progressPercentage = computed(() => {
    const totalSteps = this.steps.length - 1; // 2 intervalos
    const current = this.currentStep() - 1;   // Base 0
    return (current / totalSteps) * 100;
  });
}
