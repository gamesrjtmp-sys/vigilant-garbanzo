import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Ubigeo, UbigeoService } from '../../../core/services/ubigeo.service';
import { CarritoService } from '../../../core/services/carrito.service';
import { ProductoService } from '../../../core/services/producto.service';
import { ProductoDto } from '../../../core/models/dto/producto/productoDto';
import { PedidosService } from '../../../core/services/pedidos.service';

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
  private productoService = inject(ProductoService);
  private pedidosService = inject(PedidosService);
  private router = inject(Router);
  
  // Inyectado como PÚBLICO para usarlo en el HTML (Resumen de precios)
  public cartService = inject(CarritoService);

  // --- ESTADO UI ---
  currentStep = signal<number>(1);
  totalSteps = 3;
  
  // Estado para la Pantalla Final (Thank You Page)
  orderConfirmed = signal<boolean>(false); 
  confirmedOrderData = signal<any>(null); 
  
  // Estado de carga y errores
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Productos sugeridos (Cross-selling) para la pantalla final
  suggestedProducts = signal<ProductoDto[]>([]);

  codigoCopiado = signal(false);

  // Barra de progreso
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
    
    // Seleccionamos CASH por defecto para mejor UX
    this.selectPayment('CASH');
    
    // Cargamos sugerencias para la pantalla final
    this.cargarSugerencias();
  }

  // Carga productos sugeridos (Ej: Máquina Barber Pro)
  cargarSugerencias() {
    const idsSugeridos = [3002]; // IDs que quieres recomendar
    this.suggestedProducts.set([]); // Limpiar antes de cargar

    idsSugeridos.forEach(id => {
      // Corrección: Usamos 'getProductById' que definimos en el servicio
      this.productoService.getProductById(id).subscribe({
        next: (data) => {
          if (data) {
            this.suggestedProducts.update(lista => [...lista, data]);
          }
        },
        error: (err) => console.error(`Error cargando sugerencia ${id}:`, err)
      });
    });
  }

 async confirmOrder() {
    if (this.checkoutForm.valid) {
      
      // 1. Activar estado de carga (Muestra spinner en botón y lo deshabilita)
      this.loading.set(true);

      const orderPayload = {
        cliente: this.checkoutForm.value.datosCliente,
        envio: this.checkoutForm.value.datosEnvio,
        items: this.cartService.items(),
        total: this.cartService.grandTotal(),
        metodoPago: 'CASH',
        codigoPedido: this.generateOrderCode() 
      };

      try {
        // 2. Esperar a que el servicio guarde en Google Sheets (Promesa)
        await this.pedidosService.registrarPedido(orderPayload);
        
        console.log('🎉 VENTA GUARDADA CORRECTAMENTE');
        
        // 3. SOLO SI HUBO ÉXITO: Mostramos la pantalla final
        this.confirmedOrderData.set(orderPayload);
        this.orderConfirmed.set(true); 
        
        // Limpiamos el carrito y cerramos drawer
        this.cartService.items.set([]);
        this.cartService.isOpen.set(false);
        
        // Scroll arriba suave para ver el mensaje de éxito
        window.scrollTo({ top: 0, behavior: 'smooth' });

      } catch (error) {
        console.error('Error al guardar pedido:', error);
        alert('Hubo un problema de conexión al procesar tu pedido. Por favor intenta de nuevo.');
        // Aquí NO cambiamos orderConfirmed a true, permitimos reintentar
      } finally {
        // 4. Apagar carga siempre (éxito o error) para desbloquear la UI
        this.loading.set(false);
      }

    } else {
      // Si el formulario es inválido, marcamos campos en rojo
      this.checkoutForm.markAllAsTouched();
    }
  }

  private generateOrderCode(): string {
    const now = new Date();
    
    // 1. Obtener Fecha (DDMM)
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    
    // 2. Obtener Hora (HHmm) para mayor precisión
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    // 3. Generar parte aleatoria segura (4 caracteres)
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    // Resultado: ORD-25121430-X9K2 (DíaMesHoraMinuto-Random)
    return `ORD-${day}${month}${hours}${minutes}-${random}`;
  }

  // --- AGREGAR SUGERENCIA AL NUEVO CARRITO ---
  addSuggestionToNewCart(product: ProductoDto) {
    this.cartService.addToCart(product);
    alert('¡Producto agregado para tu próxima compra!');
  }

  // --- MÉTODOS DE FORMULARIO Y NAVEGACIÓN ---

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
    
    // Permitir volver atrás siempre
    if (targetStep < current) {
      this.currentStep.set(targetStep);
      return;
    }
    
    // Validar antes de avanzar
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

  copiarCodigo() {
    const data = this.confirmedOrderData();
    // Aseguramos que exista el dato. En tu objeto se llama 'codigoPedido'
    const codigo = data?.codigoPedido || data?.id; 

    if (codigo) {
      // API moderna del portapapeles
      navigator.clipboard.writeText(codigo).then(() => {
        this.codigoCopiado.set(true);
        
        // Resetear el estado después de 2 segundos
        setTimeout(() => {
          this.codigoCopiado.set(false);
        }, 2000);
      }).catch(err => {
        console.error('Error al copiar:', err);
        // Fallback para navegadores viejos o sin permisos
        alert('Copia este código manualmente: ' + codigo);
      });
    }
  }
}