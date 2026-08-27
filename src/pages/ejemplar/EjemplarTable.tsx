import { useEffect, useMemo, useState } from "react";

import Button from "../../components/commons/Button";
import type { Ejemplar } from "../../models/Ejemplar";

interface EjemplarTableProps {
  ejemplares: Ejemplar[];
  loading: boolean;
  onEdit: (ejemplar: Ejemplar) => void;
  onDelete: (ejemplar: Ejemplar) => void;
}

const PAGE_SIZE = 2;

export default function EjemplarTable({
  ejemplares,
  loading,
  onEdit,
  onDelete,
}: EjemplarTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(ejemplares.length / PAGE_SIZE);

  const paginatedEjemplares = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;

    return ejemplares.slice(start, start + PAGE_SIZE);
  }, [ejemplares, currentPage]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const firstItem =
    ejemplares.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;

  const lastItem = Math.min(currentPage * PAGE_SIZE, ejemplares.length);

  if (loading) {
    return (
      <div className="py-10 text-center text-sm text-slate-500">
        Cargando ejemplares...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white  ">
      <div className="overflow-x-auto">
        <table className="w-full text-left ">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Código
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Libro
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                ISBN
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Estado
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {ejemplares.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <p className="text-sm font-medium text-slate-600">
                    No hay ejemplares registrados.
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Crea el primer ejemplar para este libro.
                  </p>
                </td>
              </tr>
            ) : (
              paginatedEjemplares.map((ejemplar) => (
                <tr key={ejemplar.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-sm font-bold text-teal-700">
                        #
                      </div>

                      <div>
                        <p className="font-medium text-slate-900">
                          {ejemplar.codigoInventario}
                        </p>

                        <p className="text-xs text-slate-400">
                          ID #{ejemplar.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {ejemplar.titulo}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {ejemplar.isbn}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        ejemplar.disponible
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {ejemplar.disponible ? "Disponible" : "Prestado"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        disabled={loading || !ejemplar.disponible}
                        onClick={() => onEdit(ejemplar)}
                        title={
                          !ejemplar.disponible
                            ? "No puedes editar un ejemplar que está prestado"
                            : "Editar ejemplar"
                        }
                      >
                        Editar
                      </Button>

                      <Button
                        variant="danger"
                        disabled={loading || !ejemplar.disponible}
                        onClick={() => onDelete(ejemplar)}
                        title={
                          !ejemplar.disponible
                            ? "No puedes eliminar un ejemplar que está prestado"
                            : "Eliminar ejemplar"
                        }
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

      {/* PAGINACIÓN */}
      {ejemplares.length > 0 && (
        <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Mostrando{" "}
            <span className="font-medium text-slate-700">{firstItem}</span> a{" "}
            <span className="font-medium text-slate-700">{lastItem}</span> de{" "}
            <span className="font-medium text-slate-700">
              {ejemplares.length}
            </span>{" "}
            ejemplares
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            >
              Anterior
            </Button>

            <span className="min-w-20 text-center text-sm text-slate-600">
              {currentPage} / {totalPages}
            </span>

            <Button
              variant="secondary"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, totalPages))
              }
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
