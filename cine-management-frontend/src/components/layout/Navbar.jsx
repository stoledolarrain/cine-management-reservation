import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate('/');
    window.location.reload(); 
  };

  return (
    <nav className="p-4 border-b bg-white text-gray-900 flex justify-between items-center shadow-sm sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold tracking-tighter">
        CINE<span className="text-blue-600">FLEX</span>
      </Link>
      
      <div className="space-x-6 flex items-center">
        {!token ? (
          <>
            <Link to="/login" className="text-sm font-medium hover:text-blue-600">Iniciar Sesión</Link>
          </>
        ) : (
          <>
            {/* VISTA DEL CLIENTE */}
            {role === 'cliente' && (
              <>
                <Link to="/profile" className="text-sm font-medium text-gray-600 hover:text-blue-600">Mis Reservas</Link>
              </>
            )}

            {/* VISTA DEL ADMINISTRADOR */}
            {role === 'admin' && (
              <>
                <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-blue-600">Dashboard</Link>
                <Link to="/admin/movies" className="text-sm font-medium text-gray-600 hover:text-blue-600">Películas</Link>
                <Link to="/admin/showtimes" className="text-sm font-medium text-gray-600 hover:text-blue-600">Funciones</Link>
              </>
            )}
            
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-600 hover:text-red-700 cursor-pointer"
            >
              Salir
            </button>
          </>
        )}
      </div>
    </nav>
  );
}