import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckoutPasosComponent } from '../checkout-pasos/checkout-pasos.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,CheckoutPasosComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
// --- ESTADO (Signals) ---
  currentStep = signal<number>(1);
  
  // Opciones de pago
  paymentMethod = signal<'QR' | 'CASH' | null>(null);

  // --- FORMULARIOS (Typed Forms) ---
  checkoutForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.checkoutForm = this.fb.group({
    // Nuevo Form Group para el Paso 1
    datosCliente: this.fb.group({ 
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
    }),
    
    // Nuevo Form Group para el Paso 2
    datosPago: this.fb.group({ 
        method: ['', Validators.required]
    })
});
  }

  // --- MÉTODOS DE NAVEGACIÓN ---

  nextStep() {
    // Validaciones simples antes de avanzar
    if (this.currentStep() === 1 && this.checkoutForm.get('name')?.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    
    if (this.currentStep() === 2 && !this.paymentMethod()) {
      alert("Selecciona un método de pago");
      return;
    }

    this.currentStep.update(v => v + 1);
  }

  prevStep() {
    this.currentStep.update(v => Math.max(v - 1, 1));
  }

  selectPayment(method: 'QR' | 'CASH') {
    // 1. Actualizamos la señal visual (para el borde verde)
    this.paymentMethod.set(method);

    // 2. IMPORTANTE: Actualizamos el formulario para que la validación pase a VALID
    // Usamos 'patchValue' apuntando al grupo 'datosPago'
    this.checkoutForm.patchValue({
      datosPago: {
        method: method
      }
    });
  }

  confirmOrder() {
    console.log("Orden enviada:", this.checkoutForm.value);
    alert("¡Pedido realizado con éxito!");
    // Aquí redir
  }

  
}
