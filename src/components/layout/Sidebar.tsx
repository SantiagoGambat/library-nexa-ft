import { NavLink } from "react-router-dom";

const navigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: "▦",
  },
  {
    name: "Usuarios",
    path: "/usuarios",
    icon: "♙",
  },
  {
    name: "Libros",
    path: "/libros",
    icon: "▤",
  },
  {
    name: "Préstamos",
    path: "/prestamos",
    icon: "↗",
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      <div className="flex h-20 items-center border-b border-slate-100 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white shadow-lg shadow-teal-600/20">
            L
          </div>

          <div>
            <h1 className="font-bold text-slate-900">Libreria Nexa</h1>
            <p className="text-xs text-slate-400">Sistema de Manejo</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menú principal
        </p>

        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="m-4 rounded-2xl bg-slate-900 p-4 text-white">
        <p className="text-sm font-semibold">Library API</p>
        <p className="mt-1 text-xs text-slate-400">
          Sistema de gestión bibliotecaria
        </p>
      </div>
    </aside>
  );
}
