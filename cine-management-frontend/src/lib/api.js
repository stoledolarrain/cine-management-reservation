// src/lib/api.js
import axios from "axios";

// Creamos una instancia configurada apuntando a tu backend (NestJS por defecto usa el puerto 3000)
const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Interceptor: Antes de que salga cualquier petición, verificamos si hay un token guardado.
// Si lo hay, lo adjuntamos a la cabecera. Así el backend sabrá quiénes somos.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Guardaremos el token en el LocalStorage al hacer login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
