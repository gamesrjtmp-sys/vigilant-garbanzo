import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Importante para redirigir
import { Ubigeo, UbigeoService } from '../../../core/services/ubigeo.service';
// 1. IMPORTAR EL SERVICIO DE CARRITO
import { CarritoService } from '../../../core/services/carrito.service';
import { ProductoDto } from '../../../core/models/dto/producto/productoDto';
import { ProductoService } from '../../../core/services/producto.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  
  private fb = inject(FormBuilder);
  private ubigeoService = inject(UbigeoService);
  private router = inject(Router);
  
  // 2. INYECTAR COMO PÚBLICO (Para usarlo en el HTML)
  public cartService = inject(CarritoService);

  // --- ESTADO UI ---
  currentStep = signal<number>(1);
  totalSteps = 3;
  
  // 1. ESTADO DE LA PANTALLA FINAL (SOLUCIÓN A TU ERROR)
  orderConfirmed = signal<boolean>(false); // <--- FALTABA ESTO: Controla si mostramos el éxito
  confirmedOrderData = signal<any>(null);  // <--- FALTABA ESTO: Guarda los datos para mostrar en el recibo

  private productoService = inject(ProductoService);
  // 2. Estado de UI
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
   // Productos sugeridos para el Cross-Selling (Paso 4)
  // Idealmente esto vendría de tu backend: "Productos relacionados"
  suggestedProducts = signal<ProductoDto[]>([]);

  cargarSugerencias() {
    // Lista de IDs que quieres sugerir (El extra + otros manuales)
    const idsSugeridos = [3002]; 

    // Limpiamos la lista antes de cargar
    this.suggestedProducts.set([]);

    idsSugeridos.forEach(id => {
      this.productoService.getProductByIdJson(id).subscribe({
        next: (data) => {
          if (data) {
            // ✅ USAMOS UPDATE: Tomamos la lista anterior y agregamos el nuevo
            this.suggestedProducts.update(lista => [...lista, data]);
          }
        },
        error: (err) => console.error(`Error cargando producto ${id}:`, err)
      });
    });
  }

  progressWidth = computed(() => {
    return ((this.currentStep() - 1) / (this.totalSteps - 1)) * 100 + '%';
  });

  paymentMethod = signal<'QR' | 'CASH' | null>(null);

  // --- DATOS UBIGEO ---
  departamentos = signal<Ubigeo[]>([]);
  provincias = signal<Ubigeo[]>([]);
  distritos = signal<Ubigeo[]>([]);

  // --- FORMULARIO ---
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
    this.selectPayment('CASH');
    this.cargarSugerencias();
  }

  // --- LÓGICA DE CONFIRMACIÓN (FINAL) ---
  confirmOrder() {
   if (this.checkoutForm.valid) {
      const orderPayload = {
        cliente: this.checkoutForm.value.datosCliente,
        envio: this.checkoutForm.value.datosEnvio,
        items: this.cartService.items(),
        total: this.cartService.grandTotal(),
        metodoPago: 'CASH',
        codigoPedido: 'ORD-' + Math.floor(Math.random() * 10000) // Simulación de ID
      };

      console.log('🎉 VENTA CERRADA:', orderPayload);
      
      this.confirmedOrderData.set(orderPayload);
      this.orderConfirmed.set(true); // Activamos la pantalla de éxito
      
      // Limpiamos el carrito actual para que pueda empezar uno nuevo
      this.cartService.items.set([]);
      this.cartService.isOpen.set(false);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.checkoutForm.markAllAsTouched();
    }
  }

  // --- MÉTODO PARA AGREGAR SUGERENCIA ---
  addSuggestionToNewCart(product: ProductoDto) {
    this.cartService.addToCart(product);
    // Opcional: Mostrar un toast o abrir el carrito
    alert('¡Agregado! Empieza tu siguiente pedido.');
  }

  // ... (RESTO DE TUS MÉTODOS: setupUbigeoListeners, resetField, goToStep, etc.) ...
  // Mantenlos igual que en tu código anterior, no cambian.
  
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

  goToStep(targetStep: number) {
    const current = this.currentStep();
    if (targetStep === current) return;
    if (targetStep < current) {
      this.currentStep.set(targetStep);
      return;
    }
    if (targetStep === 2) {
      if (this.isStep1Valid()) this.currentStep.set(2);
      else this.checkoutForm.markAllAsTouched();
    }
    if (targetStep === 3) {
      if (this.isStep1Valid() && this.isStep2Valid()) this.currentStep.set(3);
      else this.checkoutForm.markAllAsTouched();
    }
  }

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
    if (this.currentStep() === 2 && !this.isStep2Valid()) return;
    
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

  get nombreDepartamento() {
    const id = this.checkoutForm.get('datosEnvio.departamento')?.value;
    return this.departamentos().find(d => d.id === id)?.nombre;
  }
  
  get nombreDistrito() {
    const id = this.checkoutForm.get('datosEnvio.distrito')?.value;
    return this.distritos().find(d => d.id === id)?.nombre;
  }
}