import { apiRequest } from "./api";
import type { Usuario } from "../models/Usuario";

const ENDPOINT = "/usuarios";

export const usuariosService = {
  listar: () =>
    apiRequest<Usuario[]>(ENDPOINT),

  obtener: (id: number) =>
    apiRequest<Usuario>(`${ENDPOINT}/${id}`),

  crear: (usuario: Usuario) =>
    apiRequest<Usuario>(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(usuario),
    }),

  actualizar: (id: number, usuario: Usuario) =>
    apiRequest<Usuario>(`${ENDPOINT}/${id}`, {
      method: "PUT",
      body: JSON.stringify(usuario),
    }),

  eliminar: (id: number) =>
    apiRequest<void>(`${ENDPOINT}/${id}`, {
      method: "DELETE",
    }),
};
