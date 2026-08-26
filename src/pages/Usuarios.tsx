import { useEffect, useState } from "react";

import type { Usuario } from "../models/Usuario";
import { initialAlert, type AlertState } from "../models/Alert";

import Button from "../components/commons/Button";
import Modal from "../components/commons/Modal";
import AlertModal from "../components/commons/AlertModal";
import Loader from "../components/commons/Loader";

import UsuarioTable from "./usuario/UsuarioTable";
import UsuarioForm, { type UsuarioFormData } from "./usuario/UsuarioForm";
import ConfirmModal from "../components/commons/ConfirmModal";
import { usersService } from "../services/userService";

const emptyUser: UsuarioFormData = {
  nombre: "",
  apellido: "",
  email: "",
  fechaNacimiento: "",
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [loadingMessage, setLoadingMessage] = useState("Cargando...");

  const [alert, setAlert] = useState<AlertState>(initialAlert);

  const [confirmDelete, setConfirmDelete] = useState<Usuario | null>(null);

  const startLoading = (message: string) => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

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

  const closeAlert = () => {
    setAlert((previous) => ({
      ...previous,
      open: false,
    }));
  };

  const loadUsers = async () => {
    try {
      startLoading("Cargando usuarios...");

      const [data] = await Promise.all([usersService.list(), delay(800)]);

      setUsuarios(data);
    } catch (error) {
      console.error(error);

      showAlert(
        "error",
        "Error al cargar usuarios",
        "No fue posible obtener los usuarios.",
      );
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUser(usuario);
    setIsModalOpen(true);
  };

  const handleCloseForm = () => {
    if (isLoading) return;

    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSave = async (data: UsuarioFormData) => {
    const user: Usuario = {
      ...data,
      nombre: data.nombre.trim(),
      apellido: data.apellido.trim(),
      email: data.email.trim().toLowerCase(),
    };

    const isEditing = editingUser !== null;

    try {
      startLoading(
        isEditing ? "Actualizando usuario..." : "Creando usuario...",
      );

      await Promise.all([
        isEditing
          ? usersService.update(editingUser.id!, user)
          : usersService.create(user),
        delay(1000),
      ]);

      setIsModalOpen(false);
      setEditingUser(null);

      showAlert(
        "success",
        isEditing ? "Usuario actualizado" : "Usuario creado",
        isEditing
          ? "El usuario fue actualizado correctamente."
          : "El usuario fue creado correctamente.",
      );

      await loadUsers();
    } catch (error) {
      console.error(error);

      showAlert(
        "error",
        "No se pudo guardar el usuario",
        "Ocurrió un error al guardar el usuario.",
      );
    } finally {
      stopLoading();
    }
  };

  const handleDelete = async (user: Usuario) => {
    if(user.id){
      setConfirmDelete(user!);
    }
  };

  const deleteUserById = async (id: number) => {
    try {
      startLoading("Eliminando usuario...");

      await Promise.all([usersService.delete(id), delay(800)]);

      showAlert(
        "success",
        "Usuario eliminado",
        "El usuario fue eliminado correctamente.",
      );

      await loadUsers();
    } catch (error) {
      console.error(error);

      showAlert(
        "error",
        "No se pudo eliminar el usuario",
        "Ocurrió un error al eliminar el usuario.",
      );
    } finally {
      stopLoading();
    }
  };

  const initialFormValues: UsuarioFormData = editingUser
    ? {
        nombre: editingUser.nombre,
        apellido: editingUser.apellido,
        email: editingUser.email,
        fechaNacimiento: editingUser.fechaNacimiento,
      }
    : emptyUser;

  return (
    <section>
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1 text-sm font-semibold text-teal-600">
            Administración
          </p>

          <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>

          <p className="mt-1 text-sm text-slate-500">
            Administra los usuarios registrados en la biblioteca.
          </p>
        </div>

        <Button onClick={handleCreate} disabled={isLoading}>
          + Nuevo usuario
        </Button>
      </div>

      {/* Table */}
      <UsuarioTable
        usuarios={usuarios}
        loading={isLoading}
        deletingId={null}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Form */}
      <Modal
        open={isModalOpen}
        title={editingUser !== null ? "Editar usuario" : "Nuevo usuario"}
        onClose={handleCloseForm}
      >
        <UsuarioForm
          initialValues={initialFormValues}
          editingId={editingUser?.id ?? null}
          loading={isLoading}
          onSubmit={handleSave}
          onCancel={handleCloseForm}
        />
      </Modal>

      {/* Alerts */}
      <AlertModal
        open={alert.open}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={closeAlert}
      />

      <ConfirmModal
        open={confirmDelete !== null}
        title="Eliminar usuario"
        message={
          confirmDelete
            ? `¿Estás seguro de que deseas eliminar a ${confirmDelete.nombre} ${confirmDelete.apellido}? Esta acción no se puede deshacer.`
            : ""
        }
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={() => {
          setConfirmDelete(null);
          if (confirmDelete?.id) {
            deleteUserById(confirmDelete?.id);
          }
        }}
      />

      {/* Loading */}
      {isLoading && <Loader message={loadingMessage} />}
    </section>
  );
}
