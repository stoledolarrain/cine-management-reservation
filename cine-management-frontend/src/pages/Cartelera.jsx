// src/pages/Cartelera.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function Cartelera() {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para la búsqueda que tu backend soporta
  const [buscar, setBuscar] = useState("");
  const [genero, setGenero] = useState("");

  const fetchPeliculas = async () => {
    setLoading(true);
    try {
      // Usamos el endpoint público que vimos en tu controlador
      // Le pasamos los params para que arme la URL: /peliculas?buscar=...&genero=...
      const response = await api.get("/peliculas", {
        params: { buscar: buscar || undefined, genero: genero || undefined },
      });
      setPeliculas(response.data);
      setError("");
    } catch (err) {
      setError(
        "No se pudieron cargar las películas. Verifica que el backend esté encendido.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta al montar el componente o cuando cambian los filtros
  useEffect(() => {
    fetchPeliculas();
  }, [buscar, genero]);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Cabecera y Filtros */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Cartelera
          </h2>
          <p className="text-gray-500 mt-1">
            Descubre las películas en emisión
          </p>
        </div>

        {/* Controles de Búsqueda */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Buscar película..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm"
          />
          <select
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none text-sm bg-white cursor-pointer"
          >
            <option value="">Todos los géneros</option>
            <option value="Accion">Acción</option>
            <option value="Comedia">Comedia</option>
            <option value="Terror">Terror</option>
            <option value="Ciencia Ficcion">Ciencia Ficción</option>
          </select>
        </div>
      </div>

      {/* Manejo de Estados (Cargando y Error) */}
      {loading && (
        <p className="text-center text-gray-500 py-10 animate-pulse">
          Cargando cartelera...
        </p>
      )}
      {error && (
        <p className="text-center text-red-500 py-10 bg-red-50 rounded-lg">
          {error}
        </p>
      )}

      {/* Grilla de Películas (Minimalista y profesional) */}
      {!loading && !error && peliculas.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          No se encontraron películas.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {peliculas.map((pelicula) => (
          <Link
            to={`/movie/${pelicula.id}`}
            key={pelicula.id}
            className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
          >
            <div className="aspect-[2/3] w-full bg-gray-200 relative overflow-hidden">
              {/* Fallback de imagen en caso de que no tenga */}
              {pelicula.imagenPoster ? (
                <img
                  src={pelicula.imagenPoster}
                  alt={`Póster de ${pelicula.titulo}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <span>Sin Imagen</span>
                </div>
              )}
              {/* Badge de clasificación flotante */}
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-900 shadow-sm">
                {pelicula.clasificacion || "TP"}
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase mb-1">
                {pelicula.genero}
              </span>
              <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">
                {pelicula.titulo}
              </h3>
              <div className="mt-auto flex items-center text-sm text-gray-500">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {pelicula.duracion} min
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
