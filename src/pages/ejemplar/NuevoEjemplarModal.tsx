// src/pages/book/NuevoEjemplarModal.tsx

import Modal from "../../components/commons/Modal";

import type { Libro } from "../../models/Libro";
import type { EjemplarFormData } from "./EjemplarForm";
import EjemplarForm from "./EjemplarForm";


interface NuevoEjemplarModalProps {
  libro: Libro | null;
  open: boolean;
  loading: boolean;
  onSubmit: (
    data: EjemplarFormData
  ) => void;
  onClose: () => void;
}

export default function NuevoEjemplarModal({
  libro,
  open,
  loading,
  onSubmit,
  onClose,
}: NuevoEjemplarModalProps) {
  if (!libro?.id) {
    return null;
  }

  return (
    <Modal
      open={open}
      title="Nuevo ejemplar"
      onClose={onClose}
    >
      <div className="mb-5 rounded-xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-800">
          {libro.titulo}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          ISBN: {libro.isbn}
        </p>
      </div>

      <EjemplarForm
        libroId={libro.id}
        initialValues={{
          codigoInventario: "",
        }}
        editingId={null}
        loading={loading}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
