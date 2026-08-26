import { useEffect, useState } from "react";

import type { Libro } from "../models/Libro";
import {
  initialAlert,
  type AlertState,
} from "../models/Alert";

import Button from "../components/commons/Button";
import Modal from "../components/commons/Modal";
import AlertModal from "../components/commons/AlertModal";
import Loader from "../components/commons/Loader";
import ConfirmModal from "../components/commons/ConfirmModal";

import LibroTable from "./libro/LibroTable";
import LibroForm, {
  type LibroFormData,
} from "./libro/LibroForm";

import { booksService } from "../services/bookService";

const emptyBook: LibroFormData = {
  titulo: "",
  isbn: "",
  edicion: "",
  fechaPublicacion: "",
  autor: "",
};

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export default function Libros() {
  const [libros, setLibros] = useState<Libro[]>([]);

  const [editingBook, setEditingBook] =
    useState<Libro | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [loadingMessage, setLoadingMessage] =
    useState("Cargando...");

  const [alert, setAlert] =
    useState<AlertState>(initialAlert);

  const [confirmDelete, setConfirmDelete] =
    useState<Libro | null>(null);

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
   * Cargar libros
   */
  const loadBooks = async () => {
    try {
      startLoading("Cargando libros...");

      const [data] = await Promise.all([
        booksService.list(),
        delay(800),
      ]);

      setLibros(data);
    } catch (error) {
      console.error(error);

      showAlert(
        "error",
        "Error al cargar libros",
        "No fue posible obtener los libros.",
      );
    } finally {
      stopLoading();
    }
  };

  /**
   * Cargar libros al iniciar
   */
  useEffect(() => {
    loadBooks();
  }, []);

  /**
   * Crear libro
   */
  const handleCreate = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  /**
   * Editar libro
   */
  const handleEdit = (libro: Libro) => {
    setEditingBook(libro);
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
    setEditingBook(null);
  };

  /**
   * Guardar libro
   */
  const handleSave = async (
    data: LibroFormData,
  ) => {
    const book: Libro = {
      ...data,
      titulo: data.titulo.trim(),
      isbn: data.isbn.trim(),
      edicion: data.edicion.trim(),
      autor: data.autor.trim(),
    };

    const isEditing =
      editingBook !== null;

    try {
      startLoading(
        isEditing
          ? "Actualizando libro..."
          : "Creando libro...",
      );

      await Promise.all([
        isEditing
          ? booksService.update(
              editingBook.id!,
              book,
            )
          : booksService.create(book),

        delay(1000),
      ]);

      setIsModalOpen(false);
      setEditingBook(null);

      showAlert(
        "success",
        isEditing
          ? "Libro actualizado"
          : "Libro creado",
        isEditing
          ? "El libro fue actualizado correctamente."
          : "El libro fue creado correctamente.",
      );

      await loadBooks();
    } catch (error) {
      console.error(error);

      showAlert(
        "error",
        "No se pudo guardar el libro",
        "Ocurrió un error al guardar el libro.",
      );
    } finally {
      stopLoading();
    }
  };

  /**
   * Abrir confirmación de eliminación
   */
  const handleDelete = (libro: Libro) => {
    if (!libro.id) {
      return;
    }

    setConfirmDelete(libro);
  };

  /**
   * Eliminar libro
   */
  const deleteBookById = async (
    id: number,
  ) => {
    try {
      setConfirmDelete(null);

      startLoading("Eliminando libro...");

      await Promise.all([
        booksService.delete(id),
        delay(800),
      ]);

      showAlert(
        "success",
        "Libro eliminado",
        "El libro fue eliminado correctamente.",
      );

      await loadBooks();
    } catch (error) {
      console.error(error);

      showAlert(
        "error",
        "No se pudo eliminar el libro",
        "Ocurrió un error al eliminar el libro.",
      );
    } finally {
      stopLoading();
    }
  };

  /**
   * Valores iniciales del formulario
   */
  const initialFormValues: LibroFormData =
    editingBook
      ? {
          titulo: editingBook.titulo,
          isbn: editingBook.isbn,
          edicion: editingBook.edicion,
          fechaPublicacion:
            editingBook.fechaPublicacion ?? "",
          autor: editingBook.autor,
        }
      : emptyBook;

  return (
    <section>
      {/* HEADER */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1 text-sm font-semibold text-teal-600">
            Administración
          </p>

          <h1 className="text-2xl font-bold text-slate-900">
            Libros
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Administra el catálogo de libros de la
            biblioteca.
          </p>
        </div>

        <Button
          onClick={handleCreate}
          disabled={isLoading}
        >
          + Nuevo libro
        </Button>
      </div>

      {/* TABLA */}
      <LibroTable
        libros={libros}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* FORMULARIO */}
      <Modal
        open={isModalOpen}
        title={
          editingBook !== null
            ? "Editar libro"
            : "Nuevo libro"
        }
        onClose={handleCloseForm}
      >
        <LibroForm
          initialValues={initialFormValues}
          editingId={editingBook?.id ?? null}
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

      {/* CONFIRMACIÓN */}
      <ConfirmModal
        open={confirmDelete !== null}
        title="Eliminar libro"
        message={
          confirmDelete
            ? `¿Estás seguro de que deseas eliminar "${confirmDelete.titulo}"? Esta acción no se puede deshacer.`
            : ""
        }
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onCancel={() =>
          setConfirmDelete(null)
        }
        onConfirm={() => {
          if (confirmDelete?.id) {
            deleteBookById(
              confirmDelete.id,
            );
          }
        }}
      />

      {/* LOADER GLOBAL */}
      {isLoading && (
        <Loader message={loadingMessage} />
      )}
    </section>
  );
}
