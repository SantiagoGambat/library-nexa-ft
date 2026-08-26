import { useForm, type SubmitHandler } from "react-hook-form";

import Button from "../../components/commons/Button";
import type { Usuario } from "../../models/Usuario";

export type UsuarioFormData = Omit<Usuario, "id">;

interface UsuarioFormProps {
  initialValues: UsuarioFormData;
  editingId: number | null;
  loading: boolean;
  onSubmit: (data: UsuarioFormData) => void;
  onCancel: () => void;
}

export default function UsuarioForm({
  initialValues,
  editingId,
  loading,
  onSubmit,
  onCancel,
}: UsuarioFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsuarioFormData>({
    defaultValues: initialValues,
  });

  const inputClass = (error?: string) =>
    `w-full rounded-xl border px-4 py-3 outline-none transition
    focus:ring-4 disabled:bg-slate-50 ${
      error
        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
        : "border-slate-200 focus:border-teal-500 focus:ring-teal-500/10"
    }`;

  const submit: SubmitHandler<UsuarioFormData> = (
    data
  ) => {
    onSubmit({
      ...data,
      nombre: data.nombre.trim(),
      apellido: data.apellido.trim(),
      email: data.email.trim().toLowerCase(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="space-y-5"
    >
      {/* Nombre */}
      <div>
        <label
          htmlFor="nombre"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Nombre
        </label>

        <input
          id="nombre"
          type="text"
          maxLength={50}
          disabled={loading}
          placeholder="Ej. Juan"
          {...register("nombre", {
            required: "El nombre es obligatorio.",
            minLength: {
              value: 2,
              message:
                "El nombre debe tener al menos 2 caracteres.",
            },
            maxLength: {
              value: 50,
              message:
                "El nombre no puede superar los 50 caracteres.",
            },
          })}
          className={inputClass(
            errors.nombre?.message
          )}
        />

        {errors.nombre && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.nombre.message}
          </p>
        )}
      </div>

      {/* Apellido */}
      <div>
        <label
          htmlFor="apellido"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Apellido
        </label>

        <input
          id="apellido"
          type="text"
          maxLength={50}
          disabled={loading}
          placeholder="Ej. Pérez"
          {...register("apellido", {
            required: "El apellido es obligatorio.",
            minLength: {
              value: 2,
              message:
                "El apellido debe tener al menos 2 caracteres.",
            },
            maxLength: {
              value: 50,
              message:
                "El apellido no puede superar los 50 caracteres.",
            },
          })}
          className={inputClass(
            errors.apellido?.message
          )}
        />

        {errors.apellido && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.apellido.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          maxLength={100}
          disabled={loading}
          placeholder="juan.perez@email.com"
          {...register("email", {
            required: "El email es obligatorio.",
            maxLength: {
              value: 100,
              message:
                "El email no puede superar los 100 caracteres.",
            },
            pattern: {
              value:
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message:
                "Ingresa un correo electrónico válido.",
            },
          })}
          className={inputClass(
            errors.email?.message
          )}
        />

        {errors.email && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Fecha de nacimiento */}
      <div>
        <label
          htmlFor="fechaNacimiento"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Fecha de nacimiento
        </label>

        <input
          id="fechaNacimiento"
          type="date"
          disabled={loading}
          max={new Date()
            .toISOString()
            .split("T")[0]}
          {...register("fechaNacimiento", {
            required:
              "La fecha de nacimiento es obligatoria.",

            validate: (value) => {
              if (!value) {
                return "La fecha de nacimiento es obligatoria.";
              }

              const fecha = new Date(
                `${value}T00:00:00`
              );

              const hoy = new Date();

              if (fecha > hoy) {
                return "La fecha no puede ser futura.";
              }

              let edad =
                hoy.getFullYear() -
                fecha.getFullYear();

              const mes =
                hoy.getMonth() -
                fecha.getMonth();

              if (
                mes < 0 ||
                (mes === 0 &&
                  hoy.getDate() <
                    fecha.getDate())
              ) {
                edad--;
              }

              if (edad < 1) {
                return "El usuario debe tener al menos 1 año.";
              }

              if (edad > 120) {
                return "La fecha de nacimiento no es válida.";
              }

              return true;
            },
          })}
          className={inputClass(
            errors.fechaNacimiento?.message
          )}
        />

        {errors.fechaNacimiento && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.fechaNacimiento.message}
          </p>
        )}
      </div>

      {/* Acciones */}
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
            : "Crear usuario"}
        </Button>
      </div>
    </form>
  );
}
