import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../lib/api';

export default function MovieForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    titulo: "",
    sinopsis: "",
    genero: "Accion",
    duracion: "",
    clasificacion: "Todo público",
  });
  
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  useEffect(() => {
    if (id) {
      api.get(`/peliculas/${id}`).then(res => setFormData(res.data));
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    const data = new FormData();
    // Añadimos todos los campos de texto
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    // Añadimos el archivo con la clave 'file' (debe coincidir con FileInterceptor en backend)
    if (file) data.append("file", file);

    try {
      if (id) await api.put(`/peliculas/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' }});
      else await api.post("/peliculas", data, { headers: { 'Content-Type': 'multipart/form-data' }});

      setStatus({ loading: false, error: "", success: "Película guardada exitosamente." });
      setTimeout(() => navigate('/admin/movies'), 1000);
    } catch (err) {
      setStatus({ loading: false, error: "Error al guardar. Verifica los datos.", success: "" });
    }
  };

  return (
    <div className="py-8 px-4 max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6">{id ? 'Editar' : 'Crear'} Película</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input name="titulo" placeholder="Título" required value={formData.titulo} onChange={handleChange} className="w-full p-2 border rounded" />
        
        <div className="grid grid-cols-2 gap-4">
          <select name="genero" value={formData.genero} onChange={handleChange} className="p-2 border rounded">
            <option value="Accion">Acción</option>
            <option value="Comedia">Comedia</option>
            <option value="Terror">Terror</option>
            <option value="Ciencia Ficcion">Ciencia Ficción</option>
            <option value="Romance">Romance</option>
          </select>
          <select name="clasificacion" value={formData.clasificacion} onChange={handleChange} className="p-2 border rounded">
            <option value="Todo público">Todo público</option>
            <option value="+14">+14</option>
            <option value="R">R (Restringido)</option>
          </select>
        </div>

        <input type="number" name="duracion" placeholder="Duración (min)" required value={formData.duracion} onChange={handleChange} className="w-full p-2 border rounded" />
        <textarea name="sinopsis" placeholder="Sinopsis" value={formData.sinopsis} onChange={handleChange} className="w-full p-2 border rounded" rows="4" />
        
        <label className="block text-sm font-medium">Póster</label>
        <input type="file" onChange={e => setFile(e.target.files[0])} className="w-full p-2 border rounded" />

        <button type="submit" disabled={status.loading} className="w-full bg-blue-600 text-white p-3 rounded-lg">
          {status.loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}