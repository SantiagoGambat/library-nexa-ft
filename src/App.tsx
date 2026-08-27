import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Books from "./pages/Books";
import Loans from "./pages/Loans";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/usuarios" element={<Users />} />
          <Route
            path="/libros"
            element={<Books />}
          />
          <Route
            path="/prestamos"
            element={<Loans />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
