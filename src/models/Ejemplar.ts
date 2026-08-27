export interface Ejemplar {
  id?: number;
  codigoInventario: string;
  libroId: number;
  isbn: string;
  titulo: string;
  disponible: boolean;
}

export interface EjemplarRequest {
  libroId: number;
  codigoInventario: string;
}