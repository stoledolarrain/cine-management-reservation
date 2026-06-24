import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// 1. Importamos nuestras páginas reales
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cartelera from "./pages/Cartelera";
import AdminMovies from "./pages/admin/Movies";

// Componente Navbar (Se mantiene igual)
const Navbar = () => (
  <nav className="p-4 border-b bg-white text-gray-900 flex justify-between items-center shadow-sm">
    <Link to="/" className="text-xl font-bold tracking-tighter">
      CINE<span className="text-blue-600">FLEX</span>
    </Link>
    <div className="space-x-4">
      <Link
        to="/login"
        className="text-sm font-medium hover:text-blue-600 transition-colors"
      >
        Iniciar Sesión
      </Link>
      <Link
        to="/register"
        className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Registro
      </Link>
    </div>
  </nav>
);

// ¡AQUÍ BORRAMOS EL FALSO COMPONENTE CARTELERA!

// Estos componentes falsos se quedan por ahora hasta que creemos sus archivos reales
const DetallePelicula = () => (
  <div className="p-8">
    <h2 className="text-2xl font-semibold">Detalle de Película</h2>
  </div>
);
const AdminDashboard = () => (
  <div className="p-8">
    <h2 className="text-2xl font-semibold text-red-600">
      Panel de Administrador
    </h2>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />

        <main className="max-w-7xl mx-auto">
          <Routes>
            {/* Aquí usa el componente Cartelera que importamos de ./pages/Cartelera */}
            <Route path="/" element={<Cartelera />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/movie/:id" element={<DetallePelicula />} />
            <Route
              path="/book/:showtimeId"
              element={<div>Selección de Asientos</div>}
            />
            <Route path="/profile" element={<div>Mis Reservas</div>} />

            {/* Rutas de Admin */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/movies" element={<AdminMovies />} />
            <Route path="/admin/rooms" element={<div>Gestión de Salas</div>} />
            <Route
              path="/admin/showtimes"
              element={<div>Gestión de Funciones</div>}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
