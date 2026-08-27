import { useEffect, useState } from "react";

import type { Prestamo } from "../models/Prestamo";
import {
  initialAlert,
  type AlertState,
} from "../models/Alert";

import Button from "../components/commons/Button";
import Modal from "../components/commons/Modal";
import AlertModal from "../components/commons/AlertModal";
import Loader from "../components/commons/Loader";

import LoanTable from "./loan/LoanTable";
import { loansService } from "../services/LoanService";
import LoanForm, { type PrestamoFormData } from "./loan/LoanForm";


const emptyLoan: PrestamoFormData = {
  usuarioId: 0,
  isbn: "",
  fechaDevolucion: "",
};

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

//Prestamos
export default function Loans() {
  const [loans, setLoans] =
    useState<Prestamo[]>([]);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [loadingMessage, setLoadingMessage] =
    useState("Cargando...");

  const [alert, setAlert] =
    useState<AlertState>(initialAlert);

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
   * Cargar préstamos
   */
  const loadLoans = async () => {
    try {
      startLoading("Cargando préstamos...");

      const [data] = await Promise.all([
        loansService.list(),
        delay(800),
      ]);

      setLoans(data);
    } catch (error) {
      console.error(error);

      showAlert(
        "error",
        "Error al cargar préstamos",
        "No fue posible obtener los préstamos.",
      );
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
  const handleSave = async (
    data: PrestamoFormData,
  ) => {
    const loan: Prestamo = {
      ...data,
      isbn: data.isbn.trim(),
    };

    try {
      startLoading("Creando préstamo...");

      await Promise.all([
        loansService.create(loan),
        delay(1000),
      ]);

      setIsModalOpen(false);

      showAlert(
        "success",
        "Préstamo creado",
        "El préstamo fue registrado correctamente.",
      );

      await loadLoans();
    } catch (error) {
      console.error(error);

      showAlert(
        "error",
        "No se pudo crear el préstamo",
        "Ocurrió un error al registrar el préstamo.",
      );
    } finally {
      stopLoading();
    }
  };

  return (
    <section>
      {/* HEADER */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1 text-sm font-semibold text-teal-600">
            Administración
          </p>

          <h1 className="text-2xl font-bold text-slate-900">
            Préstamos
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Registra y consulta los préstamos de la biblioteca.
          </p>
        </div>

        <Button
          onClick={handleCreate}
          disabled={isLoading}
        >
          + Nuevo préstamo
        </Button>
      </div>

      {/* TABLA */}
      <LoanTable
        prestamos={loans}
        loading={isLoading}
      />

      {/* FORMULARIO */}
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

      {/* ALERTA */}
      <AlertModal
        open={alert.open}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={closeAlert}
      />

      {/* LOADER GLOBAL */}
      {isLoading && (
        <Loader message={loadingMessage} />
      )}
    </section>
  );
}
