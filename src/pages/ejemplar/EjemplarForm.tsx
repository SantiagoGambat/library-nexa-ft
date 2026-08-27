import {
  useForm,
  type SubmitHandler,
} from "react-hook-form";

import Button from "../../components/commons/Button";
import type { EjemplarRequest } from "../../models/Ejemplar";

export type EjemplarFormData =
  Omit<EjemplarRequest, "libroId">;

interface EjemplarFormProps {
  libroId: number;
  initialValues: EjemplarFormData;
  editingId: number | null;
  loading: boolean;
  onSubmit: (data: EjemplarFormData) => void;
  onCancel: () => void;
}

export default function EjemplarForm({
  libroId,
  initialValues,
  editingId,
  loading,
  onSubmit,
  onCancel,
}: EjemplarFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EjemplarFormData>({
    defaultValues: initialValues,
  });

  const inputClass = (error?: string) =>
    `w-full rounded-xl border px-4 py-3 outline-none transition
    focus:ring-4 disabled:bg-slate-50 ${
      error
        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
        : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/10"
    }`;

  const submit: SubmitHandler<
    EjemplarFormData
  > = (data) => {
    onSubmit({
      ...data,
      codigoInventario:
        data.codigoInventario.trim().toUpperCase(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="space-y-5"
    >
      {/* INFORMACIÓN DEL LIBRO */}
      <div className="rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Libro
        </p>

        <p className="mt-1 text-sm font-medium text-slate-700">
          ID del libro: #{libroId}
        </p>
      </div>

      {/* CÓDIGO DE INVENTARIO */}
      <div>
        <label
          htmlFor="codigoInventario"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Código de inventario
        </label>

        <input
          id="codigoInventario"
          type="text"
          maxLength={50}
          disabled={loading}
          placeholder="Ej. LIB-0001"
          {...register("codigoInventario", {
            required:
              "El código de inventario es obligatorio.",

            minLength: {
              value: 2,
              message:
                "El código debe tener al menos 2 caracteres.",
            },

            maxLength: {
              value: 50,
              message:
                "El código no puede superar los 50 caracteres.",
            },

            validate: (value) =>
              value.trim().length > 0 ||
              "El código de inventario es obligatorio.",
          })}
          className={inputClass(
            errors.codigoInventario?.message
          )}
        />

        {errors.codigoInventario && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.codigoInventario.message}
          </p>
        )}

        <p className="mt-1.5 text-xs text-slate-400">
          Código único utilizado para identificar físicamente
          el ejemplar.
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
            : "Crear ejemplar"}
        </Button>
      </div>
    </form>
  );
}
