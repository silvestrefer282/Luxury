import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Package,
    Utensils,
    CalendarCheck,
    Settings,
    Users,
    TrendingUp,
    LogOut,
    Plus,
    Filter,
    Search,
    Clock,
    UserCircle,
    Image as ImageIcon,
    Trash2,
    Edit3,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    paqueteService, 
    reservacionService,
    menuService, 
    servicioService,
    galeriaService 
} from '../services/api';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [userRole, setUserRole] = useState('admin'); // admin | encargado
    const [scrolled, setScrolled] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin'] },
        { id: 'reservations', label: 'Reservaciones', icon: CalendarCheck, roles: ['admin', 'encargado'] },
        { id: 'packages', label: 'Paquetes', icon: Package, roles: ['admin'] },
        { id: 'adicionales', label: 'Adicionales', icon: Plus, roles: ['admin'] },
        { id: 'menus', label: 'Menús', icon: Utensils, roles: ['admin'] },
        { id: 'gallery', label: 'Galería', icon: ImageIcon, roles: ['admin'] },
        { id: 'users', label: 'Usuarios / Roles', icon: Users, roles: ['admin'] },
        { id: 'settings', label: 'Configuración', icon: Settings, roles: ['admin'] },
    ];

    const tabTitles = {
        dashboard: { main: 'Administración', italic: 'Central', sub: 'LUXURY OPS' },
        reservations: { main: 'Control de', italic: 'Reservas', sub: 'BITÁCORA DE EVENTOS' },
        packages: { main: 'Catálogo de', italic: 'Paquetes', sub: 'INVENTARIO EDITORIAL' },
        adicionales: { main: 'Servicios', italic: 'Complementarios', sub: 'CURADURÍA DE EXTRAS' },
        menus: { main: 'Propuesta', italic: 'Gastronómica', sub: 'MENÚS Y PLATILLOS' },
        gallery: { main: 'Gestión de', italic: 'Galería', sub: 'ACTIVOS VISUALES' },
        users: { main: 'Usuarios y', italic: 'Roles', sub: 'CONTROL DE ACCESO' },
        settings: { main: 'Configuración', italic: 'General', sub: 'SISTEMA' },
    };

    // Sidebar Component
    const Sidebar = () => (
        <div className="w-80 h-screen bg-luxury-black text-luxury-white p-10 flex flex-col fixed left-0 top-0 border-r border-white/10 shadow-2xl z-[100]">
            <div className="mb-20">
                <h1 className="font-serif text-3xl uppercase tracking-widest italic font-light text-white">Luxury</h1>
                <span className="text-[10px] uppercase tracking-[0.4em] text-luxury-gray-light font-bold block mt-2">Panel de Control</span>
            </div>

            <nav className="flex-1 space-y-10">
                {menuItems.filter(item => item.roles.includes(userRole)).map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-6 group transition-all duration-300 ${activeTab === item.id ? 'text-luxury-white' : 'text-luxury-gray-mid hover:text-white'
                            }`}
                    >
                        <div className={`p-3 transition-all duration-500 shadow-xl ${activeTab === item.id ? 'bg-white text-luxury-black' : 'bg-luxury-gray-dark text-luxury-gray-light group-hover:bg-luxury-white group-hover:text-luxury-black'}`}>
                            <item.icon size={18} />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">{item.label}</span>
                        {activeTab === item.id && (
                            <motion.div layoutId="sidebarActive" className="ml-auto w-1 h-8 bg-white" />
                        )}
                    </button>
                ))}
            </nav>

            <div className="mt-auto pt-10 border-t border-white/10 flex items-center gap-6">
                <div className="w-12 h-12 bg-luxury-gray-dark flex items-center justify-center border border-white/10">
                    <UserCircle size={24} className="text-white/60" />
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold">{userRole}</p>
                    <button className="text-[9px] uppercase tracking-widest font-bold text-luxury-gray-mid hover:text-luxury-white transition-colors flex items-center gap-2 mt-1">
                        <LogOut size={12} /> Salir
                    </button>
                </div>
            </div>
        </div>
    );

    // Dashboard Content Example
    const DashboardView = () => (
        <div className="space-y-24 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            {/* Stats Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {[
                    { label: 'Total Clientes', val: '24', icon: Users, color: 'text-luxury-black' },
                    { label: 'Total Reservas', val: '12', icon: CalendarCheck, color: 'text-luxury-black' },
                    { label: 'Reservas Pendientes', val: '0', icon: Clock, color: 'text-luxury-black' },
                    { label: 'Ingresos Estimados', val: '$157,000', icon: TrendingUp, color: 'text-luxury-black' },
                ].map((stat, i) => (
                    <div key={i} className="p-10 border border-luxury-black/5 bg-white group hover:bg-luxury-black transition-all duration-700 shadow-sm hover:shadow-2xl">
                        <div className="flex justify-between items-start mb-10">
                            <stat.icon size={18} className="text-luxury-black opacity-30 group-hover:opacity-100 group-hover:text-white transition-all duration-500" />
                            <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-luxury-gray-light group-hover:text-luxury-gray-mid transition-colors">Luxury Metrics</span>
                        </div>
                        <p className="text-5xl font-serif mb-4 leading-none text-luxury-black group-hover:text-white transition-colors">{stat.val}</p>
                        <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid group-hover:text-white transition-all">{stat.label}</h4>
                    </div>
                ))}
            </div>

            {/* Recent Reservations Table */}
            <div className="p-20 border border-luxury-black/5 bg-white shadow-xl overflow-hidden relative group/table">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover/table:opacity-[0.07] transition-opacity duration-1000">
                    <TrendingUp size={200} className="text-luxury-black" />
                </div>
                
                <div className="flex justify-between items-end mb-20 px-2 relative z-10">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-luxury-gray-mid block mb-4 italic">Bitácora Editorial</span>
                        <h2 className="text-6xl font-serif uppercase tracking-tight text-luxury-black">Reservas <span className="italic font-light text-luxury-gray-mid">Recientes</span></h2>
                    </div>
                    <button className="text-[10px] uppercase tracking-[0.4em] font-bold border-b-2 border-luxury-black pb-3 text-luxury-black hover:opacity-50 transition-all duration-300">Exportar Reporte Maestro</button>
                </div>
                
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-luxury-black/10">
                                <th className="pb-10 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid px-6 italic">Cliente / Identificación</th>
                                <th className="pb-10 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid px-6">Tipo de Evento</th>
                                <th className="pb-10 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid px-6">Fecha Evento</th>
                                <th className="pb-10 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid px-6 text-center">Estado</th>
                                <th className="pb-10 text-right text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid px-6">Inversión</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-luxury-black/5">
                            {reservas.slice(0, 5).map((res) => (
                                <tr key={res.id} className="group hover:bg-luxury-black transition-all duration-700">
                                    <td className="py-12 px-6">
                                        <p className="text-[12px] uppercase tracking-[0.1em] font-bold mb-1 font-serif text-luxury-black group-hover:text-white">{res.cliente}</p>
                                        <span className="text-[9px] uppercase tracking-widest text-luxury-gray-mid font-bold group-hover:text-luxury-gray-light">{res.email}</span>
                                    </td>
                                    <td className="py-12 px-6">
                                        <span className="text-[11px] uppercase tracking-widest text-luxury-gray-dark font-medium group-hover:text-luxury-gray-light">{res.paquete}</span>
                                    </td>
                                    <td className="py-12 px-6 text-xs font-light text-luxury-gray-mid group-hover:text-luxury-gray-light/50">{res.fecha}</td>
                                    <td className="py-12 px-6 text-center">
                                        <span className={`text-[9px] uppercase tracking-[0.4em] font-black px-5 py-2.5 border-2 transition-all duration-500 ${
                                            res.estado === 'Cancelada' 
                                            ? 'bg-transparent border-red-900/10 text-red-900/40 group-hover:border-red-900 group-hover:text-red-500' 
                                            : 'bg-luxury-black border-luxury-black text-luxury-white group-hover:bg-white group-hover:border-white group-hover:text-black'
                                        }`}>
                                            {res.estado}
                                        </span>
                                    </td>
                                    <td className="py-12 px-6 text-right">
                                        <span className="text-3xl font-serif font-light tracking-tighter text-luxury-black group-hover:text-white">{res.total}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-16 flex justify-center border-t border-luxury-black/5 pt-12">
                    <button className="text-[10px] uppercase tracking-[0.8em] font-bold text-luxury-gray-light hover:text-luxury-black transition-all duration-[1000ms] cursor-pointer">Ver historial completo de operaciones</button>
                </div>
            </div>
        </div>
    );
    const [packages, setPackages] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [adicionales, setAdicionales] = useState([]);
    const [menus, setMenus] = useState({});
    const [galeria, setGaleria] = useState([]);
    const [reservaFilter, setReservaFilter] = useState('Todas');
    const [galleryFilter, setGalleryFilter] = useState('Todas');

    const [editingPackage, setEditingPackage] = useState(null);
    const [isAddingPackage, setIsAddingPackage] = useState(false);
    const [deletedGalleryIds, setDeletedGalleryIds] = useState([]);
    
    // Estados para previsualización en tiempo real
    const [coverPreview, setCoverPreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]); // Array de obj {file, url}
    const [coverFile, setCoverFile] = useState(null);
    const [editingAdicional, setEditingAdicional] = useState(null);
    const [isAddingAdicional, setIsAddingAdicional] = useState(false);
    const [isAddingGallery, setIsAddingGallery] = useState(false);

    // Estado controlado para adicionales
    const [adicionalForm, setAdicionalForm] = useState({
        name: '',
        price: '',
        category: 'Entretenimiento'
    });

    const handleAdicionalFormChange = (e) => {
        const { name, value } = e.target;
        setAdicionalForm(prev => ({ ...prev, [name]: value }));
    };

    const resetAdicionalForm = () => {
        setAdicionalForm({
            name: '',
            price: '',
            category: 'Entretenimiento'
        });
    };

    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        type: 'confirm', // confirm | alert
        confirmText: 'Confirmar'
    });

    const triggerConfirm = (title, message, onConfirm, confirmText = 'Confirmar') => {
        setConfirmState({ isOpen: true, title, message, onConfirm, type: 'confirm', confirmText });
    };

    const triggerAlert = (title, message) => {
        setConfirmState({ isOpen: true, title, message, onConfirm: null, type: 'alert', confirmText: 'Entendido' });
    };

    // Estado controlado para el formulario de paquetes
    const [packageForm, setPackageForm] = useState({
        name: '',
        price: '',
        capacity: '',
        duration: 5,
        extraHourPrice: 0,
        includedServices: '',
        notes: ''
    });

    const handlePackageFormChange = (e) => {
        const { name, value } = e.target;
        setPackageForm(prev => ({ ...prev, [name]: value }));
    };

    const resetPackageForm = () => {
        setPackageForm({
            name: '',
            price: '',
            capacity: '',
            duration: 5,
            extraHourPrice: 0,
            includedServices: '',
            notes: ''
        });
        setCoverPreview(null);
        setCoverFile(null);
        setGalleryPreviews([]);
        setDeletedGalleryIds([]);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setSearchTerm('');
    }, [activeTab]);

    const normalizeText = (text) => {
        return text ? text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
    };

    const formatImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        // Si viene como path relativo, asegurar que tenga el dominio
        return `http://127.0.0.1:8000${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const fetchData = async () => {
        try {
            const [respPkg, respRes, respAd, respCats, respPlat, respGal] = await Promise.all([
                paqueteService.getAll(),
                reservacionService.getAll(),
                servicioService.getAll(),
                menuService.getCategorias(),
                menuService.getPlatillos(),
                galeriaService.getAll()
            ]);
            
            setPackages(respPkg.data.map(p => ({
                id: p.id,
                name: p.nombre,
                price: p.precio_base,
                capacity: p.capacidad_personas,
                duration: p.duracion_horas,
                extraHourPrice: p.precio_hora_adicional,
                includedServices: p.servicios_incluidos,
                notes: p.notas,
                image: formatImageUrl(p.imagen) || '/images/Foto 1.jpg',
                gallery: (p.galeria || []).map(img => ({ id: img.id, url: formatImageUrl(img.imagen) })),
                layout: 'Editorial'
            })));

            setReservas(respRes.data.map(r => ({
                id: r.id,
                cliente: r.cliente_nombre || 'Cliente Anonimo',
                email: 'info@sirlux.mx',
                invitados: r.num_personas,
                fecha: r.fecha_evento,
                paquete: r.paquete_nombre,
                estado: r.estado,
                total: `$${Number(r.total_estimado).toLocaleString()}`
            })));

            setAdicionales(respAd.data.map(a => ({
                id: a.id,
                name: a.nombre,
                price: a.precio_unitario,
                category: a.categoria,
                url: formatImageUrl(a.imagen)
            })));

            setGaleria(respGal.data.map(g => ({
                id: g.id,
                title: g.titulo,
                url: formatImageUrl(g.imagen),
                category: g.categoria
            })));

            const menuObj = {};
            respCats.data.forEach(cat => {
                menuObj[cat.nombre] = {
                    id: cat.id,
                    items: respPlat.data
                        .filter(p => p.categoria === cat.id)
                        .map(p => ({ 
                            id: p.id, 
                            nombre: p.nombre,
                            imagen: formatImageUrl(p.imagen)
                        }))
                };
            });
            setMenus(menuObj);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleCreateGallery = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = new FormData();
        data.append('titulo', formData.get('titulo'));
        data.append('categoria', formData.get('categoria'));
        data.append('descripcion', 'Composición exclusiva de Luxury');
        
        const img = formData.get('imagen');
        if (img && img.size > 0) data.append('imagen', img);

        try {
            await galeriaService.create(data);
            fetchData();
            setIsAddingGallery(false);
            triggerAlert("Composición Exitosa", "La nueva pieza ha sido integrada a la galería editorial con éxito.");
        } catch (error) {
            triggerAlert("Reserva del Sistema", "No se pudo procesar la carga de la imagen en este momento.");
        }
    };

    const handleDeleteGallery = async (id) => {
        triggerConfirm(
            "Eliminar Escena", 
            "¿Desea retirar permanentemente esta composición de la galería maestra?",
            async () => {
                try {
                    await galeriaService.delete(id);
                    fetchData();
                } catch (error) {
                    triggerAlert("Error de Archivo", "No se pudo eliminar la escena seleccionada.");
                }
            },
            "Eliminar"
        );
    };

    const handleCreatePackage = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = new FormData();
        data.append('nombre', formData.get('name'));
        data.append('precio_base', formData.get('price'));
        data.append('capacidad_personas', formData.get('capacity'));
        data.append('duracion_horas', formData.get('duration'));
        data.append('precio_hora_adicional', formData.get('extraHourPrice'));
        data.append('servicios_incluidos', formData.get('includedServices'));
        data.append('notas', formData.get('notes'));
        
        if (coverFile) {
            data.append('imagen', coverFile);
        }

        galleryPreviews.forEach(p => {
            data.append('galeria_imgs', p.file);
        });
        
        try {
            await paqueteService.create(data);
            fetchData();
            setIsAddingPackage(false);
            resetPackageForm();
            triggerAlert("Catálogo Actualizado", "El nuevo paquete ha sido publicado exitosamente en su inventario.");
        } catch (error) {
            triggerAlert("Error de Publicación", "Ocurrió un inconveniente al intentar registrar la nueva pieza editorial.");
        }
    };

    const handleUpdatePackage = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = new FormData();
        data.append('nombre', formData.get('name'));
        data.append('precio_base', formData.get('price'));
        data.append('capacidad_personas', formData.get('capacity'));
        data.append('duracion_horas', formData.get('duration'));
        data.append('precio_hora_adicional', formData.get('extraHourPrice'));
        data.append('servicios_incluidos', formData.get('includedServices'));
        data.append('notas', formData.get('notes'));
        
        if (coverFile) {
            data.append('imagen', coverFile);
        }

        galleryPreviews.forEach(p => {
            data.append('galeria_imgs', p.file);
        });

        // Enviar IDs de imágenes a borrar si existen
        if (deletedGalleryIds.length > 0) {
            deletedGalleryIds.forEach(id => data.append('deleted_gallery_ids', id));
        }

        try {
            await paqueteService.update(editingPackage.id, data);
            fetchData();
            setEditingPackage(null);
            resetPackageForm();
            triggerAlert("Edición Finalizada", "Se han guardado los cambios en la pieza de la colección.");
        } catch (error) {
            triggerAlert("Error de Refinamiento", "No se han podido procesar los cambios realizados en el paquete.");
        }
    };

    const handleDeletePackage = async (id) => {
        triggerConfirm(
            "Eliminar Paquete",
            "¿Está seguro de eliminar permanentemente este paquete de la colección?",
            async () => {
                try {
                    await paqueteService.delete(id);
                    fetchData();
                } catch (error) {
                    triggerAlert("Error de Sistema", "No fue posible eliminar el registro en este momento.");
                }
            },
            "Eliminar"
        );
    };

    const handleCancelReservation = async (id) => {
        triggerConfirm(
            "Anular Reserva",
            "¿Desea proceder con la anulación formal de esta reserva editorial?",
            async () => {
                try {
                    await reservacionService.cancelar(id);
                    fetchData();
                } catch (error) {
                    triggerAlert("Error de Reserva", "No se pudo procesar la cancelación del evento.");
                }
            },
            "Anular"
        );
    };

    const handleCreateAdicional = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = new FormData();
        data.append('nombre', formData.get('name'));
        data.append('precio_unitario', formData.get('price'));
        data.append('categoria', formData.get('category'));
        data.append('tipo_cobro', 'Por Evento');
        data.append('descripcion', 'Servicio exclusivo');
        
        const img = formData.get('imagen');
        if (img && img.size > 0) data.append('imagen', img);

        try {
            await servicioService.create(data);
            fetchData();
            setIsAddingAdicional(false);
            resetAdicionalForm();
            triggerAlert("Servicio Registrado", "El nuevo servicio complementario ha sido añadido exitosamente.");
        } catch (error) {
            triggerAlert("Error de Catálogo", "No se pudo registrar el nuevo servicio en el sistema.");
        }
    };

    const handleUpdateAdicional = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = new FormData();
        data.append('nombre', formData.get('name'));
        data.append('precio_unitario', formData.get('price'));
        data.append('categoria', formData.get('category'));
        
        const img = formData.get('imagen');
        if (img && img.size > 0) data.append('imagen', img);

        try {
            await servicioService.update(editingAdicional.id, data);
            fetchData();
            setEditingAdicional(null);
            resetAdicionalForm();
            triggerAlert("Cambios Guardados", "La propuesta del servicio ha sido refinada exitosamente.");
        } catch (error) {
            triggerAlert("Error de Actualización", "Hubo un problema al intentar actualizar el servicio.");
        }
    };

    const handleDeleteAdicional = async (id) => {
        triggerConfirm(
            "Retirar Servicio",
            "¿Desea eliminar este servicio de su catálogo de servicios complementarios?",
            async () => {
                try {
                    await servicioService.delete(id);
                    fetchData();
                } catch (error) {
                    triggerAlert("Error de Operación", "No fue posible retirar el servicio del sistema.");
                }
            }
        );
    };

    const [adicionalFilter, setAdicionalFilter] = useState('Todos');
    const adCategories = ['Todos', 'Entretenimiento', 'Decoración', 'Gastronomía', 'Estructura', 'Fotografía'];

    const PackagesView = () => (
        <div className="space-y-16 animate-in fade-in slide-in-from-right-5 duration-700">
            <div className="h-px bg-luxury-black/10 w-full mb-16"></div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                {packages
                    .filter(pkg => normalizeText(pkg.name).includes(normalizeText(searchTerm)))
                    .map((pkg) => (
                    <div key={pkg.id} className="flex bg-white border border-luxury-black/5 hover:border-luxury-black transition-all duration-700 overflow-hidden min-h-[22rem] h-auto group shadow-sm hover:shadow-2xl">
                        <div className="w-2/5 overflow-hidden relative">
                            <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-luxury-black/20 group-hover:bg-transparent transition-colors duration-700" />
                        </div>
                        <div className="flex-1 p-10 flex flex-col justify-between relative">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                                <Package size={80} />
                            </div>
                            <div className="relative z-10">
                                <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gray-mid font-bold block mb-4">Registro: #00{pkg.id}</span>
                                <h3 className="text-3xl font-serif uppercase tracking-tighter mb-8 text-luxury-black group-hover:translate-x-2 transition-transform duration-500">{pkg.name}</h3>
                                <div className="flex gap-12">
                                    <div>
                                        <p className="text-[9px] uppercase tracking-[0.4em] text-luxury-gray-mid font-bold mb-2">Inversión Base</p>
                                        <p className="text-2xl font-serif font-light text-luxury-black">${Number(pkg.price).toLocaleString()}</p>
                                    </div>
                                    <div className="border-l border-luxury-black/10 pl-12">
                                        <p className="text-[9px] uppercase tracking-[0.4em] text-luxury-gray-mid font-bold mb-2">Aforo Máximo</p>
                                        <p className="text-2xl font-serif font-light text-luxury-black">{pkg.capacity} <span className="text-xs uppercase tracking-widest text-luxury-gray-mid">Pax</span></p>
                                    </div>
                                </div>
                                
                                {/* Galería rápida en la tarjeta */}
                                {pkg.gallery?.length > 0 && (
                                    <div className="flex gap-2 mt-6 overflow-hidden">
                                        {pkg.gallery.slice(0, 4).map((img, i) => (
                                            <div key={i} className="w-10 h-10 border border-luxury-black/5 overflow-hidden flex-shrink-0">
                                                <img src={img.url} alt="Gallery thumb" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                                            </div>
                                        ))}
                                        {pkg.gallery.length > 4 && (
                                            <div className="w-10 h-10 bg-luxury-gray-dark flex items-center justify-center text-[10px] text-white font-bold">
                                                +{pkg.gallery.length - 4}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2 border-t border-luxury-black/10 pt-8 mt-6 z-10">
                                <button 
                                    onClick={() => { 
                                        setEditingPackage(pkg); 
                                        setPackageForm({
                                            name: pkg.name || '',
                                            price: pkg.price || '',
                                            capacity: pkg.capacity || '',
                                            duration: pkg.duration || 5,
                                            extraHourPrice: pkg.extraHourPrice || 0,
                                            includedServices: pkg.includedServices || '',
                                            notes: pkg.notes || ''
                                        });
                                        setDeletedGalleryIds([]); 
                                        setCoverPreview(null);
                                        setCoverFile(null);
                                        setGalleryPreviews([]);
                                    }} 
                                    className="flex-1 py-5 bg-luxury-black text-luxury-white text-[10px] uppercase tracking-[0.5em] font-bold hover:bg-luxury-gray-dark transition-all duration-500 shadow-xl flex items-center justify-center gap-4"
                                >
                                    <Edit3 size={14} /> Editar Registro
                                </button>
                                <button 
                                    onClick={() => handleDeletePackage(pkg.id)}
                                    className="w-16 h-16 flex items-center justify-center border border-red-700/10 text-red-700 hover:bg-red-700 hover:text-white transition-all shadow-sm"
                                    title="Eliminar Registro"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Package Editor/Creator Modal */}
            <AnimatePresence>
                {(editingPackage || isAddingPackage) && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[3000] bg-black/95 flex items-center justify-center p-10"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-white max-w-2xl w-full p-20 relative shadow-2xl max-h-[85vh] overflow-y-auto custom-scrollbar"
                        >
                            <button 
                                onClick={() => { 
                                    setEditingPackage(null); 
                                    setIsAddingPackage(false); 
                                    setDeletedGalleryIds([]); 
                                    setCoverPreview(null);
                                    setCoverFile(null);
                                    setGalleryPreviews([]);
                                }} 
                                className="absolute top-10 right-10 opacity-40 hover:opacity-100 transition-opacity"
                            >
                                <X size={30} />
                            </button>

                            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-black/40 block mb-6 px-1 border-l-2 border-luxury-black">
                                {isAddingPackage ? 'Nuevo Registro' : 'Editor de Catálogo'}
                            </span>
                            <h2 className="text-5xl font-serif uppercase tracking-tight mb-16">
                                {isAddingPackage ? 'Crear' : 'Paquete'} <span className="italic font-light">{isAddingPackage ? 'Nuevo Paquete' : editingPackage.name}</span>
                            </h2>

                            <style>{`
                                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                                .custom-scrollbar::-webkit-scrollbar-thumb { background: #000; }
                            `}</style>

                            <form onSubmit={isAddingPackage ? handleCreatePackage : handleUpdatePackage} className="space-y-12">
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Nombre del Paquete</label>
                                    <input 
                                        name="name" 
                                        required
                                        value={packageForm.name} 
                                        onChange={handlePackageFormChange}
                                        className="w-full border-b border-black/10 py-4 px-2 focus:border-black outline-none font-serif text-2xl transition-all" 
                                        placeholder="Ej. Banquete Imperial"
                                    />
                                </div>
                                <div className="h-px bg-black/5 w-full"></div>
                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Precio Base ($)</label>
                                        <input 
                                            name="price" 
                                            type="number" 
                                            required
                                            value={packageForm.price} 
                                            onChange={handlePackageFormChange}
                                            className="w-full border-b border-black/10 py-4 px-2 focus:border-black outline-none text-xl font-light transition-all" 
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Aforo (Pax)</label>
                                        <input 
                                            name="capacity" 
                                            type="number" 
                                            required
                                            value={packageForm.capacity} 
                                            onChange={handlePackageFormChange}
                                            className="w-full border-b border-black/10 py-4 px-2 focus:border-black outline-none text-xl font-light transition-all" 
                                            placeholder="100"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Duración Alquiler (Hrs)</label>
                                        <input 
                                            name="duration" 
                                            type="number" 
                                            required
                                            value={packageForm.duration} 
                                            onChange={handlePackageFormChange}
                                            className="w-full border-b border-black/10 py-4 px-2 focus:border-black outline-none text-xl font-light transition-all" 
                                            placeholder="5"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Precio Hora Extra ($)</label>
                                        <input 
                                            name="extraHourPrice" 
                                            type="number" 
                                            required
                                            value={packageForm.extraHourPrice} 
                                            onChange={handlePackageFormChange}
                                            className="w-full border-b border-black/10 py-4 px-2 focus:border-black outline-none text-xl font-light transition-all" 
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div className="h-px bg-black/5 w-full"></div>
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Imagen de Portada Principal</label>
                                    {(coverPreview || (editingPackage?.image && !editingPackage.image.includes('Foto 1.jpg'))) && (
                                        <div className="aspect-video w-full overflow-hidden border border-black/5 bg-black/[0.02] relative group">
                                            <img src={coverPreview || editingPackage.image} alt="Actual" className="w-full h-full object-cover opacity-80" />
                                            {coverPreview && (
                                                <button 
                                                    type="button"
                                                    onClick={() => { setCoverPreview(null); setCoverFile(null); }}
                                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={24} className="text-white" />
                                                    <span className="ml-3 text-[10px] text-white uppercase tracking-widest font-bold">Quitar Selección</span>
                                                </button>
                                            )}
                                            {coverPreview && !coverPreview.includes('blob') === false && (
                                                <div className="absolute top-2 left-2 bg-black text-white text-[8px] uppercase tracking-tighter px-2 py-1 font-bold">Nueva Selección</div>
                                            )}
                                        </div>
                                    )}
                                    <div className="flex gap-4 items-center border-b border-black/10 py-2">
                                        <input 
                                            type="file"
                                            name="imageFile"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setCoverFile(file);
                                                    setCoverPreview(URL.createObjectURL(file));
                                                }
                                            }}
                                            className="text-[10px] uppercase tracking-widest font-bold w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-black file:bg-black file:text-white hover:file:bg-black/80"
                                        />
                                    </div>
                                    <p className="text-[9px] uppercase tracking-widest text-black/30 font-bold italic">Reemplazar portada</p>
                                </div>
                                <div className="h-px bg-black/5 w-full"></div>
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Galería del Carrusel (Múltiples)</label>
                                    <div className="grid grid-cols-4 gap-4">
                                        {/* Imágenes ya guardadas */}
                                        {editingPackage?.gallery?.filter(img => !deletedGalleryIds.includes(img.id)).map((img, idx) => (
                                            <div key={`saved-${idx}`} className="aspect-square bg-black/5 border border-black/5 overflow-hidden relative group">
                                                <img src={img.url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                                <button 
                                                    type="button"
                                                    onClick={() => setDeletedGalleryIds([...deletedGalleryIds, img.id])}
                                                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={20} className="text-white" />
                                                </button>
                                            </div>
                                        ))}
                                        {/* Previsualización de nuevas selecciones */}
                                        {galleryPreviews.map((p, idx) => (
                                            <div key={`new-${idx}`} className="aspect-square bg-black/5 border border-black/20 overflow-hidden relative group">
                                                <img src={p.url} alt={`New Gallery ${idx}`} className="w-full h-full object-cover" />
                                                <button 
                                                    type="button"
                                                    onClick={() => setGalleryPreviews(galleryPreviews.filter((_, i) => i !== idx))}
                                                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 size={16} className="text-white" />
                                                </button>
                                                <div className="absolute top-1 right-1 bg-black text-white text-[7px] uppercase p-1 font-bold shadow-xl">Nuevo</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-4 items-center border-b border-black/10 py-2">
                                        <input 
                                            type="file"
                                            name="galleryFiles"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files);
                                                const newPreviews = files.map(file => ({
                                                    file: file,
                                                    url: URL.createObjectURL(file)
                                                }));
                                                // Append to existing previews to allow multiple selection sessions
                                                setGalleryPreviews([...galleryPreviews, ...newPreviews]);
                                                // Reset input value to allow selecting same files if needed
                                                e.target.value = '';
                                            }}
                                            className="text-[10px] uppercase tracking-widest font-bold w-full cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-black file:bg-black file:text-white hover:file:bg-black/80"
                                        />
                                    </div>
                                    <p className="text-[9px] uppercase tracking-widest text-black/30 font-bold italic">Selecciona varias fotos para el carrusel del cliente</p>
                                </div>
                                <div className="h-px bg-black/5 w-full"></div>
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Servicios Incluidos</label>
                                    <textarea 
                                        name="includedServices" 
                                        rows="3"
                                        value={packageForm.includedServices} 
                                        onChange={handlePackageFormChange}
                                        className="w-full border border-black/10 p-4 focus:border-black outline-none font-serif text-lg transition-all resize-none" 
                                        placeholder="Ej. Meseros, Loza, Mantelería..."
                                    />
                                </div>
                                <div className="h-px bg-black/5 w-full"></div>
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Notas Internas</label>
                                    <textarea 
                                        name="notes" 
                                        rows="2"
                                        value={packageForm.notes} 
                                        onChange={handlePackageFormChange}
                                        className="w-full border border-black/10 p-4 focus:border-black outline-none font-serif text-lg transition-all italic resize-none" 
                                        placeholder="Observaciones adicionales..."
                                    />
                                </div>
                                <div className="pt-10">
                                    <button type="submit" className="w-full bg-luxury-black text-white py-6 text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-luxury-gray-dark shadow-2xl transition-all">
                                        {isAddingPackage ? 'Añadir Paquete' : 'Guardar Cambios'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    // Adicionales View
    const AdicionalesView = () => (
        <div className="animate-in fade-in slide-in-from-right-5 duration-700">
            <div className="flex justify-end items-center mb-10 border-b border-luxury-black pb-8">
                <div className="flex gap-4">
                    {adCategories.slice(0, 4).map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => setAdicionalFilter(cat)}
                            className={`text-[10px] uppercase tracking-[0.3em] font-bold px-8 py-3 border rounded-full transition-all duration-300 ${
                                adicionalFilter === cat ? 'bg-luxury-black text-white border-luxury-black shadow-sm' : 'border-black/10 hover:border-black text-luxury-black/60 hover:text-luxury-black shadow-sm'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-8">
                {adicionales
                    .filter(ad => {
                        const matchesFilter = adicionalFilter === 'Todos' || ad.category === adicionalFilter;
                        const matchesSearch = normalizeText(ad.name).includes(normalizeText(searchTerm));
                        return matchesFilter && matchesSearch;
                    })
                    .map((item) => (
                    <div key={item.id} className="group relative bg-white border border-luxury-black/5 hover:border-luxury-black p-12 transition-all duration-1000 shadow-sm hover:shadow-2xl flex flex-col justify-between h-full min-h-[380px] overflow-hidden">
                        {/* Fondo decorativo sutil */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-black/[0.02] -rotate-45 translate-x-16 -translate-y-16 group-hover:bg-luxury-black/[0.05] transition-all duration-1000" />
                        
                        <div className="relative z-10 w-full">
                            <div className="flex justify-between items-center mb-10">
                                <span className="text-[10px] uppercase tracking-[0.6em] text-luxury-gray-mid font-black">{item.category}</span>
                            </div>

                            {item.url && (
                                <div className="w-full aspect-video bg-luxury-white border border-luxury-black/5 overflow-hidden mb-10 grayscale group-hover:grayscale-0 transition-all duration-1000 scale-[1.02] group-hover:scale-100 shadow-sm">
                                    <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                </div>
                            )}

                            <h3 className="text-2xl font-serif text-luxury-black leading-tight mb-8 group-hover:translate-x-2 transition-transform duration-700">{item.name}</h3>
                        </div>

                        <div className="relative z-10 pt-8 border-t border-black/5 flex items-end justify-between">
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.4em] text-luxury-gray-mid font-bold mb-2">Inversión</p>
                                <p className="text-4xl font-serif font-light text-luxury-black">
                                    <span className="text-sm mr-2 opacity-40 font-sans">$</span>
                                    {Number(item.price).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => {
                                        setEditingAdicional(item);
                                        setAdicionalForm({
                                            name: item.name || '',
                                            price: item.price || '',
                                            category: item.category || 'Entretenimiento'
                                        });
                                    }} 
                                    className="w-10 h-10 flex items-center justify-center text-luxury-black hover:bg-luxury-black hover:text-white border border-black/10 transition-all outline-none"
                                >
                                    <Edit3 size={14} />
                                </button>
                                <button 
                                    onClick={() => handleDeleteAdicional(item.id)} 
                                    className="w-10 h-10 flex items-center justify-center text-red-700 hover:bg-red-700 hover:text-white border border-red-700/10 transition-all outline-none"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Adicional Editor/Creator Modal */}
            <AnimatePresence>
                {(editingAdicional || isAddingAdicional) && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[3000] bg-black/95 flex items-center justify-center p-10"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-white max-w-2xl w-full p-20 relative shadow-2xl"
                        >
                            <button 
                                onClick={() => { 
                                    setEditingAdicional(null); 
                                    setIsAddingAdicional(false); 
                                    resetAdicionalForm();
                                }} 
                                className="absolute top-10 right-10 opacity-40 hover:opacity-100 transition-opacity"
                            >
                                <X size={30} />
                            </button>

                            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-black/40 block mb-6 px-1 border-l-2 border-luxury-black">
                                {isAddingAdicional ? 'Nuevo Servicio' : 'Modificación de Propuesta'}
                            </span>
                            <h2 className="text-5xl font-serif uppercase tracking-tight mb-16">
                                {isAddingAdicional ? 'Definir' : 'Ajustar'} <span className="italic font-light">{isAddingAdicional ? 'Adicional' : editingAdicional.name}</span>
                            </h2>

                            <form onSubmit={isAddingAdicional ? handleCreateAdicional : handleUpdateAdicional} className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Nombre del Servicio</label>
                                    <input 
                                        name="name" 
                                        required
                                        value={adicionalForm.name}
                                        onChange={handleAdicionalFormChange}
                                        className="w-full border-b border-black/10 py-4 px-2 focus:border-black outline-none font-serif text-2xl transition-all" 
                                        placeholder="Ej. Audio e Iluminación"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Inversión ($)</label>
                                        <input 
                                            name="price" 
                                            type="number" 
                                            required
                                            value={adicionalForm.price}
                                            onChange={handleAdicionalFormChange}
                                            className="w-full border-b border-black/10 py-4 px-2 focus:border-black outline-none text-xl font-light transition-all" 
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Categoría</label>
                                        <select 
                                            name="category" 
                                            required
                                            value={adicionalForm.category}
                                            onChange={handleAdicionalFormChange}
                                            className="w-full border-b border-black/10 py-4 px-2 focus:border-black outline-none text-xl font-light transition-all bg-transparent"
                                        >
                                            <option value="Entretenimiento">Entretenimiento</option>
                                            <option value="Decoración">Decoración</option>
                                            <option value="Gastronomía">Gastronomía</option>
                                            <option value="Estructura">Estructura</option>
                                            <option value="Fotografía">Fotografía</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Imagen Representativa</label>
                                    <div className="flex items-center gap-8 p-8 border border-dashed border-luxury-black/10 rounded-xl hover:border-luxury-black transition-all">
                                        <div className="w-20 h-20 bg-luxury-white flex items-center justify-center rounded-full border border-luxury-black/5">
                                            <ImageIcon className="text-luxury-black/20" size={32} />
                                        </div>
                                        <div className="flex-1">
                                            <input 
                                                type="file" 
                                                name="imagen"
                                                className="text-[10px] uppercase tracking-widest font-bold file:mr-6 file:py-3 file:px-8 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-luxury-black file:text-white hover:file:bg-luxury-gray-dark cursor-pointer"
                                            />
                                            <p className="mt-2 text-[9px] text-black/30 font-bold uppercase tracking-widest">Formato: JPG, PNG o WEBP (Máx. 5MB)</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-10">
                                    <button type="submit" className="w-full bg-luxury-black text-white py-6 text-[11px] uppercase tracking-[0.5em] font-bold hover:bg-luxury-gray-dark shadow-2xl transition-all">
                                        {isAddingAdicional ? 'Añadir Servicio' : 'Guardar Cambios'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    // Menus Views and Logic fixed
    const [newItemName, setNewItemName] = useState('');
    const [newItemFile, setNewItemFile] = useState(null);
    const [editingMenuCategory, setEditingMenuCategory] = useState(null);

    const handleAddCategory = async () => {
        const name = prompt('Ingrese el nombre de la nueva categoría gastronómica:');
        if (name) {
            try {
                await menuService.createCategoria({ nombre: name.toLowerCase() });
                fetchData();
                triggerAlert("Categoría Creada", `La sección de ${name} ha sido añadida exitosamente.`);
            } catch (error) {
                triggerAlert("Error de Sistema", "No fue posible crear la nueva sección gastronómica.");
            }
        }
    };

    const handleRemoveCategory = async (catName) => {
        const catId = menus[catName]?.id;
        if (!catId) return;

        triggerConfirm(
            "Eliminar Categoría",
            `¿Está seguro de eliminar permanentemente la sección de ${catName}? Esta acción no se puede deshacer.`,
            async () => {
                try {
                    await menuService.deleteCategoria(catId);
                    fetchData();
                } catch (error) {
                    triggerAlert("Error de Eliminación", "No se pudo remover la sección del menú maestro.");
                }
            },
            "Eliminar"
        );
    };

    const handleRenameCategory = async (oldCatName, newName) => {
        const catId = menus[oldCatName]?.id;
        if (catId && newName && oldCatName !== newName) {
            try {
                await menuService.updateCategoria(catId, { nombre: newName.toLowerCase() });
                fetchData();
                setEditingMenuCategory(newName.toLowerCase());
                triggerAlert("Sección Renombrada", "La categoría ha sido actualizada en todos los registros.");
            } catch (error) {
                triggerAlert("Error de Edición", "No se pudo actualizar el nombre de la sección gastronómica.");
            }
        }
    };

    const handleAddItem = async (catName) => {
        const catId = menus[catName]?.id;
        if (catId && newItemName) {
            const formData = new FormData();
            formData.append('categoria', catId);
            formData.append('nombre', newItemName);
            if (newItemFile) formData.append('imagen', newItemFile);

            try {
                await menuService.createPlatillo(formData);
                fetchData();
                setNewItemName('');
                setNewItemFile(null);
                triggerAlert("Platillo Añadido", "La nueva creación ha sido integrada a la carta maestra.");
            } catch (error) {
                triggerAlert("Error de Creación", "Hubo un problema al intentar añadir el platillo.");
            }
        }
    };

    const handleRemoveItem = async (catName, platilloId) => {
        triggerConfirm(
            "Remover Platillo",
            "¿Desea retirar formalmente esta propuesta gastronómica exitosamente?",
            async () => {
                try {
                    await menuService.deletePlatillo(platilloId);
                    fetchData();
                } catch (error) {
                    triggerAlert("Error de Operación", "No se pudo remover el platillo de la base de datos.");
                }
            },
            "Eliminar"
        );
    };

    const MenuCard = ({ category }) => (
        <div className="bg-white border border-luxury-black/5 hover:border-luxury-black p-12 transition-all duration-700 shadow-sm hover:shadow-2xl group overflow-hidden relative h-full flex flex-col justify-between">
            <div className="absolute -right-8 -top-8 text-luxury-black opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000">
                <Utensils size={160} />
            </div>

            <div>
                <div className="flex justify-between items-start mb-12 relative z-10">
                    <div>
                        <span className="text-[9px] uppercase tracking-[0.4em] text-luxury-gray-mid font-bold block mb-2 italic">Colección</span>
                        <h3 className="text-4xl font-serif uppercase tracking-tighter text-luxury-black group-hover:translate-x-2 transition-transform duration-500">{category}</h3>
                    </div>
                </div>

                <ul className="space-y-6 relative z-10">
                    {menus[category]?.items?.slice(0, 5).map((item, i) => (
                        <li key={item.id} className="flex gap-6 items-start group/item border-b border-luxury-black/5 pb-4 hover:border-luxury-black transition-all">
                            <span className="text-lg font-serif text-luxury-black opacity-20 group-hover/item:opacity-100 transition-opacity">0{i + 1}</span>
                            <span className="text-sm font-light text-luxury-gray-dark group-hover/item:text-luxury-black transition-colors">{item.nombre}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-12 flex gap-2 relative z-10">
                <button
                    onClick={() => setEditingMenuCategory(category)}
                    className="flex-1 py-5 bg-luxury-black text-luxury-white text-[10px] uppercase tracking-[0.5em] font-bold hover:bg-luxury-gray-dark transition-all duration-500 shadow-xl flex items-center justify-center gap-4"
                >
                    <Edit3 size={14} /> Editar Sección
                </button>
                <button
                    onClick={() => handleRemoveCategory(category)}
                    className="w-16 h-16 flex items-center justify-center border border-red-700/10 text-red-700 hover:bg-red-700 hover:text-white transition-all shadow-sm"
                    title="Eliminar Categoría"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );

    const MenusView = () => (
        <div className="space-y-20 animate-in fade-in slide-in-from-left-5 duration-700">
            <div className="flex justify-end items-end mb-16 border-b-2 border-luxury-black pb-12">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 px-8 py-3 border border-black/10 rounded-full">Editor Maestro Gastronómico</span>
            </div>

            {/* Dynamic Grid Layout for Menus */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {Object.keys(menus)
                    .filter(category => {
                        const catMatches = normalizeText(category).includes(normalizeText(searchTerm));
                        const itemsMatch = (menus[category]?.items || [])
                            .some(item => normalizeText(item.nombre).includes(normalizeText(searchTerm)));
                        return catMatches || itemsMatch;
                    })
                    .map((category) => (
                        <MenuCard key={category} category={category} />
                    ))}
            </div>

            {/* Editor Modal for Menu Categories */}
            <AnimatePresence>
                {editingMenuCategory && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[3000] bg-luxury-black/95 backdrop-blur-sm flex items-center justify-center p-10"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
                            className="bg-luxury-white max-w-4xl w-full p-20 relative max-h-[90vh] overflow-y-auto shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5"
                        >
                            <button onClick={() => setEditingMenuCategory(null)} className="absolute top-10 right-10 text-luxury-gray-mid hover:text-luxury-black transition-all"><X size={32} /></button>

                            <span className="text-[12px] uppercase tracking-[0.8em] font-bold text-luxury-gray-mid block mb-6 px-1 border-l-4 border-luxury-black">Architecture Gastronomique</span>
                            <div className="flex items-center gap-8 mb-20 group/title">
                                <h2 className="text-7xl font-serif uppercase tracking-tight text-luxury-black">Sección</h2>
                                <input 
                                    defaultValue={editingMenuCategory}
                                    onBlur={(e) => handleRenameCategory(editingMenuCategory, e.target.value)}
                                    className="text-7xl font-serif italic font-light text-luxury-gray-mid bg-transparent border-none outline-none focus:text-luxury-black transition-colors"
                                />
                                <Edit3 size={14} className="text-luxury-gray-mid opacity-0 group-hover/title:opacity-100 transition-opacity" />
                            </div>

                            <div className="space-y-16">
                                <div className="space-y-8">
                                    <label className="text-[11px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid block italic">Repertorio Actual</label>
                                    <div className="space-y-6">
                                        {menus[editingMenuCategory]?.items?.map((item, i) => (
                                            <div key={item.id} className="group relative flex items-center border-b border-luxury-black/10 pb-6 hover:border-luxury-black transition-all">
                                                <span className="text-2xl font-serif text-luxury-black opacity-10 mr-10 italic">{i < 9 ? `0${i + 1}` : i + 1}</span>
                                                {item.imagen && (
                                                    <div className="w-12 h-12 bg-luxury-white border border-luxury-black/5 overflow-hidden mr-6 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all">
                                                        <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <input
                                                    value={item.nombre}
                                                    readOnly
                                                    className="bg-transparent border-none outline-none flex-1 text-2xl font-serif font-light tracking-tight text-luxury-black"
                                                />
                                                <button
                                                    onClick={() => handleRemoveItem(editingMenuCategory, item.id)}
                                                    className="p-2 opacity-0 group-hover:opacity-100 hover:text-red-700 transition-all duration-300"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-16 border-t border-luxury-black/10">
                                    <div className="flex gap-0 group border-b-2 border-luxury-black/20 focus-within:border-luxury-black transition-all">
                                        <input
                                            placeholder="Nombre del nuevo platillo maestro..."
                                            className="flex-1 bg-transparent py-8 px-4 text-3xl font-serif text-luxury-black outline-none italic placeholder:text-luxury-gray-mid"
                                            value={newItemName}
                                            onChange={(e) => setNewItemName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddItem(editingMenuCategory)}
                                        />
                                        <div className="relative flex items-center px-6 border-l border-luxury-black/10">
                                            <input 
                                                type="file" 
                                                onChange={(e) => setNewItemFile(e.target.files[0])}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            />
                                            <ImageIcon className={`transition-colors ${newItemFile ? 'text-luxury-black' : 'text-luxury-gray-mid opacity-30'}`} size={20} />
                                        </div>
                                        <button
                                            onClick={() => handleAddItem(editingMenuCategory)}
                                            className="px-16 bg-luxury-black text-luxury-white text-[12px] uppercase tracking-[0.5em] font-bold hover:bg-luxury-gray-dark transition-all"
                                        >
                                            Añadir a la Carta
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setEditingMenuCategory(null)}
                                    className="w-full bg-luxury-black text-luxury-white py-12 text-[14px] uppercase tracking-[0.8em] font-bold shadow-3xl hover:bg-luxury-gray-dark transition-all duration-500 mt-16"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    const ReservationsView = () => (
        <div className="space-y-16 animate-in fade-in slide-in-from-right-5 duration-700">
            <div className="flex justify-end items-end mb-16 border-b-2 border-luxury-black pb-12">
                <div className="flex gap-4">
                    {['Todas', 'Confirmadas', 'Pendientes', 'Canceladas'].map(f => (
                        <button 
                            key={f} 
                            onClick={() => setReservaFilter(f)}
                            className={`text-[10px] uppercase tracking-[0.3em] font-bold px-8 py-3 border rounded-full transition-all duration-500 shadow-sm ${
                                reservaFilter === f 
                                ? 'bg-luxury-black text-luxury-white border-luxury-black' 
                                : 'border-luxury-black/5 hover:bg-luxury-black hover:text-luxury-white hover:border-luxury-black'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white border border-luxury-black/5 shadow-2xl overflow-hidden group/table">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-luxury-black/10 bg-luxury-white/50">
                            <th className="py-10 px-8 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid italic">ID</th>
                            <th className="py-10 px-8 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid">Cliente / Evento</th>
                            <th className="py-10 px-8 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid">Fecha</th>
                            <th className="py-10 px-8 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid">Paquete</th>
                            <th className="py-10 px-8 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid">Estado</th>
                            <th className="py-10 px-8 text-right text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid">Inversión</th>
                            <th className="py-10 px-8 text-right text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid">Ajustes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-luxury-black/5">
                        {reservas
                            .filter(res => {
                                const matchesStatus = reservaFilter === 'Todas' || res.estado === reservaFilter.slice(0, -1) || res.estado === reservaFilter;
                                const s = normalizeText(searchTerm);
                                const matchesSearch = 
                                    normalizeText(res.cliente).includes(s) ||
                                    normalizeText(res.fecha).includes(s) ||
                                    normalizeText(res.paquete).includes(s);
                                return matchesStatus && matchesSearch;
                            })
                            .map((res) => (
                            <tr key={res.id} className="group hover:bg-luxury-black transition-all duration-700">
                                <td className="py-12 px-8 text-2xl font-serif text-luxury-black opacity-10 group-hover:opacity-100 transition-opacity">#{res.id}</td>
                                <td className="py-12 px-8">
                                    <p className="text-[12px] uppercase tracking-[0.1em] font-bold text-luxury-black mb-1 font-serif group-hover:text-white">{res.cliente}</p>
                                    <span className="text-[9px] uppercase tracking-widest text-luxury-gray-mid font-bold group-hover:text-luxury-gray-light">{res.invitados} Invitados</span>
                                </td>
                                <td className="py-12 px-8 text-sm font-light text-luxury-gray-mid group-hover:text-luxury-gray-light/60">{res.fecha}</td>
                                <td className="py-12 px-8 text-[10px] uppercase tracking-[0.3em] font-bold text-luxury-gray-dark group-hover:text-white">{res.paquete}</td>
                                <td className="py-12 px-8">
                                    <span className={`text-[9px] uppercase tracking-[0.4em] font-black px-5 py-2 transition-all duration-500 ${
                                        res.estado === 'Confirmada' ? 'bg-luxury-black text-luxury-white group-hover:bg-white group-hover:text-luxury-black' :
                                        res.estado === 'Pendiente' ? 'bg-luxury-white border border-luxury-black/10 text-luxury-gray-mid group-hover:bg-white/10 group-hover:text-white' :
                                        'bg-red-50 text-red-900/40 border border-red-100 group-hover:bg-red-900/20 group-hover:text-red-500'
                                    }`}>
                                        {res.estado}
                                    </span>
                                </td>
                                <td className="py-12 px-8 text-right text-3xl font-serif font-light tracking-tighter text-luxury-black group-hover:text-white">{res.total}</td>
                                 <td className="py-12 px-8 text-right">
                                    <button 
                                        onClick={() => handleCancelReservation(res.id)}
                                        className="p-4 border border-luxury-black/5 text-luxury-black hover:bg-red-600 hover:text-white transition-all group-hover:bg-white/10 group-hover:text-white group-hover:hover:bg-red-600"
                                        title="Anular Reserva"
                                    >
                                        <X size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="bg-luxury-white/50 p-10 flex justify-center text-[10px] uppercase tracking-[0.6em] font-bold text-luxury-gray-light border-t border-luxury-black/5 group-hover/table:text-luxury-black transition-colors">
                    Fin del registro editorial de reservas
                </div>
            </div>
        </div>
    );

    const GalleryView = () => (
        <div className="animate-in fade-in slide-in-from-right-5 duration-700">
            <div className="flex justify-end items-center mb-10 border-b border-luxury-black pb-8">
                <div className="flex gap-4">
                    {['Todas', 'Montaje', 'Gastronomía', 'Retrato', 'Arquitectura'].map(f => (
                        <button 
                            key={f} 
                            onClick={() => setGalleryFilter(f)}
                            className={`text-[10px] uppercase tracking-[0.3em] font-bold px-8 py-3 border rounded-full transition-all duration-300 shadow-sm ${
                                galleryFilter === f 
                                ? 'bg-luxury-black text-luxury-white border-luxury-black shadow-lg shadow-black/10' 
                                : 'text-luxury-black/40 border-black/5 hover:border-luxury-black/20 hover:text-luxury-black'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-8">
                {galeria
                    .filter(img => galleryFilter === 'Todas' || img.category === galleryFilter)
                    .map((img, i) => (
                    <div key={img.id} className="group relative aspect-[3/4] bg-luxury-black overflow-hidden border border-luxury-black/5 shadow-lg">
                        <img src={img.url} alt={img.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-all duration-1000 grayscale group-hover:grayscale-0" />
                        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 p-10 flex flex-col justify-between">
                            <div className="flex justify-end gap-5 translate-y-[-20px] group-hover:translate-y-0 transition-transform duration-500">
                                <button onClick={() => handleDeleteGallery(img.id)} className="p-4 bg-white text-luxury-black hover:bg-red-600 hover:text-white transition-colors shadow-2xl"><Trash2 size={16} /></button>
                            </div>
                            <div>
                                <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 block mb-2">{img.category}</span>
                                <h3 className="text-xl font-serif text-white uppercase tracking-tight">{img.title}</h3>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty state for more */}
                <div 
                    onClick={() => setIsAddingGallery(true)}
                    className="aspect-[3/4] border-2 border-luxury-black/10 border-dashed flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-luxury-black transition-all duration-700 bg-white/50"
                >
                    <div className="w-20 h-20 bg-luxury-black rounded-full flex items-center justify-center text-luxury-white mb-8 group-hover:bg-luxury-gray-dark transition-all">
                        <ImageIcon size={32} className="opacity-40 group-hover:opacity-100" />
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.5em] text-luxury-gray-light font-bold italic group-hover:text-luxury-black transition-colors">Cargar más archivos editorial...</span>
                </div>
            </div>

            {/* Modal para añadir a Galería */}
            <AnimatePresence>
                {isAddingGallery && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[5000] bg-luxury-black/90 backdrop-blur-xl flex items-center justify-center p-10"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 30 }} 
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white max-w-2xl w-full p-20 relative shadow-2xl"
                        >
                            <button onClick={() => setIsAddingGallery(false)} className="absolute top-10 right-10 opacity-40 hover:opacity-100 transition-opacity"><X size={30} /></button>
                            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-black/40 block mb-6 px-1 border-l-2 border-luxury-black">Directorio de Arte</span>
                            <h2 className="text-5xl font-serif uppercase tracking-tight mb-16">Componer <span className="italic font-light">Nueva Escena</span></h2>

                            <form onSubmit={handleCreateGallery} className="space-y-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Título de la Obra</label>
                                    <input name="titulo" required className="w-full border-b border-black/10 py-4 px-2 focus:border-black outline-none font-serif text-2xl transition-all" placeholder="Ej. Banquete en la Toscana" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Categoría Artística</label>
                                    <select name="categoria" required className="w-full border-b border-black/10 py-4 px-2 focus:border-black outline-none text-xl font-light transition-all bg-transparent">
                                        <option value="Montaje">Montaje</option>
                                        <option value="Gastronomía">Gastronomía</option>
                                        <option value="Retrato">Retrato</option>
                                        <option value="Arquitectura">Arquitectura</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Imagen de Alta Resolución</label>
                                    <div className="flex items-center gap-8 p-8 border border-dashed border-luxury-black/10 rounded-xl hover:border-luxury-black transition-all">
                                        <div className="w-20 h-20 bg-luxury-white flex items-center justify-center rounded-full border border-luxury-black/5">
                                            <ImageIcon className="text-luxury-black/20" size={32} />
                                        </div>
                                        <div className="flex-1">
                                            <input 
                                                type="file" 
                                                name="imagen"
                                                required
                                                className="text-[10px] uppercase tracking-widest font-bold file:mr-6 file:py-3 file:px-8 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-luxury-black file:text-white hover:file:bg-luxury-gray-dark cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-luxury-black text-white py-6 text-[11px] uppercase tracking-[0.5em] font-bold hover:bg-luxury-gray-dark border border-luxury-black shadow-2xl transition-all mt-10">Subir Imagen</button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <div className="bg-luxury-white min-h-screen flex text-luxury-black font-sans selection:bg-luxury-black selection:text-white">
            <Sidebar />

            <main className="flex-1 ml-80 p-20">
                {/* Persistent Dynamic Topbar */}
                <header className="mb-20 space-y-12">
                    <div className="flex justify-between items-start">
                        <motion.div 
                            key={activeTab}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-luxury-gray-mid block mb-6 px-1 border-l-2 border-luxury-black">
                                {tabTitles[activeTab]?.sub || 'LUXURY OPS'}
                            </span>
                            <h1 className="text-6xl font-serif uppercase tracking-tight text-luxury-black">
                                {tabTitles[activeTab]?.main || 'Administración'}{' '}
                                <span className="italic font-light text-luxury-gray-mid">
                                    {tabTitles[activeTab]?.italic || 'Central'}
                                </span>
                            </h1>
                        </motion.div>
                    </div>

                    <div className="flex justify-between items-center border-t border-luxury-black/5 pt-10">
                        <div className="flex-1">
                            {['packages', 'adicionales', 'menus', 'reservations'].includes(activeTab) && (
                                <div className="flex items-center gap-0 bg-white border border-luxury-black/10 shadow-sm focus-within:border-luxury-black transition-all duration-500 w-[500px] rounded-full overflow-hidden">
                                    <div className="px-4 text-luxury-black/30">
                                        <Search size={16} />
                                    </div>
                                    <input 
                                        type="text" 
                                        placeholder={
                                            activeTab === 'packages' ? "Buscar paquete..." :
                                            activeTab === 'adicionales' ? "Buscar servicio complementario..." :
                                            activeTab === 'menus' ? "Buscar platillo o sección..." :
                                            "Buscar por cliente, fecha o paquete..."
                                        }
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="flex-1 py-3 bg-transparent outline-none text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-black placeholder:text-luxury-black/20"
                                    />
                                    {searchTerm && (
                                        <button 
                                            onClick={() => setSearchTerm('')}
                                            className="px-4 text-luxury-black/30 hover:text-luxury-black transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-6">
                            {activeTab === 'dashboard' && (
                                <button className="w-16 h-16 border border-luxury-black/10 flex items-center justify-center hover:bg-luxury-black hover:text-luxury-white transition-all duration-500 shadow-sm rounded-full overflow-hidden">
                                    <Filter size={20} />
                                </button>
                            )}
                            
                            {activeTab === 'packages' && (
                                <button 
                                    onClick={() => {
                                        resetPackageForm();
                                        setIsAddingPackage(true);
                                    }}
                                    className="bg-luxury-black text-luxury-white px-10 h-14 flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-luxury-gray-dark border border-luxury-black transition-all shadow-lg"
                                >
                                    <Plus size={16} className="text-white" /> Añadir Paquete
                                </button>
                            )}

                            {activeTab === 'adicionales' && (
                                <button 
                                    onClick={() => {
                                        resetAdicionalForm();
                                        setIsAddingAdicional(true);
                                    }}
                                    className="bg-luxury-black text-luxury-white px-10 h-14 flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-luxury-gray-dark border border-luxury-black transition-all shadow-lg"
                                >
                                    <Plus size={16} className="text-white" /> Añadir Servicio
                                </button>
                            )}

                            {activeTab === 'menus' && (
                                <button 
                                    onClick={handleAddCategory}
                                    className="bg-luxury-black text-luxury-white px-10 h-14 flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-luxury-gray-dark border border-luxury-black transition-all shadow-lg"
                                >
                                    <Plus size={16} className="text-white" /> Añadir Categoría
                                </button>
                            )}


                        </div>
                    </div>
                </header>

                <div className="max-w-[1400px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'dashboard' && DashboardView()}
                        {activeTab === 'reservations' && ReservationsView()}
                        {activeTab === 'gallery' && GalleryView()}
                        {activeTab === 'packages' && PackagesView()}
                        {activeTab === 'adicionales' && AdicionalesView()}
                        {activeTab === 'menus' && MenusView()}
                        {activeTab !== 'dashboard' && activeTab !== 'reservations' && activeTab !== 'gallery' && activeTab !== 'packages' && activeTab !== 'adicionales' && activeTab !== 'menus' && (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-40 border border-luxury-black/5 border-dashed bg-white shadow-inner"
                            >
                                <span className="text-[11px] uppercase tracking-[0.5em] font-bold text-luxury-gray-light italic">Módulo {activeTab} en desarrollo editorial...</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Custom Confirmation/Alert Modal */}
            <AnimatePresence>
                {confirmState.isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[10000] bg-luxury-black/95 backdrop-blur-xl flex items-center justify-center p-10"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}
                            className="bg-white max-w-md w-full p-16 shadow-[0_0_100px_rgba(0,0,0,0.4)] relative border border-luxury-black/5"
                        >
                            <span className="text-[10px] uppercase tracking-[0.6em] font-bold text-black/30 block mb-6 px-1 border-l-2 border-luxury-black font-sans">Aviso Editorial</span>
                            <h2 className="text-4xl font-serif uppercase tracking-tight mb-8 text-luxury-black leading-tight">{confirmState.title}</h2>
                            <p className="text-[13px] font-light text-luxury-gray-mid leading-relaxed mb-12 italic font-serif opacity-80">"{confirmState.message}"</p>
                            
                            <div className="flex gap-4">
                                {confirmState.type === 'confirm' && (
                                    <button 
                                        onClick={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                                        className="flex-1 py-5 border border-luxury-black text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-black hover:bg-luxury-white/50 transition-all"
                                    >
                                        Cancelar
                                    </button>
                                )}
                                <button 
                                    onClick={() => {
                                        if (confirmState.onConfirm) confirmState.onConfirm();
                                        setConfirmState(prev => ({ ...prev, isOpen: false }));
                                    }}
                                    className={`flex-1 py-5 text-luxury-white text-[10px] uppercase tracking-[0.4em] font-bold shadow-2xl transition-all border ${
                                        confirmState.confirmText === 'Eliminar' || confirmState.confirmText === 'Anular'
                                        ? 'bg-red-700 border-red-700 hover:bg-red-800' 
                                        : 'bg-luxury-black border-luxury-black hover:bg-luxury-gray-dark'
                                    }`}
                                >
                                    {confirmState.confirmText}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
