import { useState } from "react";
import api from "../../lib/api";

export default function AdminSalas() {
  const [formData, setFormData] = useState({ nombre: "", filas: 5, columnas: 5 });
  const [status, setStatus] = useState({ loading: false, success: "", error: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: "", error: "" });
    try {
      await api.post("/salas", {
        nombre: formData.nombre,
        filas: parseInt(formData.filas, 10),
        columnas: parseInt(formData.columnas, 10),
      });
      
      setStatus({ loading: false, success: "Sala creada con éxito", error: "" });
      setFormData({ nombre: "", filas: 5, columnas: 5 });
    } catch (err) {
      setStatus({ loading: false, success: "", error: "Error al crear sala" });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Crear Nueva Sala</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
            placeholder="Nombre de la Sala" 
            className="w-full p-2 border rounded"
            value={formData.nombre} 
            onChange={e => setFormData({...formData, nombre: e.target.value})} 
        />
        <input 
            type="number" placeholder="Filas" className="w-full p-2 border rounded"
            value={formData.filas} onChange={e => setFormData({...formData, filas: e.target.value})} 
        />
        <input 
            type="number" placeholder="Columnas" className="w-full p-2 border rounded"
            value={formData.columnas} onChange={e => setFormData({...formData, columnas: e.target.value})} 
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Crear Sala</button>
      </form>
      {status.success && <p className="text-green-600 mt-4">{status.success}</p>}
      {status.error && <p className="text-red-600 mt-4">{status.error}</p>}
    </div>
  );
}