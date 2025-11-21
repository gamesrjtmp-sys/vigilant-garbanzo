import { Injectable, signal, computed } from '@angular/core';
import { ProductoDto } from '../models/dto/producto/productoDto';
import { CarritoItem } from '../models/api/carrito/carrito';

export interface CartItem {
  product: ProductoDto;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  // Estado de visibilidad del Drawer (Abierto/Cerrado)
  isOpen = signal(false);

  // Estado de los items
  items = signal<CarritoItem[]>([
    // Datos Mock para que se vea igual a tu foto
    {
      product: {
        id: 1,
        Nombre: 'Gimnasio de Madera',
        Precio: 367.00,
        Imagenes: ['assets/images/pelota.jpg'] // Asegúrate de tener esta imagen o usa un placeholder
      },
      quantity: 1
    }
  ]);

  // Recomendaciones (Cross-selling)
  upsellItems = signal<ProductoDto[]>([
    {
      id: 99,
      Nombre: 'Puerta de Seguridad',
      Precio: 200.00,
      Imagenes: ['assets/images/pelota.jpg']
    }
  ]);

  // --- Computed Signals (Cálculos Automáticos) ---

  // Subtotal
  subtotal = computed(() => 
    this.items().reduce((acc, item) => acc + (item.product.Precio * item.quantity), 0)
  );

  // Descuentos (Lógica simple: diferencia entre original y actual)
  totalDiscount = computed(() => 
    this.items().reduce((acc, item) => {
      const original = item.product.Precio || item.product.Precio;
      return acc + ((original - item.product.Precio) * item.quantity);
    }, 0)
  );

  // Meta para envío gratis (S/ 300.00 según lógica visual)
  readonly freeShippingThreshold = 300;
  
  // Porcentaje para la barra de progreso (0 a 100)
  shippingProgress = computed(() => {
    const current = this.subtotal();
    if (current >= this.freeShippingThreshold) return 100;
    return (current / this.freeShippingThreshold) * 100;
  });

  // --- Acciones ---

  toggleCart() {
    this.isOpen.update(v => !v);
  }

  updateQuantity(id: number, change: number) {
    this.items.update(items => 
      items.map(item => {
        if (item.product.id === id) {
          const newQty = item.quantity + change;
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      })
    );
  }

  removeItem(id: number) {
    this.items.update(items => items.filter(i => i.product.id !== id));
  }

  addUpsellItem(product: ProductoDto) {
    // Lógica para mover de upsell al carrito real
    this.items.update(prev => [...prev, { product, quantity: 1 }]);
  }
}
