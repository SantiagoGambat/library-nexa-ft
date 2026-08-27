import { useEffect, useState } from "react";

import type { Prestamo } from "../models/Prestamo";
import { initialAlert, type AlertState } from "../models/Alert";

import Button from "../components/commons/Button";
import Modal from "../components/commons/Modal";
import AlertModal from "../components/commons/AlertModal";
import Loader from "../components/commons/Loader";

import LoanTable from "./loan/LoanTable";
import { loansService } from "../services/LoanService";

import LoanForm, { type PrestamoFormData } from "./loan/LoanForm";

import { usersService } from "../services/UserService";

import { booksService } from "../services/BookService";

import type { Usuario } from "../models/Usuario";
import type { Libro } from "../models/Libro";

const emptyLoan: PrestamoFormData = {
  usuarioId: 0,
  isbn: "",
  ejemplarId: 0,
  fechaDevolucion: "",
  fechaPrestamo: "",
  estadoPrestamo: "",
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Préstamos
export default function Loans() {
  /*
   * PRÉSTAMOS
   */

  const [loans, setLoans] = useState<Prestamo[]>([]);

  /*
   * USUARIOS
   */

  const [users, setUsers] = useState<Usuario[]>([]);

  /*
   * LIBROS
   */

  const [books, setBooks] = useState<Libro[]>([]);

  /*
   * MODAL
   */

  const [isModalOpen, setIsModalOpen] = useState(false);

  /*
   * LOADING
   */

  const [isLoading, setIsLoading] = useState(false);

  const [loadingMessage, setLoadingMessage] = useState("Cargando...");

  /*
   * ALERTA
   */

  const [alert, setAlert] = useState<AlertState>(initialAlert);

  /**
   * Iniciar loader global
   */
  const startLoading = (message: string) => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  /**
   * Detener loader global
   */
  const stopLoading = () => {
    setIsLoading(false);
  };

  /**
   * Mostrar alerta
   */
  const showAlert = (
    type: AlertState["type"],
    title: string,
    message: string,
  ) => {
    setAlert({
      open: true,
      type,
      title,
      message,
    });
  };

  /**
   * Cerrar alerta
   */
  const closeAlert = () => {
    setAlert((previous) => ({
      ...previous,
      open: false,
    }));
  };

  /**
   * Filtrar préstamos por usuario
   */
  const handleFilterUser = async (userId: number) => {
    try {
      startLoading("Cargando préstamos del usuario...");

      const [data] = await Promise.all([
        loansService.byUser(userId),
        delay(500),
      ]);

      setLoans(data);
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "No fue posible obtener los préstamos del usuario.";

      showAlert("error", "Error al consultar préstamos", message);
    } finally {
      stopLoading();
    }
  };

  /**
   * Filtrar préstamos por libro
   */
  const handleFilterBook = async (bookId: number) => {
    try {
      startLoading("Cargando préstamos del libro...");

      const [data] = await Promise.all([
        loansService.byBook(bookId),
        delay(500),
      ]);

      setLoans(data);
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "No fue posible obtener los préstamos del libro.";

      showAlert("error", "Error al consultar préstamos", message);
    } finally {
      stopLoading();
    }
  };

  /**
   * Limpiar filtros
   */
  const handleClearFilters = async () => {
    await loadLoans();
  };

  /**
   * Cargar información de préstamos
   *
   * Se cargan:
   *
   * - Préstamos
   * - Usuarios
   * - Libros
   *
   * De esta manera LoanTable puede resolver
   * usuarioId -> usuario
   * isbn -> libro
   */
  const loadLoans = async () => {
    try {
      startLoading("Cargando préstamos...");

      const [loansData, usersData, booksData] = await Promise.all([
        loansService.list(),

        usersService.list(),

        booksService.list(),
      ]);

      setLoans(loansData);

      setUsers(usersData);

      setBooks(booksData);
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "No fue posible obtener la información de los préstamos.";

      showAlert("error", "Error al cargar préstamos", message);
    } finally {
      stopLoading();
    }
  };

  /**
   * Cargar préstamos al iniciar
   */
  useEffect(() => {
    loadLoans();
  }, []);

  /**
   * Abrir formulario
   */
  const handleCreate = () => {
    setIsModalOpen(true);
  };

  /**
   * Cerrar formulario
   */
  const handleCloseForm = () => {
    if (isLoading) {
      return;
    }

    setIsModalOpen(false);
  };

  /**
   * Crear préstamo
   */
  const handleSave = async (data: PrestamoFormData) => {
    const loan: Prestamo = {
      ...data,
      isbn: data.isbn.trim(),
    };

    try {
      startLoading("Creando préstamo...");

      await Promise.all([loansService.create(loan), delay(1000)]);

      setIsModalOpen(false);

      showAlert(
        "success",
        "Préstamo creado",
        "El préstamo fue registrado correctamente.",
      );

      /*
       * Volvemos a cargar préstamos,
       * usuarios y libros para mantener
       * la tabla actualizada.
       */
      await loadLoans();
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al registrar el préstamo.";

      showAlert("error", "No se pudo crear el préstamo", message);
    } finally {
      stopLoading();
    }
  };

  return (
    <section>
      {/* ================================
          HEADER
      ================================= */}

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1 text-sm font-semibold text-teal-600">
            Administración
          </p>

          <h1 className="text-2xl font-bold text-slate-900">Préstamos</h1>

          <p className="mt-1 text-sm text-slate-500">
            Registra y consulta los préstamos de la biblioteca.
          </p>
        </div>

        <Button onClick={handleCreate} disabled={isLoading}>
          + Nuevo préstamo
        </Button>
      </div>

      {/* ================================
          TABLA
      ================================= */}

      <LoanTable
        prestamos={loans}
        usuarios={users}
        libros={books}
        loading={isLoading}
        onCreate={handleCreate}
        onFilterUser={handleFilterUser}
        onFilterBook={handleFilterBook}
        onClearFilters={handleClearFilters}
      />

      {/* ================================
          FORMULARIO
      ================================= */}

      <Modal
        open={isModalOpen}
        title="Nuevo préstamo"
        onClose={handleCloseForm}
      >
        <LoanForm
          initialValues={emptyLoan}
          loading={isLoading}
          onSubmit={handleSave}
          onCancel={handleCloseForm}
        />
      </Modal>

      {/* ================================
          ALERTA
      ================================= */}

      <AlertModal
        open={alert.open}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={closeAlert}
      />

      {/* ================================
          LOADER GLOBAL
      ================================= */}

      {isLoading && <Loader message={loadingMessage} />}
    </section>
  );
}
