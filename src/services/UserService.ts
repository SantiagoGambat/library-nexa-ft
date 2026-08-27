import { apiRequest } from "./api";
import type { Usuario } from "../models/Usuario";

const ENDPOINT = "/usuarios";

export const usersService = {
  list: () =>
    apiRequest<Usuario[]>(ENDPOINT),

  getById: (id: number) =>
    apiRequest<Usuario>(`${ENDPOINT}/${id}`),

  create: (user: Usuario) =>
    apiRequest<Usuario>(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(user),
    }),

  update: (id: number, user: Usuario) =>
    apiRequest<Usuario>(`${ENDPOINT}/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
    }),

  delete: (id: number) =>
    apiRequest<void>(`${ENDPOINT}/${id}`, {
      method: "DELETE",
    }),
};
