import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

   currentYear = signal(new Date().getFullYear());
  
  // Datos de contacto (Centralizados por si cambian)
  contactInfo = {
    whatsapp: '+51 929109810',
    email: 'soporte.cliente.pedido@gmail.com',
    direccion: 'Tacna - Zona Franca'
  };

  socialLinks = [
    { name: 'Instagram', icon: '📸', url: '#' },
    { name: 'Facebook', icon: '👍', url: '#' },
    { name: 'TikTok', icon: '🎵', url: '#' }
  ];
}
