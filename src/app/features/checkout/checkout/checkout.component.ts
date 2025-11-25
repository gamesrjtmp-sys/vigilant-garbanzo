import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckoutPasosComponent } from '../checkout-pasos/checkout-pasos.component';
import { Ubigeo, UbigeoService } from '../../../core/services/ubigeo.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,CheckoutPasosComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
 private fb = inject(FormBuilder);
  private ubigeoService = inject(UbigeoService);

  // --- ESTADO UI ---
  currentStep = signal<number>(1);
  totalSteps = 3;
  
  progressWidth = computed(() => {
    return ((this.currentStep() - 1) / (this.totalSteps - 1)) * 100 + '%';
  });

  paymentMethod = signal<'QR' | 'CASH' | null>(null);

  // --- DATOS UBIGEO ---
  departamentos = signal<Ubigeo[]>([]);
  provincias = signal<Ubigeo[]>([]);
  distritos = signal<Ubigeo[]>([]);

  // --- FORMULARIO PRINCIPAL ---
  checkoutForm: FormGroup = this.fb.group({
    datosCliente: this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
    }),
    datosEnvio: this.fb.group({
      departamento: ['', Validators.required],
      provincia: [{ value: '', disabled: true }, Validators.required],
      distrito: [{ value: '', disabled: true }, Validators.required],
      direccion: ['', [Validators.required, Validators.minLength(10)]],
      referencia: ['']
    }),
    datosPago: this.fb.group({
      method: ['', Validators.required]
    })
  });

  ngOnInit() {
    this.ubigeoService.getDepartamentos().subscribe(data => this.departamentos.set(data));
    this.setupUbigeoListeners();
  }

  private setupUbigeoListeners() {
    this.checkoutForm.get('datosEnvio.departamento')?.valueChanges.subscribe(depId => {
      this.resetField('provincia');
      this.resetField('distrito');
      this.provincias.set([]);
      this.distritos.set([]);
      
      if (depId) {
        this.ubigeoService.getProvincias(depId).subscribe(data => this.provincias.set(data));
        this.checkoutForm.get('datosEnvio.provincia')?.enable();
      }
    });

    this.checkoutForm.get('datosEnvio.provincia')?.valueChanges.subscribe(provId => {
      this.resetField('distrito');
      this.distritos.set([]);

      if (provId) {
        this.ubigeoService.getDistritos(provId).subscribe(data => this.distritos.set(data));
        this.checkoutForm.get('datosEnvio.distrito')?.enable();
      }
    });
  }

  private resetField(fieldName: string) {
    const field = this.checkoutForm.get(`datosEnvio.${fieldName}`);
    field?.setValue('');
    field?.disable();
  }

  // --- NAVEGACIÓN INTELIGENTE ---
  
  // Nuevo método para manejar clics en el stepper
  goToStep(targetStep: number) {
    const current = this.currentStep();
    
    // 1. Si hace clic en el mismo paso, no hacer nada
    if (targetStep === current) return;

    // 2. Si quiere volver atrás (ej: de 3 a 1), SIEMPRE permitirlo
    if (targetStep < current) {
      this.currentStep.set(targetStep);
      return;
    }

    // 3. Si quiere avanzar haciendo clic (ej: de 1 a 3), validar los pasos intermedios
    // Para ir al paso 2, el paso 1 debe ser válido
    if (targetStep === 2) {
      if (this.isStep1Valid()) {
        this.currentStep.set(2);
      } else {
        this.checkoutForm.markAllAsTouched(); // Mostrar errores si intenta saltar sin llenar
      }
    }

    // Para ir al paso 3, paso 1 Y paso 2 deben ser válidos
    if (targetStep === 3) {
      if (this.isStep1Valid() && this.isStep2Valid()) {
        this.currentStep.set(3);
      } else {
        this.checkoutForm.markAllAsTouched();
      }
    }
  }

  // Validaciones auxiliares
  private isStep1Valid(): boolean {
    const cliente = this.checkoutForm.get('datosCliente');
    const envio = this.checkoutForm.get('datosEnvio');
    return (cliente?.valid && envio?.valid) ?? false;
  }

  private isStep2Valid(): boolean {
    return this.checkoutForm.get('datosPago')?.valid ?? false;
  }

  nextStep() {
    if (this.currentStep() === 1 && !this.isStep1Valid()) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    if (this.currentStep() === 2 && !this.isStep2Valid()) {
      return;
    }
    
    this.currentStep.update(v => Math.min(v + 1, this.totalSteps));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prevStep() {
    this.currentStep.update(v => Math.max(v - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selectPayment(method: 'QR' | 'CASH') {
    this.paymentMethod.set(method);
    this.checkoutForm.patchValue({ datosPago: { method } });
  }

  confirmOrder() {
    if (this.checkoutForm.valid) {
      console.log('Pedido:', this.checkoutForm.getRawValue());
      alert('¡Gracias por tu compra!');
    }
  }

  get nombreDepartamento() {
    const id = this.checkoutForm.get('datosEnvio.departamento')?.value;
    return this.departamentos().find(d => d.id === id)?.nombre;
  }
  
  get nombreDistrito() {
    const id = this.checkoutForm.get('datosEnvio.distrito')?.value;
    return this.distritos().find(d => d.id === id)?.nombre;
  }
}
