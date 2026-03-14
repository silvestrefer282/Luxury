import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {}
});

// Interceptor para agregar el token si existe (luego lo usaremos para login)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

// Interceptor para manejar errores de respuesta (como el 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export const reservacionService = {
    getAll: (params = {}) => api.get('reservaciones/', { params }),
    getDisponibilidad: (fecha) => api.get(`reservaciones/disponibilidad/?fecha=${fecha}`),
    create: (data) => api.post('reservaciones/', data),
    cancelar: (id) => api.post(`reservaciones/${id}/cancelar/`),
};

export const paqueteService = {
    getAll: (params = {}) => api.get('paquetes/', { params }),
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

export const contratoService = {
    getAll: (params = {}) => api.get('contratos/', { params }),
    create: (data) => api.post('contratos/', data),
    update: (id, data) => api.patch(`contratos/${id}/`, data),
    delete: (id) => api.delete(`contratos/${id}/`),
};

export const clienteService = {
    getAll: () => api.get('clientes/'),
};

export const pagoContratoService = {
    getAll: () => api.get('pagos-contrato/'),
    create: (data) => api.post('pagos-contrato/', data),
    update: (id, data) => api.patch(`pagos-contrato/${id}/`, data),
    delete: (id) => api.delete(`pagos-contrato/${id}/`),
};

export const testimonioService = {
    getAll: (params = {}) => api.get('testimonios/', { params }),
    create: (data) => api.post('testimonios/', data),
    update: (id, data) => api.patch(`testimonios/${id}/`, data),
    delete: (id) => api.delete(`testimonios/${id}/`),
};

export const usuarioService = {
    getAll: () => api.get('usuarios/'),
    create: (data) => api.post('usuarios/', data),
    update: (id, data) => api.patch(`usuarios/${id}/`, data),
    delete: (id) => api.delete(`usuarios/${id}/`),
};

export default api;
export const authService = {
    login: (credentials) => api.post('usuarios/login/', {
        username: credentials.email,
        password: credentials.password
    }),
    registro: (userData) => api.post('usuarios/registro/', {
        username: userData.email,
        email: userData.email,
        password: userData.password,
        first_name: userData.nombre,
        apellido_paterno: userData.apellido_paterno || '',
        apellido_materno: userData.apellido_materno || '',
        telefono: userData.telefono || '',
        rol: 'Cliente'
    }),
};
