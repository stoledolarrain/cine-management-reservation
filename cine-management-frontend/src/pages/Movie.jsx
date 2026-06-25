import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function Movie() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const API_URL = "http://localhost:3000";
  
  const [pelicula, setPelicula] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const response = await api.get(`/peliculas/${id}`);
        setPelicula(response.data);
      } catch (err) {
        console.error("Error cargando detalles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetalle();
  }, [id]);

  if (loading) return <div className="py-20 text-center animate-pulse text-gray-500">Cargando película...</div>;
  if (!pelicula) return <div className="py-20 text-center text-red-500">Película no encontrada.</div>;

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        
        <div className="md:w-1/3 bg-gray-900 relative">
          {pelicula.posterUrl ? (
            <img 
              src={`${API_URL}${pelicula.posterUrl}`} 
              alt={pelicula.titulo} 
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="w-full h-96 flex items-center justify-center text-gray-500">Sin póster</div>
          )}
        </div>

        <div className="p-8 md:p-12 md:w-2/3 flex flex-col">
          <div className="mb-2 flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-md">
              {pelicula.genero}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider rounded-md">
              {pelicula.clasificacion}
            </span>
            <span className="text-sm text-gray-500 font-medium">
              {pelicula.duracion} min
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
            {pelicula.titulo}
          </h1>
          
          <p className="text-gray-600 text-lg leading-relaxed mb-10">
            {pelicula.sinopsis}
          </p>

          <div className="mt-auto border-t border-gray-100 pt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Funciones Disponibles</h3>
            
            {pelicula.funciones && pelicula.funciones.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pelicula.funciones.map((funcion) => (
                  <div key={funcion.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-500 transition-colors bg-gray-50 hover:bg-white flex flex-col justify-between">
                    <div className="mb-4">
                      <p className="font-semibold text-gray-900 text-lg">
                        {new Date(funcion.fechaHora).toLocaleDateString()}
                      </p>
                      <p className="text-blue-600 font-bold">
                        {new Date(funcion.fechaHora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{funcion.sala.nombre} • Bs. {funcion.precioEntrada}</p>
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/book/${funcion.id}`)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Comprar Entradas
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-gray-50 rounded-xl text-center text-gray-500">
                No hay funciones programadas para esta película todavía.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}