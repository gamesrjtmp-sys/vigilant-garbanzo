import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PedidosService {

  private readonly GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzIe2raWV58BT02XG7ZQ4VVRtDN9R0T7sEAVQFrkrB-y_FG1r7Tqd6a_dzttcBHuV9Yfg/exec';

  registrarPedido(pedido: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const payload = {
        id: pedido.codigoPedido,
        fecha: new Date().toISOString(),
        cliente: pedido.cliente.name,
        telefono: pedido.cliente.phone,
        email: pedido.cliente.email,
        direccion: `${pedido.envio.direccion} - ${pedido.envio.distrito}, ${pedido.envio.departamento}`,
        total: pedido.total,
        metodoPago: pedido.metodoPago,
        productos: pedido.items.map((i: any) => `${i.quantity}x ${i.product.Nombre}`).join(', '),
        estado: 'PENDIENTE_REVISION'
      };

      fetch(this.GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(() => {
        // Asumimos éxito si la red no falló
        console.log('✅ Pedido enviado a Google Sheets');
        resolve(true);
      })
      .catch(error => {
        console.error('❌ Error enviando pedido:', error);
        reject(error);
      });

    });
  }
}