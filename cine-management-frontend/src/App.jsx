import { BrowserRouter, Routes, Route } from "react-router-dom";

const Navbar = () => (
  <nav className="p-4 border-b bg-white text-gray-900 flex justify-between items-center">
    <h1 className="text-xl font-bold tracking-tighter">
      CINE<span className="text-blue-600">FLEX</span>
    </h1>
    <div className="space-x-4">
      <a
        href="/login"
        className="text-sm font-medium hover:text-blue-600 transition-colors"
      >
        Iniciar Sesión
      </a>
      <a
        href="/register"
        className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
      >
        Registro
      </a>
    </div>
  </nav>
);

const Cartelera = () => (
  <div className="p-8">
    <h2 className="text-2xl font-semibold">Cartelera Pública</h2>
  </div>
);
const Login = () => (
  <div className="p-8">
    <h2 className="text-2xl font-semibold">Login</h2>
  </div>
);
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
            <Route path="/" element={<Cartelera />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<div>Registro</div>} />
            <Route path="/movie/:id" element={<DetallePelicula />} />

            <Route
              path="/book/:showtimeId"
              element={<div>Selección de Asientos</div>}
            />
            <Route path="/profile" element={<div>Mis Reservas</div>} />

            <Route path="/admin" element={<AdminDashboard />} />
            <Route
              path="/admin/movies"
              element={<div>Gestión de Películas</div>}
            />
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
