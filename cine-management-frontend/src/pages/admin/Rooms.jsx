import { useState } from "react";
import api from "../../lib/api";

export default function AdminRooms() {
  const [formData, setFormData] = useState({
    nombre: "",
    filas: "",
    columnas: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  // Cálculo en tiempo real de la capacidad
  const filasNum = parseInt(formData.filas, 10) || 0;
  const columnasNum = parseInt(formData.columnas, 10) || 0;
  const capacidadTotal = filasNum * columnasNum;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus({ loading: false, error: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    if (capacidadTotal <= 0) {
      setStatus({
        loading: false,
        error: "La capacidad total debe ser mayor a 0.",
        success: "",
      });
      return;
    }

    try {
      const payload = {
        nombre: formData.nombre,
        filas: filasNum,
        columnas: columnasNum,
      };

      // Enviamos la petición a tu backend NestJS
      await api.post("/salas", payload);

      setStatus({
        loading: false,
        error: "",
        success: "¡Sala creada exitosamente!",
      });
      setFormData({ nombre: "", filas: "", columnas: "" });
    } catch (err) {
      console.error(err);
      const backendMessage =
        err.response?.data?.message || "Error al crear la sala.";
      setStatus({
        loading: false,
        error: Array.isArray(backendMessage)
          ? backendMessage[0]
          : backendMessage,
        success: "",
      });
    }
  };

  return (
    <div className="py-8 px-4 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          Gestión de Salas
        </h2>
        <p className="text-gray-500 mt-1">
          Configura las dimensiones y capacidad de las salas del cine.
        </p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Sala
            </label>
            <input
              type="text"
              name="nombre"
              required
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              placeholder="Ej. Sala 1 - IMAX"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad de Filas
              </label>
              <input
                type="number"
                name="filas"
                required
                min="1"
                max="50"
                value={formData.filas}
                onChange={handleChange}
                className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                placeholder="Ej. 10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad de Columnas
              </label>
              <input
                type="number"
                name="columnas"
                required
                min="1"
                max="50"
                value={formData.columnas}
                onChange={handleChange}
                className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                placeholder="Ej. 15"
              />
            </div>
          </div>

          {/* Tarjeta de Resumen de Capacidad */}
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <span className="block text-sm font-medium text-gray-500">
                Capacidad Total Calculada
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {capacidadTotal}
              </span>
              <span className="text-gray-500 ml-1">asientos</span>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>

          {status.error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {status.error}
            </div>
          )}
          {status.success && (
            <div className="p-3 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-100">
              {status.success}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={status.loading || capacidadTotal <= 0}
              className="px-6 py-3 min-h-[44px] bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors cursor-pointer"
            >
              {status.loading ? "Guardando..." : "Crear Sala"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
