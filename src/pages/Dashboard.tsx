import { Link } from "react-router-dom";

const cards = [
  {
    title: "Usuarios",
    description: "Gestiona los usuarios de la biblioteca.",
    path: "/usuarios",
    color: "bg-teal-50 text-teal-700",
    icon: "♙",
  },
  {
    title: "Libros",
    description: "Administra el catálogo de libros.",
    path: "/libros",
    color: "bg-blue-50 text-blue-700",
    icon: "▤",
  },
  {
    title: "Préstamos",
    description: "Registra y consulta préstamos.",
    path: "/prestamos",
    color: "bg-violet-50 text-violet-700",
    icon: "↗",
  },
];

export default function Dashboard() {
  return (
    <section>
      <div className="mb-10">
        <span className="text-sm font-semibold text-teal-600">
          Bienvenido
        </span>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Panel de administración
        </h1>

        <p className="mt-2 max-w-2xl text-slate-500">
          Gestiona de forma sencilla los usuarios, libros y préstamos de
          la biblioteca.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl text-xl ${card.color}`}
            >
              {card.icon}
            </div>

            <h2 className="text-lg font-bold text-slate-900">
              {card.title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {card.description}
            </p>

            <div className="mt-6 text-sm font-semibold text-teal-600 transition group-hover:translate-x-1">
              Administrar →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
