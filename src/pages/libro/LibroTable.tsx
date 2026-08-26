import Button from "../../components/commons/Button";
import Loader from "../../components/commons/Loader";
import type { Libro } from "../../models/Libro";

interface LibroTableProps {
  libros: Libro[];
  loading: boolean;
  onEdit: (libro: Libro) => void;
  onDelete: (libro: Libro) => void;
}

export default function LibroTable({
  libros,
  loading,
  onEdit,
  onDelete,
}: LibroTableProps) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Loader message="Cargando libros..." />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Libro
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                ISBN
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Autor
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Edición
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Publicación
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {libros.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center"
                >
                  <p className="text-sm font-medium text-slate-600">
                    No hay libros registrados.
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Crea el primer libro para comenzar.
                  </p>
                </td>
              </tr>
            ) : (
              libros.map((libro) => (
                <tr
                  key={libro.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-700">
                        📚
                      </div>

                      <div>
                        <p className="font-medium text-slate-900">
                          {libro.titulo}
                        </p>

                        <p className="text-xs text-slate-400">
                          ID #{libro.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {libro.isbn}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {libro.autor}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {libro.edicion}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {libro.fechaPublicacion || "—"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => onEdit(libro)}
                        disabled={loading}
                      >
                        Editar
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => onDelete(libro)}
                        disabled={loading}
                      >
                        Eliminar
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
