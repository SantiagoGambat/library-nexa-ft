import { apiRequest } from "./api";
import type { Prestamo } from "../models/Prestamo";

const ENDPOINT = "/prestamos";

export const loansService = {
  list: () =>
    apiRequest<Prestamo[]>(ENDPOINT),

  create: (loan: Prestamo) =>
    apiRequest<Prestamo>(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(loan),
    }),

  byUser: (userId: number) =>
    apiRequest<Prestamo[]>(
      `${ENDPOINT}/usuario/${userId}`,
    ),

  byBook: (bookId: number) =>
    apiRequest<Prestamo[]>(
      `${ENDPOINT}/libro/${bookId}`,
    ),

  availableCopies: (isbn: string) =>
    apiRequest<unknown[]>(
      `${ENDPOINT}/ejemplares-disponibles/${isbn}`,
    ),
};
