import { useForm, type SubmitHandler } from "react-hook-form";

import Button from "../../components/commons/Button";
import type { Libro } from "../../models/Libro";

export type LibroFormData = Omit<Libro, "id">;

interface LibroFormProps {
  initialValues: LibroFormData;
  editingId: number | null;
  loading: boolean;
  onSubmit: (data: LibroFormData) => void;
  onCancel: () => void;
}

export default function LibroForm({
  initialValues,
  editingId,
  loading,
  onSubmit,
  onCancel,
}: LibroFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LibroFormData>({
    defaultValues: initialValues,
  });

  const inputClass = (error?: string) =>
    `w-full rounded-xl border px-4 py-3 outline-none transition
    focus:ring-4 disabled:bg-slate-50 ${
      error
        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
        : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/10"
    }`;

  const submit: SubmitHandler<LibroFormData> = (data) => {
    onSubmit({
      ...data,
      titulo: data.titulo.trim(),
      isbn: data.isbn.trim(),
      edicion: data.edicion.trim(),
      autor: data.autor.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="space-y-5"
    >
      {/* TÍTULO */}
      <div>
        <label
          htmlFor="titulo"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Título
        </label>

        <input
          id="titulo"
          type="text"
          maxLength={150}
          disabled={loading}
          placeholder="Ej. Cien años de soledad"
          {...register("titulo", {
            required: "El título es obligatorio.",
            minLength: {
              value: 2,
              message:
                "El título debe tener al menos 2 caracteres.",
            },
            maxLength: {
              value: 150,
              message:
                "El título no puede superar los 150 caracteres.",
            },
          })}
          className={inputClass(errors.titulo?.message)}
        />

        {errors.titulo && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.titulo.message}
          </p>
        )}
      </div>

      {/* ISBN */}
      <div>
        <label
          htmlFor="isbn"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          ISBN
        </label>

        <input
          id="isbn"
          type="text"
          maxLength={17}
          disabled={loading}
          placeholder="Ej. 978-3-16-148410-0"
          {...register("isbn", {
            required: "El ISBN es obligatorio.",
            validate: (value) => {
              const isbn = value.replace(/[-\s]/g, "");

              if (!/^(?:\d{10}|\d{13})$/.test(isbn)) {
                return "Ingresa un ISBN válido de 10 o 13 dígitos.";
              }

              return true;
            },
          })}
          className={inputClass(errors.isbn?.message)}
        />

        {errors.isbn && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.isbn.message}
          </p>
        )}
      </div>

      {/* EDICIÓN */}
      <div>
        <label
          htmlFor="edicion"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Edición
        </label>

        <input
          id="edicion"
          type="text"
          maxLength={50}
          disabled={loading}
          placeholder="Ej. Primera edición"
          {...register("edicion", {
            required: "La edición es obligatoria.",
            minLength: {
              value: 2,
              message:
                "La edición debe tener al menos 2 caracteres.",
            },
            maxLength: {
              value: 50,
              message:
                "La edición no puede superar los 50 caracteres.",
            },
          })}
          className={inputClass(errors.edicion?.message)}
        />

        {errors.edicion && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.edicion.message}
          </p>
        )}
      </div>

      {/* AUTOR */}
      <div>
        <label
          htmlFor="autor"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Autor
        </label>

        <input
          id="autor"
          type="text"
          maxLength={100}
          disabled={loading}
          placeholder="Ej. Gabriel García Márquez"
          {...register("autor", {
            required: "El autor es obligatorio.",
            minLength: {
              value: 2,
              message:
                "El autor debe tener al menos 2 caracteres.",
            },
            maxLength: {
              value: 100,
              message:
                "El autor no puede superar los 100 caracteres.",
            },
          })}
          className={inputClass(errors.autor?.message)}
        />

        {errors.autor && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.autor.message}
          </p>
        )}
      </div>

      {/* FECHA DE PUBLICACIÓN */}
      <div>
        <label
          htmlFor="fechaPublicacion"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Fecha de publicación
        </label>

        <input
          id="fechaPublicacion"
          type="date"
          disabled={loading}
          max={new Date().toISOString().split("T")[0]}
          {...register("fechaPublicacion", {
            validate: (value) => {
              if (!value) {
                return true;
              }

              const fecha = new Date(`${value}T00:00:00`);
              const hoy = new Date();

              if (fecha > hoy) {
                return "La fecha de publicación no puede ser futura.";
              }

              return true;
            },
          })}
          className={inputClass(
            errors.fechaPublicacion?.message
          )}
        />

        {errors.fechaPublicacion && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.fechaPublicacion.message}
          </p>
        )}

        <p className="mt-1.5 text-xs text-slate-400">
          Este campo es opcional.
        </p>
      </div>

      {/* ACCIONES */}
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
          disabled={loading}
        >
          {editingId !== null
            ? "Guardar cambios"
            : "Crear libro"}
        </Button>
      </div>
    </form>
  );
}
