import { useEffect, useMemo, useState } from "react";

import Button from "../../components/commons/Button";
import type { Libro } from "../../models/Libro";
import EjemplaresModal from "../ejemplar/EjemplaresModal";

interface LibroTableProps {
  libros: Libro[];
  loading: boolean;
  onEdit: (libro: Libro) => void;
  onDelete: (libro: Libro) => void;
}

const PAGE_SIZE = 5;

export default function BookTable({
  libros,
  loading,
  onEdit,
  onDelete,
}: LibroTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(libros.length / PAGE_SIZE);

  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    const endIndex = startIndex + PAGE_SIZE;

    return libros.slice(startIndex, endIndex);
  }, [libros, currentPage]);

  const [selectedBook, setSelectedBook] = useState<Libro | null>(null);

  const [ejemplaresOpen, setEjemplaresOpen] = useState(false);

  const handleOpenEjemplares = (libro: Libro) => {
    setSelectedBook(libro);
    setEjemplaresOpen(true);
  };

  const handleCloseEjemplares = () => {
    setEjemplaresOpen(false);
    setSelectedBook(null);
  };

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePreviousPage = () => {
    setCurrentPage((previous) => Math.max(previous - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((previous) => Math.min(previous + 1, totalPages));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const firstItem = libros.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;

  const lastItem = Math.min(currentPage * PAGE_SIZE, libros.length);

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
                <td colSpan={6} className="px-6 py-12 text-center">
                  <p className="text-sm font-medium text-slate-600">
                    No hay libros registrados.
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Crea el primer libro para comenzar.
                  </p>
                </td>
              </tr>
            ) : (
              paginatedBooks.map((libro) => (
                <tr key={libro.id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-700">
                        📚
                      </div>

                      <div>
                        <p className="font-medium text-slate-900">
                          {libro.titulo}
                        </p>

                        <p className="text-xs text-slate-400">ID #{libro.id}</p>
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
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => handleOpenEjemplares(libro)}
                        disabled={loading}
                      >
                        Ejemplares
                      </Button>

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

      {/* PAGINACIÓN */}
      {libros.length > 0 && (
        <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Mostrando{" "}
            <span className="font-medium text-slate-700">{firstItem}</span> a{" "}
            <span className="font-medium text-slate-700">{lastItem}</span> de{" "}
            <span className="font-medium text-slate-700">{libros.length}</span>{" "}
            libros
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="secondary"
              disabled={currentPage === 1}
              onClick={handlePreviousPage}
            >
              Anterior
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition ${
                      currentPage === page
                        ? "bg-teal-600 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <Button
              variant="secondary"
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
      <EjemplaresModal
        libro={selectedBook}
        open={ejemplaresOpen}
        onClose={handleCloseEjemplares}
      />
    </div>
  );
}
