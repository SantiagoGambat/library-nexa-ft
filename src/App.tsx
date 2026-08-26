import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Usuarios from "./pages/Usuarios";

function Placeholder({ title }: { title: string }) {
  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-500">
        Esta sección estará disponible próximamente.
      </p>
    </section>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route
            path="/libros"
            element={<Placeholder title="Libros" />}
          />
          <Route
            path="/prestamos"
            element={<Placeholder title="Préstamos" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
