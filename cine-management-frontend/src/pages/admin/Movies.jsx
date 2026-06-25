import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';

export default function Movies() {
  const [peliculas, setPeliculas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarPeliculas();
  }, []);

  const cargarPeliculas = async () => {
    try {
      const res = await api.get('/peliculas');
      setPeliculas(res.data);
    } catch (err) { console.error(err); }
  };

  const eliminar = async (id) => {
    if (window.confirm("¿Borrar película?")) {
      await api.delete(`/peliculas/${id}`);
      cargarPeliculas();
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Películas</h2>
        <button 
          onClick={() => navigate('/admin/movies/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >+ Nueva Película</button>
      </div>
      
      <table className="w-full bg-white rounded-lg shadow-sm border">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 text-left">Título</th>
            <th className="p-4 text-left">Género</th>
            <th className="p-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {peliculas.map(p => (
            <tr key={p.id} className="border-b">
              <td className="p-4">{p.titulo}</td>
              <td className="p-4">{p.genero}</td>
              <td className="p-4 flex gap-2">
                <button onClick={() => navigate(`/admin/movies/edit/${p.id}`)} className="text-blue-600">Editar</button>
                <button onClick={() => eliminar(p.id)} className="text-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}