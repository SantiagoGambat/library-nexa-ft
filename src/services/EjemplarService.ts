
import { apiRequest } from "./api";
import type {
  Ejemplar,
  EjemplarRequest,
} from "../models/Ejemplar";

const ENDPOINT = "/ejemplares";

export const ejemplarService = {
  list: () =>
    apiRequest<Ejemplar[]>(ENDPOINT),

  getById: (id: number) =>
    apiRequest<Ejemplar>(
      `${ENDPOINT}/${id}`
    ),

  listByBook: (libroId: number) =>
    apiRequest<Ejemplar[]>(
      `${ENDPOINT}/libro/${libroId}`
    ),

  listAvailableByIsbn: (isbn: string) =>
    apiRequest<Ejemplar[]>(
      `${ENDPOINT}/disponibles?isbn=${encodeURIComponent(isbn)}`
    ),

  create: (data: EjemplarRequest) =>
    apiRequest<Ejemplar>(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (
    id: number,
    data: EjemplarRequest
  ) =>
    apiRequest<Ejemplar>(
      `${ENDPOINT}/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    ),

  delete: (id: number) =>
    apiRequest<void>(
      `${ENDPOINT}/${id}`,
      {
        method: "DELETE",
      }
    ),
};
