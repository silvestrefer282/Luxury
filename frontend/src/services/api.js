import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {}
});

// Interceptor para agregar el token si existe (luego lo usaremos para login)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const reservacionService = {
    getAll: () => api.get('reservaciones/'),
    getDisponibilidad: (fecha) => api.get(`reservaciones/disponibilidad/?fecha=${fecha}`),
    create: (data) => api.post('reservaciones/', data),
    cancelar: (id) => api.post(`reservaciones/${id}/cancelar/`),
};

export const paqueteService = {
    getAll: () => api.get('paquetes/'),
    create: (data) => api.post('paquetes/', data),
    update: (id, data) => api.patch(`paquetes/${id}/`, data),
    delete: (id) => api.delete(`paquetes/${id}/`),
};

export const menuService = {
    getAll: () => api.get('menus/'),
    create: (data) => api.post('menus/', data),
    update: (id, data) => api.patch(`menus/${id}/`, data),
    delete: (id) => api.delete(`menus/${id}/`),
    
    // Categorías y Platillos
    getCategorias: () => api.get('categorias-menu/'),
    createCategoria: (data) => api.post('categorias-menu/', data),
    updateCategoria: (id, data) => api.patch(`categorias-menu/${id}/`, data),
    deleteCategoria: (id) => api.delete(`categorias-menu/${id}/`),
    
    getPlatillos: () => api.get('platillos/'),
    createPlatillo: (data) => api.post('platillos/', data),
    updatePlatillo: (id, data) => api.patch(`platillos/${id}/`, data),
    deletePlatillo: (id) => api.delete(`platillos/${id}/`),
};

export const servicioService = {
    getAll: () => api.get('servicios/'),
    create: (data) => api.post('servicios/', data),
    update: (id, data) => api.patch(`servicios/${id}/`, data),
    delete: (id) => api.delete(`servicios/${id}/`),
};

export const galeriaService = {
    getAll: () => api.get('galeria/'),
    create: (data) => api.post('galeria/', data),
    update: (id, data) => api.patch(`galeria/${id}/`, data),
    delete: (id) => api.delete(`galeria/${id}/`),
};

export default api;