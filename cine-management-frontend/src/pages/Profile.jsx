import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";

export default function Profile() {
  const [reservas, setReservas] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: "" });

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        // Hacemos la petición GET a tu backend.
        // Al enviar el token en api.js, el backend sabe quién eres y debería devolver solo TUS reservas.
        const response = await api.get("/reservas/mis-reservas");
        setReservas(response.data);
        setStatus({ loading: false, error: "" });
      } catch (err) {
        console.error("Error al cargar reservas:", err);
        setStatus({
          loading: false,
          error: "Hubo un problema al cargar tu historial de entradas.",
        });
      }
    };
    fetchReservas();
  }, []);

  if (status.loading) {
    return (
      <div className="py-20 text-center text-gray-500 animate-pulse font-medium">
        Buscando tus entradas...
      </div>
    );
  }

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">
          Mis Entradas
        </h2>
        <p className="text-gray-500 mt-1">
          Aquí puedes ver el historial de todas tus reservas.
        </p>
      </div>

      {status.error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl">
          {status.error}
        </div>
      ) : reservas.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Aún no tienes reservas
          </h3>
          <p className="text-gray-500 mb-6">
            Explora nuestra cartelera y encuentra tu próxima película favorita.
          </p>
          <Link
            to="/"
            className="inline-flex px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Ver Cartelera
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reservas.map((reserva) => {
            // Extraemos los datos para que el código sea más limpio
            const funcion = reserva.funcion;
            const pelicula = funcion?.pelicula;
            const sala = funcion?.sala;
            const fecha = funcion ? new Date(funcion.fechaHora) : null;

            return (
              <div
                key={reserva.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col sm:flex-row relative group hover:shadow-md transition-shadow"
              >
                {/* Lado Izquierdo del Ticket (Póster recortado) */}
                <div className="sm:w-1/3 bg-gray-900 h-48 sm:h-auto relative">
                  {pelicula?.posterUrl ? (
                    <img
                      src={pelicula.posterUrl}
                      alt={pelicula?.titulo}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                      Sin póster
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    TICKET
                  </div>
                </div>

                {/* Línea Punteada del Ticket (Efecto Visual) */}
                <div className="hidden sm:block w-0 border-r-2 border-dashed border-gray-200 absolute left-1/3 top-4 bottom-4 z-10"></div>

                {/* Lado Derecho del Ticket (Detalles) */}
                <div className="p-6 sm:w-2/3 flex flex-col justify-center">
                  <h3 className="text-xl font-black text-gray-900 mb-1 leading-tight">
                    {pelicula?.titulo || "Película Desconocida"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {pelicula?.duracion} min • {pelicula?.clasificacion}
                  </p>

                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                        Fecha
                      </p>
                      <p className="font-medium text-gray-800">
                        {fecha ? fecha.toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                        Hora
                      </p>
                      <p className="font-bold text-blue-600">
                        {fecha
                          ? fecha.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                        Sala
                      </p>
                      <p className="font-medium text-gray-800">
                        {sala?.nombre || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold tracking-wider">
                        Asientos
                      </p>
                      <p className="font-medium text-gray-800">
                        {reserva.asientos
                          ?.map((a) =>
                            // Si 'a' ya es un string (ej. "A-1"), lo muestra directo.
                            // Si es un objeto, intenta acceder a fila/columna con validación
                            typeof a === "string"
                              ? a
                              : a.fila
                                ? `${String.fromCharCode(64 + a.fila)}-${a.columna}`
                                : "N/A",
                          )
                          .join(", ") || "Sin asientos"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Círculos recortados para efecto de ticket */}
                <div className="w-6 h-6 bg-gray-50 rounded-full absolute -top-3 left-1/3 -ml-3 hidden sm:block border-b border-gray-200"></div>
                <div className="w-6 h-6 bg-gray-50 rounded-full absolute -bottom-3 left-1/3 -ml-3 hidden sm:block border-t border-gray-200"></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
