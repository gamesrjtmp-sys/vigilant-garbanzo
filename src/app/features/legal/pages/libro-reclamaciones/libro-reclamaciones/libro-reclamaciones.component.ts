import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LibroReclamacionesService } from '../../../../../core/services/libro-reclamaciones';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-libro-reclamaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './libro-reclamaciones.component.html',
  styleUrl: './libro-reclamaciones.component.scss'
})
export class LibroReclamacionesComponent {

  private fb = inject(FormBuilder);
  // Inyectamos el servicio que conecta con Google Sheets/Firebase
  public reclamacionesSrv = inject(LibroReclamacionesService);

  // --- ESTADOS DE LA UI (SIGNALS) ---
  enviando = signal(false);      // Controla el spinner y deshabilita el botón
  exito = signal(false);         // Controla si mostramos el formulario o el ticket de éxito
  codigoGenerado = signal('');   // Almacena el código que nos devuelve el servicio (Ej: REC-2025-001)

  // --- FORMULARIO REACTIVO ---
  claimForm: FormGroup = this.fb.group({
    // Validaciones "Gentleman": Estrictas pero no bloqueantes
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    documento: ['', [Validators.required, Validators.minLength(8)]], // DNI o CE
    
    // Teléfono: Usamos minLength(7) en vez de Regex complejo para evitar frustración
    telefono: ['', [Validators.required, Validators.minLength(7)]],
    
    email: ['', [Validators.required, Validators.email]],
    direccion: ['', Validators.required],
    
    // Tipo: Valor por defecto 'RECLAMO'
    tipo: ['RECLAMO', Validators.required],
    
    // Detalle: Mínimo 10 caracteres para que escriban algo con sentido
    detalle: ['', [Validators.required, Validators.minLength(10)]],
    
    // Pedido: Opcional, sin validadores
    pedido: [''] 
  });

  // --- LÓGICA DE ENVÍO ---
  async enviarReclamo() {
    // 1. Validación de seguridad
    if (this.claimForm.invalid) {
      this.claimForm.markAllAsTouched(); // Esto hace que los textos rojos (@if) aparezcan
      return;
    }

    // 2. Activar estado de carga (Spinner)
    this.enviando.set(true);

    try {
      // 3. Llamada al Servicio
      // El servicio debe devolver una promesa con el código generado
      const codigo = await this.reclamacionesSrv.registrarReclamacion(this.claimForm.value);
      
      // 4. Éxito
      this.codigoGenerado.set(codigo); // Guardamos el código
      this.exito.set(true);            // Cambiamos la vista al Ticket de Éxito
      
      // Opcional: Resetear form por si quiere enviar otro
      this.claimForm.reset({ tipo: 'RECLAMO' }); 

    } catch (error) {
      console.error('Error enviando reclamo:', error);
      alert('Hubo un problema de conexión. Por favor intenta nuevamente.');
    } finally {
      // 5. Siempre apagar el spinner, pase lo que pase
      this.enviando.set(false);
    }
  }
}
