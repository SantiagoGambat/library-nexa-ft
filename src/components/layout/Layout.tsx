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

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">Santiago Gamba</p>

              <p className="text-xs text-slate-400">santiago.gamba26@email.com</p>

              <a
                href="https://www.linkedin.com/in/santiagogdev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-teal-600 transition-colors hover:text-teal-700 hover:underline"
              >
                Ver LinkedIn →
              </a>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700 ring-4 ring-teal-50">
              S
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
