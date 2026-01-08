import { Injectable, signal, computed, inject } from '@angular/core';
import { ProductoDto } from '../models/dto/producto/productoDto';
import { CatalogoService } from './catalogo.service';
import { map } from 'rxjs';

// Interfaz para el item del carrito
export interface CartItem {
  product: ProductoDto;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private catalogoService = inject(CatalogoService);
  // 1. ESTADO (SIGNALS)
  
  // Controla si el drawer lateral está visible
  isOpen = signal(false);
  
  // Lista de productos en el carrito
  items = signal<CartItem[]>([]);

  // Productos sugeridos (Upsell) que se muestran abajo en el carrito
  upsellItems = signal<ProductoDto[]>([]);

  constructor() {
    // Cargamos datos iniciales (Mock ID 101 por ejemplo)
    this.loadUpsellProducts(101); 
  }

  private loadUpsellProducts(idSubcategoria: number) {
    
    this.catalogoService.getProductosBySubcategoria(idSubcategoria)
      .pipe(
        // 🟢 MAPEO: Aquí transformamos el JSON "sucio" al DTO "limpio"
        map(productosJson => productosJson.map(item => ({
          id: item.idProducto,
          Nombre: item.nombreProducto,
          Precio: item.precio,
          // El JSON trae 1 string 'imagen', el DTO quiere array 'Imagenes[]'
          Imagenes: item.imagenes ? [item.imagenes] : ['assets/images/pelota.jpg'],
          //Descripcion: item.descripcion || '',
          Stock: 10 // Valor por defecto si no viene del back
        } as ProductoDto)))
      )
      .subscribe({
        next: (productosMapeados) => {
          // Ahora sí coinciden los tipos
          // Tomamos solo los primeros 4 para no llenar el carrito de sugerencias
          this.upsellItems.set(productosMapeados.slice(0, 4));
        },
        error: (err) => console.error('Error cargando sugerencias:', err)
      });
  }

  // 2. CÁLCULOS AUTOMÁTICOS (COMPUTED)

  // Cantidad total de items (para el badge del icono)
  count = computed(() => 
    this.items().reduce((acc, item) => acc + item.quantity, 0)
  );

  // Suma de precios base
  subtotal = computed(() => 
    this.items().reduce((acc, item) => acc + (item.product.Precio * item.quantity), 0)
  );

  // Cálculo de descuentos (si existiera precio original vs precio actual)
  totalDiscount = computed(() => 
    this.items().reduce((acc, item) => {
      // Si tu DTO no tiene 'PrecioOriginal', asume 0 descuento por ahora
      // Si lo tiene, sería: (item.product.PrecioOriginal - item.product.Precio) * item.quantity
      return 0; 
    }, 0)
  );

  // Meta para envío gratis (S/ 300.00)
  readonly freeShippingThreshold = 100;
  
  // Costo de envío (0 si supera la meta, 15 si no)
  deliveryCost = computed(() => {
    if (this.subtotal() >= this.freeShippingThreshold) return 0;
    return 15; 
  });

  // Porcentaje para la barra de progreso (0 a 100)
  shippingProgress = computed(() => {
    const current = this.subtotal();
    if (current >= this.freeShippingThreshold) return 100;
    return (current / this.freeShippingThreshold) * 100;
  });

  // Total Final a Pagar (Subtotal - Descuento + Envío)
  grandTotal = computed(() => {
    return this.subtotal() - this.totalDiscount() + this.deliveryCost();
  });


  // 3. ACCIONES (MÉTODOS)

  // Abrir/Cerrar el carrito
  toggleCart() {
    this.isOpen.update(v => !v);
  }

  // Añadir un producto al carrito (Lógica general)
  addToCart(product: ProductoDto, quantity: number = 1) {
    const currentItems = this.items();
    const existingItem = currentItems.find(i => i.product.id === product.id);

    if (existingItem) {
      this.updateQuantity(product.id, quantity);
    } else {
      this.items.update(prev => [...prev, { product, quantity }]);
    }
    this.isOpen.set(true); // Abrir carrito al agregar
  }

  // Método especial "Comprar Ahora" (Va directo al checkout con 1 item)
  buyNow(product: ProductoDto) {
    this.items.set([{ product, quantity: 1 }]);
    this.isOpen.set(false); // Cerramos el drawer para ir al checkout
  }

  // Actualizar cantidad (+1 o -1)
  updateQuantity(productId: number, change: number) {
    this.items.update(items => 
      items.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + change;
          // Evitamos cantidades negativas o cero aquí si queremos, o lo manejamos con removeItem
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      })
    );
  }

  // Eliminar item
  removeItem(productId: number) {
    this.items.update(items => items.filter(i => i.product.id !== productId));
  }

  // Mover del upsell al carrito principal
  addUpsellItem(product: ProductoDto) {
    this.addToCart(product);
    // Opcional: Remover de la lista de sugerencias para que no salga de nuevo
    // this.upsellItems.update(list => list.filter(i => i.id !== product.id));
  }

  getProductImage(product: ProductoDto): string {
    // Verificamos si 'Imagenes' existe y tiene al menos un elemento
    if (product.Imagenes && product.Imagenes.length > 0) {
      return product.Imagenes[0];
    }
    // Retorna una imagen placeholder si no hay datos (asegúrate de tener esta imagen en assets)
    return 'assets/images/placeholder.png'; 
  }
}