import { Component, signal } from '@angular/core';
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
   // estado local (UI)
  public mobileOpen = signal(false);
  public catalogDropdownOpen = signal(false);
  public searchQuery = signal('');

  constructor(
  public router: Router, 
  public carrito: CarritoService) {}

  toggleMobile() {
    this.mobileOpen.update(v => !v);
  }

  toggleCatalogDropdown() {
    this.catalogDropdownOpen.update(v => !v);
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
