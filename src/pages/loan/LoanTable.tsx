import { useEffect, useMemo, useState } from "react";

import type { Prestamo } from "../../models/Prestamo";

interface PrestamoTableProps {
  prestamos: Prestamo[];
  loading: boolean;
}

const PAGE_SIZE = 10;

export default function LoanTable({
  prestamos,
  loading,
}: PrestamoTableProps) {
  const [currentPage, setCurrentPage] =
    useState(1);

  const totalPages = Math.ceil(
    prestamos.length / PAGE_SIZE
  );

  const paginatedLoans = useMemo(() => {
    const startIndex =
      (currentPage - 1) * PAGE_SIZE;

    const endIndex =
      startIndex + PAGE_SIZE;

    return prestamos.slice(
      startIndex,
      endIndex
    );
  }, [prestamos, currentPage]);

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
    prestamos.length === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const lastItem = Math.min(
    currentPage * PAGE_SIZE,
    prestamos.length
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
                ISBN
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Fecha préstamo
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Devolución
              </th>

              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Estado
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {prestamos.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center"
                >
                  <p className="text-sm font-medium text-slate-600">
                    No hay préstamos registrados.
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Crea el primer préstamo para comenzar.
                  </p>
                </td>
              </tr>
            ) : (
              paginatedLoans.map((prestamo) => (
                <tr
                  key={prestamo.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-700">
                        👤
                      </div>

                      <div>
                        <p className="font-medium text-slate-900">
                          Usuario #
                          {prestamo.usuarioId}
                        </p>

                        <p className="text-xs text-slate-400">
                          ID préstamo #
                          {prestamo.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {prestamo.isbn}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {prestamo.fechaPrestamo
                      ? formatDate(
                          prestamo.fechaPrestamo
                        )
                      : "—"}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {prestamo.fechaDevolucion
                      ? formatDate(
                          prestamo.fechaDevolucion
                        )
                      : "—"}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        isReturned(
                          prestamo.fechaDevolucion
                        )
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {isReturned(
                        prestamo.fechaDevolucion
                      )
                        ? "Devuelto"
                        : "Pendiente"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      {prestamos.length > 0 && (
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
              {prestamos.length}
            </span>{" "}
            préstamos
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            <div className="flex items-center gap-1">
              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
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

            <button
              type="button"
              onClick={handleNextPage}
              disabled={
                currentPage === totalPages
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function isReturned(value?: string) {
  if (!value) {
    return false;
  }

  return new Date(value) <= new Date();
}
