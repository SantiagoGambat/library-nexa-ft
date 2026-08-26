export interface Libro {
  id?: number;
  isbn: string;
  titulo: string;
  autor: string;
  editorial?: string;
  anioPublicacion?: number;
}
