import { useEffect, useMemo, useState } from "react";

import Button from "../../components/commons/Button";
import type { Usuario } from "../../models/Usuario";

interface UsuarioTableProps {
  usuarios: Usuario[];
  loading: boolean;
  deletingId: number | null;
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
}

const PAGE_SIZE = 5;

export default function UserTable({
  usuarios,
  loading,
  deletingId,
  onEdit,
  onDelete,
}: UsuarioTableProps) {
  const [currentPage, setCurrentPage] =
    useState(1);

  const totalPages = Math.ceil(
    usuarios.length / PAGE_SIZE
  );

  const paginatedUsers = useMemo(() => {
    const startIndex =
      (currentPage - 1) * PAGE_SIZE;

    const endIndex =
      startIndex + PAGE_SIZE;

    return usuarios.slice(
      startIndex,
      endIndex
    );
  }, [usuarios, currentPage]);

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePreviousPage = () => {
    setCurrentPage((previous) =>
      Math.max(previous - 1, 1)
    );
  };

  const handleNextPage = () => {
    setCurrentPage((previous) =>
      Math.min(
        previous + 1,
        totalPages
      )
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const firstItem =
    usuarios.length === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const lastItem = Math.min(
    currentPage * PAGE_SIZE,
    usuarios.length
  );

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
              paginatedUsers.map((usuario) => (
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
                        disabled={
                          deletingId !== null
                        }
                        onClick={() =>
                          onEdit(usuario)
                        }
                      >
                        Editar
                      </Button>

                      <Button
                        variant="danger"
                        disabled={
                          deletingId !== null
                        }
                        onClick={() =>
                          onDelete(usuario)
                        }
                      >
                        {deletingId ===
                        usuario.id
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

      {/* Pagination */}
      {usuarios.length > 0 && (
        <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Mostrando{" "}
            <span className="font-medium text-slate-700">
              {firstItem}
            </span>{" "}
            a{" "}
            <span className="font-medium text-slate-700">
              {lastItem}
            </span>{" "}
            de{" "}
            <span className="font-medium text-slate-700">
              {usuarios.length}
            </span>{" "}
            usuarios
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="secondary"
              disabled={
                currentPage === 1 ||
                deletingId !== null
              }
              onClick={handlePreviousPage}
            >
              Anterior
            </Button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  disabled={
                    deletingId !== null
                  }
                  onClick={() =>
                    handlePageChange(page)
                  }
                  className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition ${
                    currentPage === page
                      ? "bg-teal-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <Button
              variant="secondary"
              disabled={
                currentPage === totalPages ||
                deletingId !== null
              }
              onClick={handleNextPage}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
