
import { useEffect, useState } from "react";

import Modal from "../../components/commons/Modal";
import AlertModal from "../../components/commons/AlertModal";
import ConfirmModal from "../../components/commons/ConfirmModal";
import Button from "../../components/commons/Button";

import type { Libro } from "../../models/Libro";
import type { Ejemplar } from "../../models/Ejemplar";

import EjemplarTable from "./EjemplarTable";

import { ejemplarService } from "../../services/EjemplarService";
import type { EjemplarFormData } from "./EjemplarForm";
import EjemplarForm from "./EjemplarForm";

interface EjemplaresModalProps {
  libro: Libro | null;
  open: boolean;
  onClose: () => void;
}

const emptyForm: EjemplarFormData = {
  codigoInventario: "",
};

export default function EjemplaresModal({
  libro,
  open,
  onClose,
}: EjemplaresModalProps) {
  const [ejemplares, setEjemplares] = useState<Ejemplar[]>([]);

  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState<Ejemplar | null>(null);

  const [formOpen, setFormOpen] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<Ejemplar | null>(null);

  const [error, setError] = useState<string | null>(null);

  const loadEjemplares = async () => {
    if (!libro?.id) {
      return;
    }

    try {
      setLoading(true);

      const data = await ejemplarService.listByBook(libro.id);

      setEjemplares(data);
    } catch (error) {
      console.error(error);

      setError("No fue posible cargar los ejemplares.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && libro?.id) {
      loadEjemplares();
    }
  }, [open, libro?.id]);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (ejemplar: Ejemplar) => {
    setEditing(ejemplar);
    setFormOpen(true);
  };

  const handleSave = async (data: EjemplarFormData) => {
    if (!libro?.id) {
      return;
    }

    try {
      setLoading(true);

      const request = {
        libroId: libro.id,
        codigoInventario: data.codigoInventario.trim().toUpperCase(),
      };

      if (editing?.id) {
        await ejemplarService.update(editing.id, request);
      } else {
        await ejemplarService.create(request);
      }

      setFormOpen(false);
      setEditing(null);

      await loadEjemplares();
    } catch (error) {
      console.error(error);

      setError(
        "No fue posible guardar el ejemplar. Verifica que el código de inventario no esté repetido.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete?.id) {
      return;
    }

    try {
      setConfirmDelete(null);
      setLoading(true);

      await ejemplarService.delete(confirmDelete.id);

      await loadEjemplares();
    } catch (error) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Ocurrió un error al eliminar el ejemplar.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!libro) {
    return null;
  }

  return (
    <>
      <Modal
        open={open}
        className="max-w-[50vw]"

        title={`Ejemplares - ${libro.titulo}`}
        onClose={() => {
          if (!loading) {
            onClose();
          }
        }}
      >
        <div className="space-y-5">
          {/* HEADER */}
          <div className="flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Gestión de ejemplares
              </p>

              <p className="mt-1 text-xs text-slate-500">ISBN: {libro.isbn}</p>
            </div>

            <Button onClick={handleCreate} disabled={loading}>
              + Nuevo ejemplar
            </Button>
          </div>

          {/* TABLA */}
          <EjemplarTable
            ejemplares={ejemplares}
            loading={loading}
            onEdit={handleEdit}
            onDelete={setConfirmDelete}
          />
        </div>
      </Modal>

      {/* FORMULARIO */}
      <Modal
        open={formOpen}
        title={editing ? "Editar ejemplar" : "Nuevo ejemplar"}

        onClose={() => {
          if (!loading) {
            setFormOpen(false);
            setEditing(null);
          }
        }}
      >
        <EjemplarForm
          libroId={libro.id!}
          initialValues={
            editing
              ? {
                  codigoInventario: editing.codigoInventario,
                }
              : emptyForm
          }
          editingId={editing?.id ?? null}
          loading={loading}
          onSubmit={handleSave}
          onCancel={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      </Modal>

      {/* CONFIRMACIÓN */}
      <ConfirmModal
        open={confirmDelete !== null}
        title="Eliminar ejemplar"
        message={
          confirmDelete
            ? `¿Estás seguro de eliminar el ejemplar "${confirmDelete.codigoInventario}"?`
            : ""
        }
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
      />

      {/* ERROR */}
      <AlertModal
        open={error !== null}
        type="error"
        title="Error"
        message={error ?? ""}
        onClose={() => setError(null)}
      />
    </>
  );
}
