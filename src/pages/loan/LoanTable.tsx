import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  Filter,
  User,
  X,
} from "lucide-react";


import Button from "../../components/commons/Button";

import type { Prestamo } from "../../models/Prestamo";
import type { Usuario } from "../../models/Usuario";
import type { Libro } from "../../models/Libro";

interface LoanTableProps {
  prestamos: Prestamo[];
  usuarios: Usuario[];
  libros: Libro[];
  loading: boolean;
  onCreate: () => void;
  onFilterUser: (userId: number) => void;
  onFilterBook: (bookId: number) => void;
  onClearFilters: () => void;
}

const PAGE_SIZE = 5;

export default function LoanTable({
  prestamos,
  usuarios,
  libros,
  loading,
  onCreate,
  onFilterUser,
  onFilterBook,
  onClearFilters,
}: LoanTableProps) {
  const [currentPage, setCurrentPage] =
    useState(1);

  const [selectedUserId, setSelectedUserId] =
    useState<number | "">("");

  const [selectedBookId, setSelectedBookId] =
    useState<number | "">("");

  /*
   * PAGINACIÓN
   */

  const totalPages = Math.ceil(
    prestamos.length / PAGE_SIZE
  );

  const paginatedPrestamos = useMemo(() => {
    const start =
      (currentPage - 1) * PAGE_SIZE;

    return prestamos.slice(
      start,
      start + PAGE_SIZE
    );
  }, [prestamos, currentPage]);

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }

    if (
      totalPages === 0 &&
      currentPage !== 1
    ) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  /*
   * VOLVER A LA PRIMERA PÁGINA
   */

  useEffect(() => {
    setCurrentPage(1);
  }, [prestamos]);

  /*
   * RANGO
   */

  const firstItem =
    prestamos.length === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const lastItem = Math.min(
    currentPage * PAGE_SIZE,
    prestamos.length
  );

  /*
   * OBTENER USUARIO
   */

  const getUserName = (
    userId: number
  ) => {
    const usuario = usuarios.find(
      (user) => user.id === userId
    );

    if (!usuario) {
      return `Usuario #${userId}`;
    }

    return `${usuario.nombre} ${usuario.apellido}`;
  };

  /*
   * OBTENER LIBRO
   */

  const getBookTitle = (
    isbn: string
  ) => {
    const libro = libros.find(
      (book) => book.isbn === isbn
    );

    return libro?.titulo ?? "Libro no encontrado";
  };

  /*
   * OBTENER ESTILOS DEL ESTADO
   */

  const getStatusStyles = (
    estado: string
  ) => {
    switch (estado) {
      case "ACTIVO":
        return "bg-blue-100 text-blue-700";

      case "PROGRAMADO":
        return "bg-violet-100 text-violet-700";

      case "VENCIDO":
        return "bg-red-100 text-red-700";

      case "DEVUELTO":
        return "bg-emerald-100 text-emerald-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  /*
   * NOMBRE DEL ESTADO
   */

  const getStatusLabel = (
    estado: string
  ) => {
    switch (estado) {
      case "ACTIVO":
        return "Activo";

      case "PROGRAMADO":
        return "Programado";

      case "VENCIDO":
        return "Vencido";

      case "DEVUELTO":
        return "Devuelto";

      default:
        return estado;
    }
  };

  /*
   * FORMATEAR FECHA
   */

  const formatDate = (
    date: string
  ) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString(
      "es-CO",
      {
        dateStyle: "short",
        timeStyle: "short",
      }
    );
  };

  /*
   * FILTRO USUARIO
   */

  const handleUserFilter = (
    value: string
  ) => {
    if (!value) {
      setSelectedUserId("");
      setSelectedBookId("");
      onClearFilters();
      return;
    }

    const userId = Number(value);

    setSelectedUserId(userId);
    setSelectedBookId("");

    onFilterUser(userId);
  };

  /*
   * FILTRO LIBRO
   */

  const handleBookFilter = (
    value: string
  ) => {
    if (!value) {
      setSelectedBookId("");
      setSelectedUserId("");
      onClearFilters();
      return;
    }

    const bookId = Number(value);

    setSelectedBookId(bookId);
    setSelectedUserId("");

    onFilterBook(bookId);
  };

  return (
    <div className="space-y-5">

      {/* ================================
          FILTROS
      ================================= */}

<div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
  {/* HEADER */}

  <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
          <Filter className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Filtrar préstamos
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Consulta los préstamos por usuario o libro.
          </p>
        </div>
      </div>

      {/* LIMPIAR FILTROS */}

      {(selectedUserId !== "" ||
        selectedBookId !== "") && (
        <Button
          variant="secondary"
          disabled={loading}
          onClick={() => {
            setSelectedUserId("");
            setSelectedBookId("");
            onClearFilters();
          }}
          className="self-start sm:self-auto"
        >
          <X className="mr-2 h-4 w-4" />
          Limpiar filtros
        </Button>
      )}
    </div>
  </div>

  {/* FILTROS */}

  <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">

    {/* ================================
        USUARIO
    ================================= */}

    <div>
      <label
        htmlFor="loanUserFilter"
        className="mb-2.5 flex items-center gap-2 text-sm font-medium text-slate-700"
      >
        <User className="h-4 w-4 text-slate-400" />
        Usuario
      </label>

      <div className="relative">
        <select
          id="loanUserFilter"
          value={selectedUserId}
          disabled={loading}
          onChange={(event) =>
            handleUserFilter(event.target.value)
          }
          className={`w-full appearance-none rounded-xl border bg-white px-4 py-3.5 pr-10 text-sm outline-none transition-all
            ${
              selectedUserId !== ""
                ? "border-teal-300 bg-teal-50/40 text-teal-800 ring-4 ring-teal-500/5"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }
            focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10
            disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400
          `}
        >
          <option value="">
            Todos los usuarios
          </option>

          {usuarios.map((usuario) => (
            <option
              key={usuario.id}
              value={usuario.id}
            >
              {usuario.nombre}{" "}
              {usuario.apellido}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Selecciona un usuario para ver sus préstamos.
        </p>

        {selectedUserId !== "" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-1 text-[11px] font-semibold text-teal-700">
            <Check className="h-3 w-3" />
            Activo
          </span>
        )}
      </div>
    </div>


    {/* ================================
        LIBRO
    ================================= */}

    <div>
      <label
        htmlFor="loanBookFilter"
        className="mb-2.5 flex items-center gap-2 text-sm font-medium text-slate-700"
      >
        <BookOpen className="h-4 w-4 text-slate-400" />
        Libro
      </label>

      <div className="relative">
        <select
          id="loanBookFilter"
          value={selectedBookId}
          disabled={loading}
          onChange={(event) =>
            handleBookFilter(event.target.value)
          }
          className={`w-full appearance-none rounded-xl border bg-white px-4 py-3.5 pr-10 text-sm outline-none transition-all
            ${
              selectedBookId !== ""
                ? "border-teal-300 bg-teal-50/40 text-teal-800 ring-4 ring-teal-500/5"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
            }
            focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10
            disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400
          `}
        >
          <option value="">
            Todos los libros
          </option>

          {libros.map((libro) => (
            <option
              key={libro.id}
              value={libro.id}
            >
              {libro.titulo}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Selecciona un libro para consultar sus préstamos.
        </p>

        {selectedBookId !== "" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-1 text-[11px] font-semibold text-teal-700">
            <Check className="h-3 w-3" />
            Activo
          </span>
        )}
      </div>
    </div>

  </div>

  {/* ESTADO DE FILTROS */}

  {(selectedUserId !== "" ||
    selectedBookId !== "") && (
    <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 sm:px-6">
      <div className="flex flex-wrap items-center gap-2">

        <span className="text-xs font-medium text-slate-500">
          Filtrando por:
        </span>

        {selectedUserId !== "" && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
            <User className="h-3.5 w-3.5 text-teal-600" />

            {(() => {
              const usuario = usuarios.find(
                (user) =>
                  user.id === selectedUserId
              );

              return usuario
                ? `${usuario.nombre} ${usuario.apellido}`
                : `Usuario #${selectedUserId}`;
            })()}
          </span>
        )}

        {selectedBookId !== "" && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200">
            <BookOpen className="h-3.5 w-3.5 text-teal-600" />

            {(() => {
              const libro = libros.find(
                (book) =>
                  book.id === selectedBookId
              );

              return libro
                ? libro.titulo
                : `Libro #${selectedBookId}`;
            })()}
          </span>
        )}

      </div>
    </div>
  )}
</div>


      {/* ================================
          TABLA
      ================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">

          <div>
            <h2 className="font-semibold text-slate-900">
              Préstamos
            </h2>

            <p className="text-sm text-slate-500">
              Gestión de préstamos de la biblioteca
            </p>
          </div>

          <Button
            onClick={onCreate}
            disabled={loading}
          >
            Crear préstamo
          </Button>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="border-b border-slate-100 bg-slate-50">
              <tr>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Usuario
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Libro
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Ejemplar
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Fecha préstamo
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Fecha devolución
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Estado
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-slate-500"
                  >
                    Cargando préstamos...
                  </td>
                </tr>
              ) : prestamos.length === 0 ? (

                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center"
                  >
                    <p className="text-sm font-medium text-slate-600">
                      No hay préstamos registrados.
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Los préstamos aparecerán aquí
                      cuando sean registrados.
                    </p>
                  </td>
                </tr>

              ) : (

                paginatedPrestamos.map(
                  (prestamo) => (
                    <tr
                      key={prestamo.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* USUARIO */}

                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">
                            {getUserName(
                              prestamo.usuarioId
                            )}
                          </p>

                          <p className="text-xs text-slate-400">
                            Usuario #
                            {prestamo.usuarioId}
                          </p>
                        </div>
                      </td>

                      {/* LIBRO */}

                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">
                            {getBookTitle(
                              prestamo.isbn
                            )}
                          </p>

                          <p className="text-xs text-slate-400">
                            ISBN:{" "}
                            {prestamo.isbn}
                          </p>
                        </div>
                      </td>

                      {/* EJEMPLAR */}

                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">
                            Ejemplar
                          </p>

                          <p className="text-xs text-slate-400">
                            ID #
                            {prestamo.ejemplarId}
                          </p>
                        </div>
                      </td>

                      {/* FECHA PRÉSTAMO */}

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(
                          prestamo.fechaPrestamo
                        )}
                      </td>

                      {/* FECHA DEVOLUCIÓN */}

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(
                          prestamo.fechaDevolucion
                        )}
                      </td>

                      {/* ESTADO */}

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(
                            prestamo.estadoPrestamo
                          )}`}
                        >
                          {getStatusLabel(
                            prestamo.estadoPrestamo
                          )}
                        </span>

                      </td>

                    </tr>
                  )
                )

              )}

            </tbody>

          </table>

        </div>

        {/* ================================
            PAGINACIÓN
        ================================= */}

        {prestamos.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

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

            <div className="flex items-center gap-2">

              <Button
                variant="secondary"
                disabled={
                  loading ||
                  currentPage === 1
                }
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(page - 1, 1)
                  )
                }
              >
                Anterior
              </Button>

              <span className="min-w-20 text-center text-sm text-slate-600">
                {currentPage} / {totalPages}
              </span>

              <Button
                variant="secondary"
                disabled={
                  loading ||
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(
                      page + 1,
                      totalPages
                    )
                  )
                }
              >
                Siguiente
              </Button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
