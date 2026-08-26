import { apiRequest } from "./api";
import type { Libro } from "../models/Libro";

const ENDPOINT = "/libros";

export const booksService = {
  list: () =>
    apiRequest<Libro[]>(ENDPOINT),

  getById: (id: number) =>
    apiRequest<Libro>(`${ENDPOINT}/${id}`),

  create: (book: Libro) =>
    apiRequest<Libro>(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(book),
    }),

  update: (id: number, book: Libro) =>
    apiRequest<Libro>(`${ENDPOINT}/${id}`, {
      method: "PUT",
      body: JSON.stringify(book),
    }),

  delete: (id: number) =>
    apiRequest<void>(`${ENDPOINT}/${id}`, {
      method: "DELETE",
    }),
};
