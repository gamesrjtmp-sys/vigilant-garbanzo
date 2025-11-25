import { UbigeoDto } from "../models/dto/ubigeo/ubigeoDto";
import { Ubigeo } from "../services/ubigeo.service";

export function mapUbigeo(raw: UbigeoDto): Ubigeo {
  return {
    id: raw.id,
    // Mapeamos 'name' (inglés/raw) a 'nombre' (dominio)
    // Agregamos un fallback 'Sin nombre' por seguridad
    nombre: raw.name ?? 'Sin nombre'
  };
}