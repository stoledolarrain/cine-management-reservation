import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Navbar from "./components/layout/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Cartelera from "./pages/Cartelera";
import Book from "./pages/Book";
import Movie from "./pages/Movie";
import Profile from "./pages/Profile";

import AdminMovies from "./pages/admin/Movies";
import AdminRooms from "./pages/admin/Rooms";
import AdminShowtimes from "./pages/admin/Showtimes";
import AdminMovieForm from "./pages/admin/MovieForm";
import AdminSalas from "./pages/admin/AdminSalas";

const ProtectedRoute = ({ roleRequerido }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequerido && userRole !== roleRequerido) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

const AdminDashboard = () => (
  <div className="p-8">
    <h2 className="text-2xl font-semibold text-gray-900">
      Bienvenido al Panel de Administrador
    </h2>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<Cartelera />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/movie/:id" element={<Movie />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/book/:showtimeId" element={<Book />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route element={<ProtectedRoute roleRequerido="admin" />}>
              <Route path="/admin" element={<AdminMovies />} />
              <Route path="/admin/movies" element={<AdminMovies />} />
              <Route path="/admin/rooms" element={<AdminRooms />} />
              <Route path="/admin/showtimes" element={<AdminShowtimes />} />
              <Route path="/admin/movies/new" element={<AdminMovieForm />} />
              <Route
                path="/admin/movies/edit/:id"
                element={<AdminMovieForm />}
              />
              <Route path="/admin/salas" element={<AdminSalas />} />
            </Route>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
