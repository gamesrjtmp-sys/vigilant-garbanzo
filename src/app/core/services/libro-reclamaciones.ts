import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LibroReclamacionesService {

  private http = inject(HttpClient);
  
  // ⚠️ REEMPLAZA ESTO CON LA URL QUE TE DIO GOOGLE APPS SCRIPT
  private readonly GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxQODzPrElwr4uv2R-RrteMRCFwiX24z8PD2OyjATl34Zwi75f12TDgrR8nwy3Ut_FP/exec';

  registrarReclamacion(formValue: any): Promise<string> {
    return new Promise((resolve, reject) => {
      
      const correlativo = `REC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;

      // Preparamos el payload plano para el script
      const payload = {
        id: crypto.randomUUID(),
        codigo: correlativo,
        tipo: formValue.tipo,
        nombre: formValue.nombre,
        documento: formValue.documento,
        telefono: formValue.telefono,
        email: formValue.email,
        detalle: formValue.detalle
      };

      // Enviamos usando la API nativa fetch para manejar mejor el redireccionamiento de Google
      // Angular HttpClient a veces se queja de CORS con Google Scripts
      fetch(this.GOOGLE_SHEET_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      .then(() => {
        // Google devuelve un redirect opaco en modo simple, asumimos éxito si no explota
        console.log('✅ Enviado a Google Sheets');
        resolve(correlativo);
      })
      .catch(error => {
        console.error('Error enviando a Sheet', error);
        reject(error);
      });
    });
  }
}