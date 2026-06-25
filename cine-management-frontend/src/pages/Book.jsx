import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function Book() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();

  const [funcion, setFuncion] = useState(null);
  const [asientosSeleccionados, setAsientosSeleccionados] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: '', success: '', submitting: false });

  useEffect(() => {
    const fetchFuncion = async () => {
      try {
        const response = await api.get(`/funciones/${showtimeId}`);
        setFuncion(response.data);
        setStatus({ loading: false, error: '', success: '', submitting: false });
      } catch (err) {
        setStatus({ loading: false, error: 'No se pudo cargar la función.', success: '', submitting: false });
      }
    };
    fetchFuncion();
  }, [showtimeId]);

  const toggleAsiento = (fila, columna) => {
    const ocupado = funcion.asientosOcupados?.some(a => a.fila === fila && a.columna === columna);
    if (ocupado) return;

    const yaSeleccionado = asientosSeleccionados.some(a => a.fila === fila && a.columna === columna);

    if (yaSeleccionado) {
      setAsientosSeleccionados(asientosSeleccionados.filter(a => !(a.fila === fila && a.columna === columna)));
    } else {
      setAsientosSeleccionados([...asientosSeleccionados, { fila, columna }]);
    }
  };

  const handleReserva = async () => {
    if (asientosSeleccionados.length === 0) return;
    setStatus(prev => ({ ...prev, submitting: true, error: '' }));

    try {
      // AQUÍ ESTÁ LA MAGIA QUE SOLUCIONA EL ERROR:
      // Mapeamos nuestro array de objetos a un array de strings ["A-1", "A-2"]
      const asientosFormateados = asientosSeleccionados.map(a => {
        const letraFila = String.fromCharCode(64 + a.fila); // Convierte 1 en 'A', 2 en 'B', etc.
        return `${letraFila}-${a.columna}`;
      });

      const payload = {
        funcionId: parseInt(showtimeId, 10),
        asientos: asientosFormateados // Enviamos exactamente lo que pide el backend
      };

      await api.post('/reservas', payload);
      
      setStatus(prev => ({ ...prev, submitting: false, success: '¡Reserva confirmada exitosamente!' }));
      
      setTimeout(() => {
        navigate('/'); // Te enviamos al inicio por ahora
      }, 2000);

    } catch (err) {
      const backendMessage = err.response?.data?.message || 'Error al confirmar la reserva.';
      setStatus(prev => ({ 
        ...prev, 
        submitting: false, 
        error: Array.isArray(backendMessage) ? backendMessage[0] : backendMessage 
      }));
    }
  };

  if (status.loading) return <div className="py-20 text-center text-gray-500 animate-pulse font-medium">Armando la sala de cine...</div>;
  if (status.error && !funcion) return <div className="py-20 text-center text-red-500">{status.error}</div>;

  const totalBs = (asientosSeleccionados.length * funcion.precioEntrada).toFixed(2);

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto flex flex-col lg:flex-row gap-8">
      
      <div className="flex-1 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Selecciona tus asientos</h2>
        
        <div className="w-full h-12 bg-gray-200 rounded-t-3xl mb-12 flex items-center justify-center border-b-4 border-gray-300 shadow-inner">
          <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">Pantalla</span>
        </div>

        <div className="flex justify-center min-w-max pb-4">
          <div 
            className="grid gap-3" 
            style={{ gridTemplateColumns: `repeat(${funcion.sala.columnas}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: funcion.sala.filas }).map((_, filaIndex) => {
              const fila = filaIndex + 1;
              const letraFila = String.fromCharCode(64 + fila); // Letra para la UI
              
              return Array.from({ length: funcion.sala.columnas }).map((_, colIndex) => {
                const columna = colIndex + 1;
                const ocupado = funcion.asientosOcupados?.some(a => a.fila === fila && a.columna === columna);
                const seleccionado = asientosSeleccionados.some(a => a.fila === fila && a.columna === columna);

                let seatClasses = "w-11 h-11 rounded-t-lg rounded-b-sm flex items-center justify-center text-xs font-medium transition-all duration-200 cursor-pointer border-2 ";
                
                if (ocupado) {
                  seatClasses += "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed opacity-60";
                } else if (seleccionado) {
                  seatClasses += "bg-blue-600 border-blue-600 text-white shadow-md transform scale-105";
                } else {
                  seatClasses += "bg-white border-gray-300 text-gray-600 hover:border-blue-400 hover:bg-blue-50";
                }

                return (
                  <button
                    key={`${fila}-${columna}`}
                    onClick={() => toggleAsiento(fila, columna)}
                    disabled={ocupado}
                    className={seatClasses}
                    title={`Fila ${letraFila}, Asiento ${columna}`}
                  >
                    {/* Ahora los botones mostrarán A-1, B-2, etc. en la pantalla */}
                    {letraFila}-{columna}
                  </button>
                );
              });
            })}
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-10 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-t-sm bg-white border-2 border-gray-300"></div><span className="text-sm text-gray-600">Disponible</span></div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-t-sm bg-blue-600 border-2 border-blue-600"></div><span className="text-sm text-gray-600">Seleccionado</span></div>
          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-t-sm bg-gray-200 border-2 border-gray-300 opacity-60"></div><span className="text-sm text-gray-600">Ocupado</span></div>
        </div>
      </div>

      <div className="lg:w-80 shrink-0">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
          <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Resumen de Compra</h3>
          
          <div className="space-y-3 mb-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Película</p>
              <p className="font-semibold text-gray-900">{funcion.pelicula.titulo}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Sala & Fecha</p>
              <p className="font-medium text-gray-800">{funcion.sala.nombre}</p>
              <p className="text-sm text-gray-600">{new Date(funcion.fechaHora).toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Entradas:</span>
              <span className="font-bold text-gray-900">{asientosSeleccionados.length}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold text-gray-900">Total:</span>
              <span className="font-black text-blue-600">Bs. {totalBs}</span>
            </div>
          </div>

          {status.error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{status.error}</div>}
          {status.success && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg">{status.success}</div>}

          <button
            onClick={handleReserva}
            disabled={asientosSeleccionados.length === 0 || status.submitting}
            className="w-full py-3 min-h-[44px] bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
          >
            {status.submitting ? 'Procesando...' : 'Confirmar Reserva'}
          </button>
        </div>
      </div>
      
    </div>
  );
}