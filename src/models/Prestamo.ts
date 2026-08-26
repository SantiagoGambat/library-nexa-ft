export interface Prestamo {
  id?: number;
  usuarioId: number;
  ejemplarId: number;
  fechaPrestamo: string;
  fechaDevolucion?: string;
  estado?: string;
}
