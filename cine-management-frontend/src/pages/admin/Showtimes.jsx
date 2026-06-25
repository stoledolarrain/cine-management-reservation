import { useState, useEffect } from "react";
import api from "../../lib/api";

export default function AdminShowtimes() {
  const [peliculas, setPeliculas] = useState([]);
  const [salas, setSalas] = useState([]);

  const [formData, setFormData] = useState({
    peliculaId: "",
    salaId: "",
    fechaHora: "",
    precioEntrada: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
    fetching: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resPeliculas, resSalas] = await Promise.all([
          api.get("/peliculas"),
          api.get("/salas"),
        ]);
        setPeliculas(resPeliculas.data);
        setSalas(resSalas.data);
        setStatus((prev) => ({ ...prev, fetching: false }));
      } catch (err) {
        setStatus((prev) => ({
          ...prev,
          fetching: false,
          error: "Error al cargar películas y salas.",
        }));
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus({ ...status, error: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ ...status, loading: true, error: "", success: "" });

    try {
      const payload = {
        peliculaId: parseInt(formData.peliculaId, 10),
        salaId: parseInt(formData.salaId, 10),
        fechaHora: new Date(formData.fechaHora).toISOString(),
        precioEntrada: parseFloat(formData.precioEntrada),
      };

      await api.post("/funciones", payload);

      setStatus({
        ...status,
        loading: false,
        success: "¡Función programada exitosamente!",
      });
      setFormData({
        peliculaId: "",
        salaId: "",
        fechaHora: "",
        precioEntrada: "",
      });
    } catch (err) {
      console.error(err);
      const backendMessage =
        err.response?.data?.message || "Error al programar la función.";
      setStatus({
        ...status,
        loading: false,
        error: Array.isArray(backendMessage)
          ? backendMessage[0]
          : backendMessage,
      });
    }
  };

  if (status.fetching) {
    return (
      <div className="text-center py-20 text-gray-500 font-medium">
        Cargando información...
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
          Programar Funciones
        </h2>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Película
              </label>
              <select
                name="peliculaId"
                required
                value={formData.peliculaId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white"
              >
                <option value="" disabled>
                  -- Elige una película --
                </option>
                {peliculas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.titulo}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sala
              </label>
              <select
                name="salaId"
                required
                value={formData.salaId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white"
              >
                <option value="" disabled>
                  -- Elige una sala --
                </option>
                {salas.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha y Hora
              </label>
              <input
                type="datetime-local"
                name="fechaHora"
                required
                value={formData.fechaHora}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio de Entrada (Bs.)
              </label>
              <input
                type="number"
                name="precioEntrada"
                required
                min="0"
                step="0.10"
                value={formData.precioEntrada}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none"
                placeholder="Ej. 45.50"
              />
            </div>
          </div>

          {status.error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {status.error}
            </div>
          )}
          {status.success && (
            <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg">
              {status.success}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={status.loading}
              className="px-6 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium rounded-lg"
            >
              {status.loading ? "Programando..." : "Crear Función"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
