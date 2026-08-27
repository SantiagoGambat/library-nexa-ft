import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useForm,
  type SubmitHandler,
} from "react-hook-form";

import Button from "../../components/commons/Button";

import type { Prestamo } from "../../models/Prestamo";
import type { Usuario } from "../../models/Usuario";
import type { Libro } from "../../models/Libro";
import type { Ejemplar } from "../../models/Ejemplar";

import { usersService } from "../../services/UserService";
import { booksService } from "../../services/BookService";
import { ejemplarService } from "../../services/EjemplarService";

export type PrestamoFormData = Omit<Prestamo, "id">;

interface PrestamoFormProps {
  initialValues: PrestamoFormData;
  loading: boolean;
  onSubmit: (data: PrestamoFormData) => void;
  onCancel: () => void;
}

const MAX_VISIBLE_RESULTS = 1000;

export default function LoanForm({
  initialValues,
  loading,
  onSubmit,
  onCancel,
}: PrestamoFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PrestamoFormData>({
    defaultValues: initialValues,
  });

  /*
   * REFS
   */

  const userAutocompleteRef =
    useRef<HTMLDivElement>(null);

  const bookAutocompleteRef =
    useRef<HTMLDivElement>(null);

  const exemplarAutocompleteRef =
    useRef<HTMLDivElement>(null);

  /*
   * USERS
   */

  const [users, setUsers] = useState<Usuario[]>([]);

  const [isLoadingUsers, setIsLoadingUsers] =
    useState(false);

  const [userSearch, setUserSearch] =
    useState("");

  const [isUserListOpen, setIsUserListOpen] =
    useState(false);

  /*
   * BOOKS
   */

  const [books, setBooks] = useState<Libro[]>([]);

  const [isLoadingBooks, setIsLoadingBooks] =
    useState(false);

  const [bookSearch, setBookSearch] =
    useState("");

  const [isBookListOpen, setIsBookListOpen] =
    useState(false);

  /*
   * EXEMPLARS
   */

  const [exemplars, setExemplars] =
    useState<Ejemplar[]>([]);

  const [isLoadingExemplars, setIsLoadingExemplars] =
    useState(false);

  const [exemplarSearch, setExemplarSearch] =
    useState("");

  const [isExemplarListOpen, setIsExemplarListOpen] =
    useState(false);

  /*
   * SELECTED VALUES
   */

  const selectedUserId = watch("usuarioId");
  const selectedIsbn = watch("isbn");
  const selectedExemplarId = watch("ejemplarId");

  /*
   * INPUT STYLES
   */

  const inputClass = (error?: string) =>
    `w-full rounded-xl border px-4 py-3 outline-none transition
    focus:ring-4 disabled:bg-slate-50 ${
      error
        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
        : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/10"
    }`;

  /*
   * LOAD USERS
   */

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoadingUsers(true);

        const data = await usersService.list();

        setUsers(data);
      } catch (error) {
        console.error(
          "Failed to load users:",
          error
        );
      } finally {
        setIsLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  /*
   * LOAD BOOKS
   */

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setIsLoadingBooks(true);

        const data = await booksService.getAvailable();

        setBooks(data);
      } catch (error) {
        console.error(
          "Failed to load books:",
          error
        );
      } finally {
        setIsLoadingBooks(false);
      }
    };

    loadBooks();
  }, []);

  /*
   * CLOSE AUTOCOMPLETE WHEN CLICKING OUTSIDE
   */

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      const target = event.target as Node;

      if (
        userAutocompleteRef.current &&
        !userAutocompleteRef.current.contains(target)
      ) {
        setIsUserListOpen(false);
      }

      if (
        bookAutocompleteRef.current &&
        !bookAutocompleteRef.current.contains(target)
      ) {
        setIsBookListOpen(false);
      }

      if (
        exemplarAutocompleteRef.current &&
        !exemplarAutocompleteRef.current.contains(
          target
        )
      ) {
        setIsExemplarListOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
   * SELECTED USER
   */

  const selectedUser = useMemo(
    () =>
      users.find(
        (user) => user.id === selectedUserId
      ),
    [users, selectedUserId]
  );

  /*
   * SELECTED BOOK
   */

  const selectedBook = useMemo(
    () =>
      books.find(
        (book) => book.isbn === selectedIsbn
      ),
    [books, selectedIsbn]
  );

  /*
   * SELECTED EXEMPLAR
   */

  const selectedExemplar = useMemo(
    () =>
      exemplars.find(
        (exemplar) =>
          exemplar.id === selectedExemplarId
      ),
    [exemplars, selectedExemplarId]
  );

  /*
   * LOAD AVAILABLE EXEMPLARS
   *
   * Se ejecuta cuando cambia el libro.
   */

  useEffect(() => {
    const loadAvailableExemplars = async () => {
      if (!selectedIsbn) {
        setExemplars([]);
        return;
      }

      try {
        setIsLoadingExemplars(true);

        const data =
          await ejemplarService.listAvailableByIsbn(
            selectedIsbn
          );

        setExemplars(data);

        /*
         * Si el ejemplar seleccionado anteriormente
         * ya no pertenece al nuevo libro, lo limpiamos.
         */

        setValue("ejemplarId", 0, {
          shouldValidate: true,
          shouldDirty: true,
        });

        setExemplarSearch("");
        setIsExemplarListOpen(false);
      } catch (error) {
        console.error(
          "Failed to load available exemplars:",
          error
        );

        setExemplars([]);

        setValue("ejemplarId", 0, {
          shouldValidate: true,
          shouldDirty: true,
        });
      } finally {
        setIsLoadingExemplars(false);
      }
    };

    loadAvailableExemplars();
  }, [selectedIsbn, setValue]);

  /*
   * FILTER USERS
   */

  const filteredUsers = useMemo(() => {
    const search = userSearch
      .trim()
      .toLowerCase();

    const matchingUsers = !search
      ? users
      : users.filter((user) => {
          const fullName =
            `${user.nombre} ${user.apellido}`.toLowerCase();

          return (
            fullName.includes(search) ||
            user.email
              .toLowerCase()
              .includes(search) ||
            String(user.id).includes(search)
          );
        });

    return matchingUsers.slice(
      0,
      MAX_VISIBLE_RESULTS
    );
  }, [users, userSearch]);

  /*
   * FILTER BOOKS
   */

  const filteredBooks = useMemo(() => {
    const search = bookSearch
      .trim()
      .toLowerCase();

    const matchingBooks = !search
      ? books
      : books.filter((book) => {
          return (
            book.titulo
              .toLowerCase()
              .includes(search) ||
            book.autor
              .toLowerCase()
              .includes(search) ||
            book.isbn
              .toLowerCase()
              .includes(search) ||
            String(book.id).includes(search)
          );
        });

    return matchingBooks.slice(
      0,
      MAX_VISIBLE_RESULTS
    );
  }, [books, bookSearch]);

  /*
   * FILTER EXEMPLARS
   */

  const filteredExemplars = useMemo(() => {
    const search = exemplarSearch
      .trim()
      .toLowerCase();

    const matchingExemplars = !search
      ? exemplars
      : exemplars.filter((exemplar) => {
          return (
            exemplar.codigoInventario
              .toLowerCase()
              .includes(search) ||
            String(exemplar.id).includes(search)
          );
        });

    return matchingExemplars.slice(
      0,
      MAX_VISIBLE_RESULTS
    );
  }, [exemplars, exemplarSearch]);

  /*
   * CHECK MORE USERS
   */

  const hasMoreUsers = useMemo(() => {
    const search = userSearch
      .trim()
      .toLowerCase();

    const matchingCount = !search
      ? users.length
      : users.filter((user) => {
          const fullName =
            `${user.nombre} ${user.apellido}`.toLowerCase();

          return (
            fullName.includes(search) ||
            user.email
              .toLowerCase()
              .includes(search) ||
            String(user.id).includes(search)
          );
        }).length;

    return (
      matchingCount > MAX_VISIBLE_RESULTS
    );
  }, [users, userSearch]);

  /*
   * CHECK MORE BOOKS
   */

  const hasMoreBooks = useMemo(() => {
    const search = bookSearch
      .trim()
      .toLowerCase();

    const matchingCount = !search
      ? books.length
      : books.filter((book) => {
          return (
            book.titulo
              .toLowerCase()
              .includes(search) ||
            book.autor
              .toLowerCase()
              .includes(search) ||
            book.isbn
              .toLowerCase()
              .includes(search) ||
            String(book.id).includes(search)
          );
        }).length;

    return (
      matchingCount > MAX_VISIBLE_RESULTS
    );
  }, [books, bookSearch]);

  /*
   * CHECK MORE EXEMPLARS
   */

  const hasMoreExemplars = useMemo(() => {
    const search = exemplarSearch
      .trim()
      .toLowerCase();

    const matchingCount = !search
      ? exemplars.length
      : exemplars.filter((exemplar) => {
          return (
            exemplar.codigoInventario
              .toLowerCase()
              .includes(search) ||
            String(exemplar.id).includes(search)
          );
        }).length;

    return (
      matchingCount > MAX_VISIBLE_RESULTS
    );
  }, [exemplars, exemplarSearch]);

  /*
   * SELECT USER
   */

  const handleUserSelect = (user: Usuario) => {
    if (!user.id) {
      return;
    }

    setValue("usuarioId", user.id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setUserSearch("");
    setIsUserListOpen(false);
  };

  /*
   * USER SEARCH
   */

  const handleUserInputChange = (
    value: string
  ) => {
    setUserSearch(value);
    setIsUserListOpen(true);

    if (selectedUser) {
      setValue("usuarioId", 0, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  /*
   * SELECT BOOK
   */

  const handleBookSelect = (book: Libro) => {
    if (!book.isbn) {
      return;
    }

    setValue("isbn", book.isbn, {
      shouldValidate: true,
      shouldDirty: true,
    });

    /*
     * El ejemplar anterior ya no sirve porque
     * acabamos de cambiar de libro.
     */

    setValue("ejemplarId", 0, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setBookSearch("");
    setIsBookListOpen(false);
  };

  /*
   * BOOK SEARCH
   */

  const handleBookInputChange = (
    value: string
  ) => {
    setBookSearch(value);
    setIsBookListOpen(true);

    if (selectedBook) {
      setValue("isbn", "", {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue("ejemplarId", 0, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setExemplars([]);
      setExemplarSearch("");
    }
  };

  /*
   * SELECT EXEMPLAR
   */

  const handleExemplarSelect = (
    exemplar: Ejemplar
  ) => {
    if (!exemplar.id) {
      return;
    }

    setValue(
      "ejemplarId",
      exemplar.id,
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );

    setExemplarSearch("");
    setIsExemplarListOpen(false);
  };

  /*
   * EXEMPLAR SEARCH
   */

  const handleExemplarInputChange = (
    value: string
  ) => {
    setExemplarSearch(value);
    setIsExemplarListOpen(true);

    if (selectedExemplar) {
      setValue("ejemplarId", 0, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  /*
   * SUBMIT
   */

  const submit: SubmitHandler<PrestamoFormData> = (
    data
  ) => {
    onSubmit({
      ...data,
      isbn: data.isbn.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="space-y-5"
    >
      {/* ================================
          USUARIO
      ================================= */}

      <div>
        <label
          htmlFor="userSearch"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Usuario
        </label>

        <div
          ref={userAutocompleteRef}
          className="relative"
        >
          <input
            id="userSearch"
            type="text"
            autoComplete="off"
            disabled={
              loading || isLoadingUsers
            }
            value={
              selectedUser
                ? `${selectedUser.nombre} ${selectedUser.apellido}`
                : userSearch
            }
            onChange={(event) =>
              handleUserInputChange(
                event.target.value
              )
            }
            onFocus={() =>
              setIsUserListOpen(true)
            }
            placeholder={
              isLoadingUsers
                ? "Cargando usuarios..."
                : "Buscar usuario..."
            }
            className={inputClass(
              errors.usuarioId?.message
            )}
          />

          {isUserListOpen &&
            !loading &&
            !isLoadingUsers && (
              <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                <div className="max-h-64 overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() =>
                          handleUserSelect(user)
                        }
                        className="w-full border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50"
                      >
                        <div className="font-medium text-slate-800">
                          {user.nombre}{" "}
                          {user.apellido}
                        </div>

                        <div className="text-sm text-slate-500">
                          {user.email}
                        </div>

                        <div className="mt-0.5 text-xs text-slate-400">
                          ID: {user.id}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-center text-sm text-slate-500">
                      No se encontraron usuarios.
                    </div>
                  )}
                </div>

                {hasMoreUsers && (
                  <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-center text-xs text-slate-400">
                    Mostrando los primeros{" "}
                    {MAX_VISIBLE_RESULTS} resultados.
                    Refina tu búsqueda para ver más.
                  </div>
                )}
              </div>
            )}
        </div>

        <input
          type="hidden"
          {...register("usuarioId", {
            required:
              "El usuario es obligatorio.",
            validate: (value) =>
              Number(value) > 0 ||
              "Selecciona un usuario válido.",
          })}
        />

        {errors.usuarioId && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.usuarioId.message}
          </p>
        )}

        <p className="mt-1.5 text-xs text-slate-400">
          Busca y selecciona el usuario que
          realizará el préstamo.
        </p>
      </div>

      {/* ================================
          LIBRO
      ================================= */}

      <div>
        <label
          htmlFor="bookSearch"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Libro
        </label>

        <div
          ref={bookAutocompleteRef}
          className="relative"
        >
          <input
            id="bookSearch"
            type="text"
            autoComplete="off"
            disabled={
              loading || isLoadingBooks
            }
            value={
              selectedBook
                ? selectedBook.titulo
                : bookSearch
            }
            onChange={(event) =>
              handleBookInputChange(
                event.target.value
              )
            }
            onFocus={() =>
              setIsBookListOpen(true)
            }
            placeholder={
              isLoadingBooks
                ? "Cargando libros..."
                : "Buscar libro..."
            }
            className={inputClass(
              errors.isbn?.message
            )}
          />

          {isBookListOpen &&
            !loading &&
            !isLoadingBooks && (
              <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                <div className="max-h-64 overflow-y-auto">
                  {filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                      <button
                        key={book.id}
                        type="button"
                        onClick={() =>
                          handleBookSelect(book)
                        }
                        className="w-full border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50"
                      >
                        <div className="font-medium text-slate-800">
                          {book.titulo}
                        </div>

                        <div className="text-sm text-slate-500">
                          {book.autor}
                        </div>

                        <div className="mt-0.5 text-xs text-slate-400">
                          ISBN: {book.isbn}
                        </div>

                        <div className="text-xs text-slate-400">
                          ID: {book.id}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-4 text-center text-sm text-slate-500">
                      No se encontraron libros.
                    </div>
                  )}
                </div>

                {hasMoreBooks && (
                  <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-center text-xs text-slate-400">
                    Mostrando los primeros{" "}
                    {MAX_VISIBLE_RESULTS} resultados.
                    Refina tu búsqueda para ver más.
                  </div>
                )}
              </div>
            )}
        </div>

        <input
          type="hidden"
          {...register("isbn", {
            required:
              "El libro es obligatorio.",
            validate: (value) => {
              if (!value?.trim()) {
                return "Selecciona un libro válido.";
              }

              return true;
            },
          })}
        />

        {errors.isbn && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.isbn.message}
          </p>
        )}

        <p className="mt-1.5 text-xs text-slate-400">
          Busca y selecciona el libro que deseas
          prestar.
        </p>
      </div>

      {/* ================================
          EJEMPLAR
      ================================= */}

      <div>
        <label
          htmlFor="exemplarSearch"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Ejemplar
        </label>

        <div
          ref={exemplarAutocompleteRef}
          className="relative"
        >
          <input
            id="exemplarSearch"
            type="text"
            autoComplete="off"
            disabled={
              loading ||
              !selectedBook ||
              isLoadingExemplars
            }
            value={
              selectedExemplar
                ? selectedExemplar.codigoInventario
                : exemplarSearch
            }
            onChange={(event) =>
              handleExemplarInputChange(
                event.target.value
              )
            }
            onFocus={() =>
              setIsExemplarListOpen(true)
            }
            placeholder={
              !selectedBook
                ? "Primero selecciona un libro"
                : isLoadingExemplars
                ? "Cargando ejemplares..."
                : "Buscar ejemplar..."
            }
            className={inputClass(
              errors.ejemplarId?.message
            )}
          />

          {isExemplarListOpen &&
            !loading &&
            !isLoadingExemplars &&
            selectedBook && (
              <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                <div className="max-h-64 overflow-y-auto">
                  {filteredExemplars.length > 0 ? (
                    filteredExemplars.map(
                      (exemplar) => (
                        <button
                          key={exemplar.id}
                          type="button"
                          onClick={() =>
                            handleExemplarSelect(
                              exemplar
                            )
                          }
                          className="w-full border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50"
                        >
                          <div className="font-medium text-slate-800">
                            {exemplar.codigoInventario}
                          </div>

                          <div className="text-sm text-slate-500">
                            {exemplar.titulo}
                          </div>

                          <div className="mt-0.5 text-xs text-slate-400">
                            ISBN: {exemplar.isbn}
                          </div>

                          <div className="text-xs text-green-600">
                            Disponible
                          </div>
                        </button>
                      )
                    )
                  ) : (
                    <div className="px-4 py-4 text-center">
                      <p className="text-sm font-medium text-slate-600">
                        No hay ejemplares disponibles.
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Este libro no tiene ejemplares
                        disponibles para préstamo.
                      </p>
                    </div>
                  )}
                </div>

                {hasMoreExemplars && (
                  <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-center text-xs text-slate-400">
                    Mostrando los primeros{" "}
                    {MAX_VISIBLE_RESULTS} ejemplares.
                    Refina tu búsqueda para ver más.
                  </div>
                )}
              </div>
            )}
        </div>

        <input
          type="hidden"
          {...register("ejemplarId", {
            required:
              "El ejemplar es obligatorio.",
            validate: (value) =>
              Number(value) > 0 ||
              "Selecciona un ejemplar disponible.",
          })}
        />

        {errors.ejemplarId && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.ejemplarId.message}
          </p>
        )}

        <p className="mt-1.5 text-xs text-slate-400">
          Selecciona uno de los ejemplares físicos
          disponibles para este libro.
        </p>
      </div>


            {/* ================================
          FECHA PRÉSTAMO
      ================================= */}

      <div>
        <label
          htmlFor="fechaPrestamo"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Fecha de préstamo
        </label>

        <input
          id="fechaPrestamo"
          type="datetime-local"
          disabled={loading}
          {...register("fechaPrestamo", {
            required:
              "La fecha de préstamo es obligatoria.",

            validate: (value) => {
              if (!value) {
                return "La fecha de préstamo es obligatoria.";
              }

              const loanDate = new Date(value);
              const now = new Date();

              if (loanDate <= now) {
                return "La fecha de préstamo debe ser mayor a la actual(tiempo), pero solo en tiempo , en fecha puede ser el mismo dia.";
              }

              return true;
            },
          })}
          className={inputClass(
            errors.fechaPrestamo?.message
          )}
        />

        {errors.fechaPrestamo && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.fechaPrestamo.message}
          </p>
        )}

        <p className="mt-1.5 text-xs text-slate-400">
          Si seleccionas hoy, el préstamo quedará
          activo. Si seleccionas una fecha futura,
          quedará programado.
        </p>
      </div>


      {/* ================================
          FECHA DEVOLUCIÓN
      ================================= */}

      <div>
        <label
          htmlFor="fechaDevolucion"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Fecha de devolución
        </label>

        <input
          id="fechaDevolucion"
          type="datetime-local"
          disabled={loading}
          {...register("fechaDevolucion", {
            required:
              "La fecha de devolución es obligatoria.",

            validate: (value) => {
              if (!value) {
                return "La fecha de devolución es obligatoria.";
              }

              const loanDate = watch("fechaPrestamo");

              if (!loanDate) {
                return "Primero selecciona la fecha de préstamo.";
              }

              const returnDate = new Date(value);
              const loanDateTime = new Date(loanDate);

              if (returnDate <= loanDateTime) {
                return "La fecha de devolución debe ser posterior a la fecha de préstamo.";
              }

              return true;
            },
          })}
          className={inputClass(
            errors.fechaDevolucion?.message
          )}
        />

        {errors.fechaDevolucion && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.fechaDevolucion.message}
          </p>
        )}

        <p className="mt-1.5 text-xs text-slate-400">
          Selecciona la fecha y hora límite para
          devolver el libro.
        </p>
      </div>


      {/* ================================
          ACCIONES
      ================================= */}

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <Button
          type="button"
          variant="secondary"
          disabled={loading}
          onClick={onCancel}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          disabled={
            loading ||
            isLoadingUsers ||
            isLoadingBooks ||
            isLoadingExemplars
          }
        >
          Crear préstamo
        </Button>
      </div>
    </form>
  );
}
