import { Component, ElementRef, EventEmitter, HostListener, inject, Output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CatalogoService } from '../../../../core/services/catalogo.service';
import { CarritoService } from '../../../../core/services/carrito.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  public router = inject(Router);
  public carrito = inject(CarritoService);

  // Estados UI
  public mobileOpen = signal(false);
  public catalogDropdownOpen = signal(false);
  public searchQuery = signal('');

  toggleMobile() {
    this.mobileOpen.update(v => !v);
  }

  toggleCatalogDropdown() {
    this.catalogDropdownOpen.update(v => !v);
  }
  
  // Método explícito para cerrar (más seguro que toggle en ciertos casos)
  closeDropdown() {
    this.catalogDropdownOpen.set(false);
  }

  onSearchSubmit() {
    const q = this.searchQuery();
    if (!q || q.trim().length === 0) return;
    this.router.navigate(['/catalogo'], { queryParams: { q } });
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
