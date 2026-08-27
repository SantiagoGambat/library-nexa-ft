export interface Prestamo {
  id?: number;
  usuarioId: number;
  isbn: string;
  ejemplarId: number;
  fechaPrestamo: string;
  fechaDevolucion: string;
  estadoPrestamo: string;
}