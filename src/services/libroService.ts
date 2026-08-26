import { apiRequest } from "./api";
import type { Libro } from "../models/Libro";

const ENDPOINT = "/libros";

export const librosService = {
  listar: () =>
    apiRequest<Libro[]>(ENDPOINT),

  obtener: (id: number) =>
    apiRequest<Libro>(`${ENDPOINT}/${id}`),

  crear: (libro: Libro) =>
    apiRequest<Libro>(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(libro),
    }),

  actualizar: (id: number, libro: Libro) =>
    apiRequest<Libro>(`${ENDPOINT}/${id}`, {
      method: "PUT",
      body: JSON.stringify(libro),
    }),

  eliminar: (id: number) =>
    apiRequest<void>(`${ENDPOINT}/${id}`, {
      method: "DELETE",
    }),
};
