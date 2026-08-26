import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-h-screen lg:pl-64">
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Gestión de biblioteca
            </h2>
            <p className="text-sm text-slate-500">
              Administra usuarios, libros y préstamos
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 font-semibold text-teal-700">
            A
          </div>
        </header>

        <div className="p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
