// src/pages/admin/Movies.jsx
import { useState } from "react";
import api from "../../lib/api";

export default function AdminMovies() {
  const [formData, setFormData] = useState({
    titulo: "",
    sinopsis: "",
    genero: "Accion",
    duracion: "",
    clasificacion: "Todo público",
    imagenPoster: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus({ loading: false, error: "", success: "" }); // Limpiar alertas al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    try {
      // Convertimos duración a número antes de enviarlo
      const payload = {
        ...formData,
        duracion: parseInt(formData.duracion, 10),
      };

      // Hacemos el POST al backend (Asume que estás logueado como admin y api.js inyecta el token)
      await api.post("/peliculas", payload);

      setStatus({
        loading: false,
        error: "",
        success: "¡Película creada exitosamente!",
      });
      // Limpiamos el formulario
      setFormData({
        titulo: "",
        sinopsis: "",
        genero: "Accion",
        duracion: "",
        clasificacion: "Todo público",
        imagenPoster: "",
      });
    } catch (err) {
      console.error(err);
      setStatus({
        loading: false,
        error:
          err.response?.data?.message ||
          "Error al crear la película. Verifica tus permisos de administrador.",
        success: "",
      });
    }
  };

  return (
    <div className="py-8 px-4 max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          Gestión de Películas
        </h2>
        <p className="text-gray-500 mt-1">
          Añade nuevas películas a la cartelera del cine.
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold mb-6 border-b pb-4 text-gray-800">
          Crear Nueva Película
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo: Título */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                name="titulo"
                required
                value={formData.titulo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                placeholder="Ej. Avengers: Endgame"
              />
            </div>

            {/* Campo: Género */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Género
              </label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
              >
                <option value="Accion">Acción</option>
                <option value="Comedia">Comedia</option>
                <option value="Drama">Drama</option>
                <option value="Ciencia Ficcion">Ciencia Ficción</option>
                <option value="Terror">Terror</option>
              </select>
            </div>

            {/* Campo: Clasificación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clasificación
              </label>
              <select
                name="clasificacion"
                value={formData.clasificacion}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none bg-white"
              >
                <option value="Todo público">Todo público</option>
                <option value="+14">+14</option>
                <option value="R">R (Restringido)</option>
              </select>
            </div>

            {/* Campo: Duración */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración (minutos)
              </label>
              <input
                type="number"
                name="duracion"
                required
                min="1"
                value={formData.duracion}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                placeholder="Ej. 120"
              />
            </div>

            {/* Campo: Imagen URL (Simplificado para principiantes por ahora) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de la Imagen (Póster)
              </label>
              <input
                type="url"
                name="imagenPoster"
                required
                value={formData.imagenPoster}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                placeholder="https://ejemplo.com/poster.jpg"
              />
            </div>

            {/* Campo: Sinopsis */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sinopsis
              </label>
              <textarea
                name="sinopsis"
                required
                rows="4"
                value={formData.sinopsis}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none"
                placeholder="Breve descripción de la película..."
              />
            </div>
          </div>

          {/* Alertas de Feedback */}
          {status.error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {status.error}
            </div>
          )}
          {status.success && (
            <div className="p-3 bg-green-50 text-green-700 text-sm font-medium rounded-lg">
              {status.success}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={status.loading}
              className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              {status.loading ? "Guardando..." : "Crear Película"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
