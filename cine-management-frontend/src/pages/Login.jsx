import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api"; // Importamos nuestra conexión al backend

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Hacemos la petición POST real a la ruta de tu controlador NestJS
      const response = await api.post("/auth/login", formData);

      // 2. Extraemos los datos que nos devuelve el backend
      // (Asumimos que devuelve un token y los datos del usuario)
      const token = response.data.token || response.data.access_token;
      // Tu backend podría devolver el rol dentro del objeto user
      const userRole =
        response.data.rol || response.data.role || response.data.user?.rol;

      if (!token) {
        throw new Error("El servidor no devolvió un token de acceso.");
      }

      // 3. Guardamos la sesión en el navegador
      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole);

      // 4. Redirección basada en roles
      // Usamos window.location.href en lugar de navigate para forzar
      // una recarga rápida y que el Navbar se actualice automáticamente.
      if (userRole === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Error de login:", err);
      // Extraemos el mensaje de error del backend si existe
      const backendMessage =
        err.response?.data?.message || "Correo o contraseña incorrectos.";
      // NestJS a veces devuelve los errores en un arreglo, lo manejamos por si acaso
      setError(
        Array.isArray(backendMessage) ? backendMessage[0] : backendMessage,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Bienvenido de nuevo a{" "}
            <span className="text-blue-600">CINEFLEX</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200 cursor-pointer flex justify-center"
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
