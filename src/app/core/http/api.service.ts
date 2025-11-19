import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/api/producto/producto';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'https://api-generator.retool.com/07CPr1'; // ajusta si tu API tiene prefijo /v1

  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: Record<string, any>): Observable<T> {
    const p = new HttpParams({ fromObject: params ?? {} });
    return this.http.get<T>(`${this.base}/${path}`, { params: p });
  }
  // get<T>(path: string, params?: Record<string, any>): Observable<T> {
  //  const productoEjemplo: Producto = {
  //   Id: 42,
  //   Nombre: "Monitor Curvo G-500",
  //   Precio: 35999, // Representa 359.99 (en unidades monetarias)
  //   Imagenes: null,
  //   Descripcion: "Monitor LED curvo de 34 pulgadas. 144Hz. Ideal para gaming y diseño.",
  //   Stock: 15
  // };

  // return productoEjemplo as unknown as Observable<T>;
  // }

  post<T>(path: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.base}/${path}`, body, { headers });
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.base}/${path}`, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.base}/${path}`);
  }
}