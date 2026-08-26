import Button from "../../components/commons/Button";
import type { Usuario } from "../../models/Usuario";

interface UsuarioTableProps {
  usuarios: Usuario[];
  loading: boolean;
  deletingId: number | null;
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
}

export default function UsuarioTable({
  usuarios,
  loading,
  deletingId,
  onEdit,
  onDelete,
}: UsuarioTableProps) {
  if (loading) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Usuario
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Fecha nacimiento
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {usuarios.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center"
                >
                  <p className="text-sm font-medium text-slate-600">
                    No hay usuarios registrados.
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Crea el primer usuario para comenzar.
                  </p>
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr
                  key={usuario.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 font-semibold text-teal-700">
                        {usuario.nombre
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="font-medium text-slate-900">
                          {usuario.nombre}{" "}
                          {usuario.apellido}
                        </p>

                        <p className="text-xs text-slate-400">
                          ID #{usuario.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {usuario.email}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {usuario.fechaNacimiento}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        disabled={deletingId !== null}
                        onClick={() =>
                          onEdit(usuario)
                        }
                      >
                        Editar
                      </Button>

                      <Button
                        variant="danger"
                        disabled={deletingId !== null}
                        onClick={() =>
                          onDelete(usuario!)
                        }
                      >
                        {deletingId === usuario.id
                          ? "Eliminando..."
                          : "Eliminar"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
