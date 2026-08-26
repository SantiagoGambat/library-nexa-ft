import { apiRequest } from "./api";
import type { Prestamo } from "../models/Prestamo";

const ENDPOINT = "/prestamos";

export const prestamosService = {
  listar: () =>
    apiRequest<Prestamo[]>(ENDPOINT),

  crear: (prestamo: Prestamo) =>
    apiRequest<Prestamo>(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(prestamo),
    }),

  porUsuario: (usuarioId: number) =>
    apiRequest<Prestamo[]>(`${ENDPOINT}/usuario/${usuarioId}`),

  porLibro: (libroId: number) =>
    apiRequest<Prestamo[]>(`${ENDPOINT}/libro/${libroId}`),

  ejemplaresDisponibles: (isbn: string) =>
    apiRequest<unknown[]>(`${ENDPOINT}/ejemplares-disponibles/${isbn}`),
};
