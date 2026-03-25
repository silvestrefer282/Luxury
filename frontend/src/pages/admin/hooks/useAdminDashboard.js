import { useState, useEffect } from 'react';
import { 
    paqueteService, 
    reservacionService,
    menuService, 
    servicioService,
    galeriaService,
    contratoService,
    clienteService,
    pagoContratoService,
    testimonioService,
    usuarioService,
    configuracionService
} from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

export const useAdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [userRole, setUserRole] = useState(user?.rol === 'Encargado' ? 'encargado' : 'admin');
    const [clients, setClients] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [testimonios, setTestimonios] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [packages, setPackages] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [adicionales, setAdicionales] = useState([]);
    const [menus, setMenus] = useState({});
    const [galeria, setGaleria] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Filters
    const [reservaFilter, setReservaFilter] = useState('Todas');
    const [galleryFilter, setGalleryFilter] = useState('Todas');
    const [adicionalFilter, setAdicionalFilter] = useState('Todos');
    const [userRoleFilter, setUserRoleFilter] = useState('Todos');
    const [contractFilter, setContractFilter] = useState('Todos');

    // Modals visibility
    const [isAddingPackage, setIsAddingPackage] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [isAddingAdicional, setIsAddingAdicional] = useState(false);
    const [editingAdicional, setEditingAdicional] = useState(null);
    const [isAddingGallery, setIsAddingGallery] = useState(false);
    const [isAddingUser, setIsAddingUser] = useState(false);
    const [isAddingReservation, setIsAddingReservation] = useState(false);
    const [selectedReservationForContract, setSelectedReservationForContract] = useState(null);
    const [selectedContractForPayments, setSelectedContractForPayments] = useState(null);
    const [editingMenuCategory, setEditingMenuCategory] = useState(null);
    const [editingGallery, setEditingGallery] = useState(null);
    const [isEditingConfig, setIsEditingConfig] = useState(false);

    // Form states
    const [packageForm, setPackageForm] = useState({
        name: '', price: '', capacity: '', duration: 5, extraHourPrice: 0, 
        includedServices: '', notes: '', description: '', 
        numero_tiempos: 3, incluye_menu: true
    });
    const [adicionalForm, setAdicionalForm] = useState({
        name: '', price: '', category: 'Entretenimiento', description: ''
    });
    const [reservationForm, setReservationForm] = useState({
        cliente: '', 
        paquete: '', 
        tipo_evento: '',
        fecha_evento: '', 
        hora_inicio: '14:00', 
        hora_fin: '19:00', 
        num_personas: 100, 
        horas_adicionales: 0,
        menu: '', 
        servicios_adicionales: [],
        platillos_seleccionados: [],
        nombre_festejado: '',
        domicilio_contacto: '',
        telefono_contacto: '',
        notas: ''
    });
    const [contractForm, setContractForm] = useState({
        folio: '', representante_salon: 'Graciela Herrera Ramírez',
        lugar_evento: '2 de Abril 2503 Col. El Carmen, Apizaco, Tlax.',
        domicilio_consumidor: '', telefono_consumidor: '', tipo_evento: 'Evento Social',
        hora_inicio: '', hora_fin: '',
        cantidad_personas: 0, duracion_horas: 5, total_operacion: 0,
        deposito_garantia: 1000, anticipo_monto: 0, fecha_limite_pago: '', notas_especiales: ''
    });
    const [userForm, setUserForm] = useState({
        username: '', email: '', password: '', 
        first_name: '', apellido_paterno: '', rol: 'Cliente', estatus: true
    });
    const [configForm, setConfigForm] = useState(null);

    // Confirmation state
    const [confirmState, setConfirmState] = useState({
        isOpen: false, title: '', message: '', onConfirm: null, 
        type: 'confirm', confirmText: 'Confirmar'
    });

    // Helper states
    const [coverPreview, setCoverPreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);
    const [coverFile, setCoverFile] = useState(null);
    const [deletedGalleryIds, setDeletedGalleryIds] = useState([]);

    const formatImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        // Obtenemos la base de la API y quitamos el /api al final para apuntar a la raíz del servidor (media)
        const apiBase = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/api\/?$/, '');
        return `${apiBase}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const normalizeText = (text) => {
        return text ? text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
    };

    const triggerConfirm = (title, message, onConfirm, confirmText = 'Confirmar') => {
        setConfirmState({ isOpen: true, title, message, onConfirm, type: 'confirm', confirmText });
    };

    const triggerPrompt = (title, message, onConfirm, confirmText = 'Aceptar') => {
        setConfirmState({ isOpen: true, title, message, onConfirm, type: 'prompt', confirmText });
    };

    const triggerAlert = (title, message) => {
        setConfirmState({ isOpen: true, title, message, onConfirm: null, type: 'alert', confirmText: 'Entendido' });
    };

    const fetchPackages = async () => {
        try {
            const resp = await paqueteService.getAll();
            setPackages(resp.data.map(p => ({
                id: p.id,
                name: p.nombre,
                price: p.precio_base,
                capacity: p.capacidad_personas,
                duration: p.duracion_horas,
                extraHourPrice: p.precio_hora_adicional,
                includedServices: p.servicios_incluidos,
                notes: p.notas,
                description: p.descripcion,
                image: formatImageUrl(p.imagen) || '/images/Foto 1.jpg',
                gallery: (p.galeria || []).map(img => ({ id: img.id, url: formatImageUrl(img.imagen) })),
                layout: 'Editorial',
                numero_tiempos: p.numero_tiempos,
                incluye_menu: p.incluye_menu
            })));
        } catch (e) { console.error("Error fetching packages:", e); }
    };

    const fetchReservations = async () => {
        try {
            const resp = await reservacionService.getAll();
            setReservas(resp.data.map(r => ({
                id: r.id,
                cliente: r.cliente_nombre || 'Cliente Anonimo',
                cliente_id: r.cliente, // Added to link with User/Client ID
                telefono: r.telefono_contacto || r.cliente_telefono || 'S/N',
                domicilio: r.domicilio_contacto || '',
                festejado: r.nombre_festejado || '',
                email: 'info@sirlux.mx',
                invitados: r.num_personas,
                fecha: r.fecha_evento,
                hora_inicio: r.hora_inicio,
                hora_fin: r.hora_fin,
                paquete: r.paquete_nombre,
                paquete_id: r.paquete,
                estado: r.estado,
                servicios_adicionales: r.servicios_detalle || [],
                platillos: r.platillos_detalle || [],
                total: `$${Number(r.total_estimado).toLocaleString()}`,
                total_raw: Number(r.total_estimado)
            })));
        } catch (e) { console.error("Error fetching reservations:", e); }
    };

    const fetchAdicionales = async () => {
        try {
            const resp = await servicioService.getAll();
            setAdicionales(resp.data.map(a => ({
                id: a.id,
                name: a.nombre,
                price: a.precio_unitario,
                category: a.categoria,
                description: a.descripcion,
                tipo_cobro: a.tipo_cobro,
                url: formatImageUrl(a.imagen)
            })));
        } catch (e) { console.error("Error fetching adicionales:", e); }
    };

    const fetchGallery = async () => {
        try {
            const resp = await galeriaService.getAll();
            setGaleria(resp.data.map(g => ({
                id: g.id,
                title: g.titulo,
                url: formatImageUrl(g.imagen),
                category: g.categoria,
                description: g.descripcion
            })));
        } catch (e) { console.error("Error fetching gallery:", e); }
    };

    const fetchContracts = async () => {
        try {
            const resp = await contratoService.getAll();
            setContracts(resp.data.map(c => ({
                id: c.id,
                folio: c.folio,
                cliente: c.cliente_nombre || 'N/A',
                fecha: c.fecha_evento,
                total: c.total_operacion,
                anticipo: c.anticipo_monto,
                deposito_garantia: c.deposito_garantia,
                notas_especiales: c.notas_especiales,
                firmado: c.esta_firmado,
                reserva_id: c.reservacion,
                pagos: c.pagos || [],
                saldo_pendiente: c.saldo_pendiente,
                total_pagado: c.total_pagado,
                domicilio_consumidor: c.domicilio_consumidor,
                telefono_consumidor: c.telefono_consumidor,
                tipo_evento: c.tipo_evento,
                cantidad_personas: c.cantidad_personas,
                hora_inicio: c.hora_inicio,
                hora_fin: c.hora_fin,
                duracion_horas: c.duracion_horas,
                fecha_limite_pago: c.fecha_limite_pago
            })));
        } catch (e) { console.error("Error fetching contracts:", e); }
    };

    const fetchMenus = async () => {
        try {
            const [respCats, respPlat] = await Promise.all([
                menuService.getCategorias(),
                menuService.getPlatillos()
            ]);
            const menuObj = {};
            respCats.data.forEach(cat => {
                menuObj[cat.nombre] = {
                    id: cat.id,
                    imagen: formatImageUrl(cat.imagen),
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
        } catch (e) { console.error("Error fetching menus:", e); }
    };

    const fetchTestimonios = async () => {
        try {
            const resp = await testimonioService.getAll();
            setTestimonios(resp.data);
        } catch (e) { console.error("Error fetching testimonies:", e); }
    };

    const fetchUsers = async () => {
        try {
            const resp = await usuarioService.getAll();
            setUsersList(resp.data);
        } catch (e) { console.error("Error fetching users:", e); }
    };

    const fetchClients = async () => {
        try {
            const resp = await clienteService.getAll();
            setClients(resp.data.map(c => ({
                id: c.id,
                name: c.usuario_detalle?.get_full_name || 'N/A'
            })));
        } catch (e) { console.error("Error fetching clients:", e); }
    };

    const fetchConfig = async () => {
        try {
            const resp = await configuracionService.getCurrent();
            setConfigForm(resp.data);
        } catch (e) { console.error("Error fetching config:", e); }
    };

    const fetchData = async () => {
        // Initial load: fetch everything
        await Promise.all([
            fetchPackages(),
            fetchReservations(),
            fetchAdicionales(),
            fetchGallery(),
            fetchContracts(),
            fetchClients(),
            fetchTestimonios(),
            fetchUsers(),
            fetchConfig(),
            fetchMenus()
        ]);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (user) {
            const role = user.rol === 'Encargado' ? 'encargado' : 'admin';
            setUserRole(role);
            if (role === 'encargado' && activeTab === 'dashboard') {
                setActiveTab('reservations');
            }
        }
    }, [user]);

    useEffect(() => {
        setSearchTerm('');
    }, [activeTab]);

    useEffect(() => {
        if (selectedReservationForContract) {
            setContractForm(prev => ({
                ...prev,
                folio: `C-${selectedReservationForContract.id}${String(new Date().getMonth() + 1).padStart(2, '0')}${new Date().getFullYear().toString().slice(-2)}`,
                cantidad_personas: selectedReservationForContract.invitados,
                total_operacion: selectedReservationForContract.total_raw || 0,
                anticipo_monto: 0,
                telefono_consumidor: selectedReservationForContract.telefono || '',
                domicilio_consumidor: selectedReservationForContract.domicilio || '',
                tipo_evento: 'Evento Social',
                hora_inicio: selectedReservationForContract.hora_inicio || '',
                hora_fin: selectedReservationForContract.hora_fin || ''
            }));
        }
    }, [selectedReservationForContract]);

    // Handlers
    const handleCreateGallery = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = new FormData();
        data.append('titulo', formData.get('titulo'));
        data.append('categoria', formData.get('categoria'));
        data.append('descripcion', formData.get('descripcion') || 'Imagen exclusiva de Luxury');
        
        const img = formData.get('imagen');
        if (img && img.size > 0) data.append('imagen', img);

        try {
            await galeriaService.create(data);
            await fetchGallery();
            setIsAddingGallery(false);
            triggerAlert("Imagen Agregada", "La nueva imagen ha sido integrada en la galería exitosamente");
        } catch (error) {
            triggerAlert("Reserva del Sistema", "No se pudo procesar la carga de la imagen en este momento.");
        }
    };

    const handleDeleteGallery = async (id) => {
        triggerConfirm(
            "Eliminar Imagen", 
            "¿Desea retirar permanentemente esta imagen de la galería de los eventos que ha tenido Luxury?",
            async () => {
                try {
                    await galeriaService.delete(id);
                    await fetchGallery();
                    triggerAlert("Imagen Eliminada", "La imagen ha sido retirada de la galería exitosamente");
                } catch (error) {
                    triggerAlert("Error de Archivo", "No se pudo eliminar la imagen seleccionada.");
                }
            },
            "Eliminar"
        );
    };

    const handleUpdateGallery = async (id, galleryData) => {
        const data = new FormData();
        data.append('titulo', galleryData.titulo);
        data.append('categoria', galleryData.categoria);
        data.append('descripcion', galleryData.descripcion);
        if (galleryData.imagen) {
            data.append('imagen', galleryData.imagen);
        }

        try {
            await galeriaService.update(id, data);
            await fetchGallery();
            setEditingGallery(null);
            triggerAlert("Imagen Actualizada", "Los datos de la imagen se actualizaron exitosamente");
        } catch (error) {
            triggerAlert("Error al actualizar", "No se pudo actualizar la imagen seleccionada.");
        }
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
        data.append('descripcion', formData.get('description'));
        data.append('numero_tiempos', packageForm.numero_tiempos || 0);
        data.append('incluye_menu', packageForm.incluye_menu ? 'true' : 'false');
        
        if (coverFile) {
            data.append('imagen', coverFile);
        }

        galleryPreviews.forEach(p => {
            if (p.file) data.append('galeria_imgs', p.file);
        });
        
        try {
            await paqueteService.create(data);
            setIsAddingPackage(false);
            resetPackageForm();
            await fetchPackages();
            triggerAlert("Paquete Creado", "La nueva propuesta editorial ha sido registrada exitosamente.");
        } catch (error) {
            triggerAlert("Error de Diseño", "Hubo un problema al materializar el paquete. Verifique los datos.");
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
        data.append('descripcion', formData.get('description'));
        data.append('numero_tiempos', packageForm.numero_tiempos || 0);
        data.append('incluye_menu', packageForm.incluye_menu ? 'true' : 'false');
        
        if (coverFile) data.append('imagen', coverFile);
        
        const galleryOrder = [];
        galleryPreviews.forEach(p => {
            if (p.id) {
                galleryOrder.push(p.id.toString());
            } else if (p.file) {
                data.append('galeria_imgs', p.file);
                galleryOrder.push('new');
            }
        });
        data.append('gallery_order', JSON.stringify(galleryOrder));
        
        if (deletedGalleryIds.length > 0) {
            deletedGalleryIds.forEach(id => data.append('deleted_gallery_ids', id));
        }

        try {
            await paqueteService.update(editingPackage.id, data);
            await fetchPackages();
            setEditingPackage(null);
            resetPackageForm();
            triggerAlert("Edición Finalizada", "Se han guardado los cambios del paquete.");
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
                    await fetchPackages();
                    triggerAlert("Paquete Eliminado", "El paquete ha sido eliminado de la colección exitosamente.");
                } catch (error) {
                    const serverMsg = error.response?.data?.error || error.response?.data?.detail;
                    const displayMsg = serverMsg || "No fue posible eliminar el registro. Verifique si el paquete tiene reservaciones o contratos asociados.";
                    triggerAlert("Error de Sistema", displayMsg);
                }
            },
            "Eliminar"
        );
    };

    const handleDeleteContract = async (id) => {
        triggerConfirm(
            "Anular Contrato",
            "¿Desea eliminar este acuerdo legal y sus registros asociados? Esta acción no se puede deshacer.",
            async () => {
                try {
                    await contratoService.delete(id);
                    await Promise.all([fetchContracts(), fetchReservations()]);
                    triggerAlert("Contrato Eliminado", "El acuerdo legal ha sido removido del sistema exitosamente.");
                } catch (error) {
                    triggerAlert("Error de Registro", "Hubo un problema al intentar retirar el contrato.");
                }
            },
            "Anular Contrato"
        );
    };

    const handleApproveTestimonio = async (id) => {
        triggerConfirm(
            "Difundir Reseña",
            "¿Desea publicar este testimonio en la sección editorial de la página principal?",
            async () => {
                try {
                    // Optimistic UI update
                    setTestimonios(prev => prev.map(t => 
                        t.id === id ? { ...t, aprobado: true } : t
                    ));
                    await testimonioService.update(id, { aprobado: true });
                    await fetchTestimonios();
                    triggerAlert("Reseña Publicada", "El testimonio ahora se encuentra disponible para visualización pública.");
                } catch (error) {
                    setTestimonios(prev => prev.map(t => 
                        t.id === id ? { ...t, aprobado: false } : t
                    ));
                    triggerAlert("Error de Registro", "No se pudo actualizar el estado de la reseña.");
                }
            },
            "Publicar"
        );
    };

    const handleDeleteTestimonio = async (id) => {
        triggerConfirm(
            "Retirar Testimonio",
            "¿Desea eliminar permanentemente esta reseña del sistema?",
            async () => {
                try {
                    await testimonioService.delete(id);
                    
                    // Optimistic UI update to remove the item instantly from the list
                    setTestimonios(prev => prev.filter(t => t.id !== id));
                    
                    await fetchTestimonios();
                    triggerAlert("Eliminado", "La reseña ha sido retirada con éxito.");
                } catch (error) {
                    triggerAlert("Error", "No se pudo eliminar el testimonio.");
                }
            },
            "Eliminar"
        );
    };

    const handleConfirmReservation = async (id) => {
        try {
            await reservacionService.update(id, { estado: 'Confirmada' });
            await fetchReservations();
            triggerAlert("Reserva Confirmada", "El evento ha sido validado y ahora ocupa el espacio oficial en el calendario.");
        } catch (error) {
            triggerAlert("Error", "No se pudo confirmar la reserva.");
        }
    };

    const handleCancelReservation = async (id) => {
        triggerConfirm(
            "Anular Reserva",
            "¿Desea proceder con la anulación formal de esta reserva editorial?",
            async () => {
                try {
                    await reservacionService.cancelar(id);
                    await fetchReservations();
                    triggerAlert("Reserva Anulada", "El evento ha sido cancelado formalmente y el espacio liberado.");
                } catch (error) {
                    triggerAlert("Error de Reserva", "No se pudo procesar la cancelación del evento.");
                }
            },
            "Anular"
        );
    };

    const handleCreateContract = async (e) => {
        e.preventDefault();
        try {
            // Limpieza de datos antes de enviar
            const payload = {
                ...contractForm,
                reservacion: selectedReservationForContract.id,
                fecha_limite_pago: contractForm.fecha_limite_pago || null,
                anticipo_monto: Number(contractForm.anticipo_monto) || 0,
                deposito_garantia: Number(contractForm.deposito_garantia) || 0,
                total_operacion: Number(contractForm.total_operacion) || 0
            };

            await contratoService.create(payload);
            await Promise.all([fetchContracts(), fetchReservations()]);
            setSelectedReservationForContract(null);
            triggerAlert("Contrato Generado", "El acuerdo legal ha sido digitalizado y vinculado a la reserva exitosamente.");
        } catch (error) {
            console.error("Error formalizando contrato:", error.response?.data || error);
            const detail = error.response?.data?.detail || 
                           Object.values(error.response?.data || {}).flat().join(", ") || 
                           "Verifique los datos (el Folio no debe estar repetido).";
            triggerAlert("Error de Registro", `No se pudo formalizar el contrato: ${detail}`);
        }
    };

    const handleCreatePayment = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            contrato: selectedContractForPayments.id,
            monto: formData.get('monto'),
            metodo_pago: formData.get('metodo_pago'),
            notas: formData.get('notas')
        };

        try {
            await pagoContratoService.create(data);
            triggerAlert("Abono Registrado", "El pago ha sido procesado e integrado al historial editorial del contrato.");
            await fetchContracts();
            setSelectedContractForPayments(null);
        } catch (error) {
            triggerAlert("Error de Caja", "No se pudo registrar el abono en este momento.");
        }
    };

    const handleCreateReservation = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...reservationForm,
                num_personas: Number(reservationForm.num_personas),
                horas_adicionales: Number(reservationForm.horas_adicionales),
                observaciones: `ADMIN MANUAL - Evento: ${reservationForm.tipo_evento}. Festejado: ${reservationForm.nombre_festejado}. Notas: ${reservationForm.notas || 'Sin notas'}`
            };
            await reservacionService.create(payload);
            await fetchReservations();
            setIsAddingReservation(false);
            setReservationForm({
                cliente: '', paquete: '', tipo_evento: '', fecha_evento: '', 
                hora_inicio: '14:00', hora_fin: '19:00', num_personas: 100, 
                horas_adicionales: 0, menu: '', servicios_adicionales: [],
                platillos_seleccionados: [], nombre_festejado: '',
                domicilio_contacto: '', telefono_contacto: '', notas: ''
            });
            triggerAlert("Inscripción Realizada", "La nueva reserva ha sido integrada al calendario de lujo.");
        } catch (error) {
            triggerAlert("Error de Sistema", "No fue posible registrar la nueva reserva. Verifique disponibilidad.");
        }
    };

    const handleCreateAdicional = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = new FormData();
        data.append('nombre', formData.get('name'));
        data.append('precio_unitario', formData.get('price'));
        data.append('categoria', formData.get('category'));
        data.append('descripcion', formData.get('description'));
        data.append('tipo_cobro', formData.get('tipo_cobro') || 'Por Evento');
        
        const img = formData.get('imagen');
        if (img && img.size > 0) data.append('imagen', img);

        try {
            await servicioService.create(data);
            await fetchAdicionales();
            setIsAddingAdicional(false);
            resetAdicionalForm();
            triggerAlert("Servicio Registrado", "El nuevo servicio complementario ha sido añadido exitosamente.");
        } catch (error) {
            console.error("Error creating service:", error.response?.data || error);
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
        data.append('descripcion', formData.get('description'));
        data.append('tipo_cobro', formData.get('tipo_cobro') || 'Por Evento');
        
        const img = formData.get('imagen');
        if (img && img.size > 0) data.append('imagen', img);

        try {
            await servicioService.update(editingAdicional.id, data);
            await fetchAdicionales();
            setEditingAdicional(null);
            resetAdicionalForm();
            triggerAlert("Cambios Guardados", "La propuesta del servicio ha sido refinada exitosamente.");
        } catch (error) {
            console.error("Error updating service:", error.response?.data || error);
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
                    await fetchAdicionales();
                } catch (error) {
                    triggerAlert("Error de Operación", "No fue posible retirar el servicio del sistema.");
                }
            }
        );
    };

    const handleUpdateUserRole = async (userId, newRol) => {
        triggerConfirm(
            "Privilegios Luxury",
            `¿Desea cambiar el rango del usuario a '${newRol}'? Esto alterará sus capacidades en el sistema editorial.`,
            async () => {
                try {
                    await usuarioService.update(userId, { rol: newRol });
                    await fetchUsers();
                    triggerAlert("Privilegios Actualizados", `El perfil ahora cuenta con facultades de ${newRol}.`);
                } catch (error) {
                    triggerAlert("Error de Seguridad", "No se pudo actualizar el rango del usuario.");
                }
            },
            "Aceptar"
        );
    };

    const handleToggleUserStatus = async (userId, newStatus) => {
        triggerConfirm(
            newStatus ? "Restablecer Acceso" : "Suspender Acceso",
            `¿Desea ${newStatus ? 'rehabilitar' : 'bloquear'} la entrada de este usuario al ecosistema Luxury?`,
            async () => {
                try {
                    await usuarioService.update(userId, { estatus: newStatus });
                    await fetchUsers();
                    triggerAlert("Estado Modificado", `El acceso al sistema ha sido ${newStatus ? 'habilitado' : 'restringido'} exitosamente.`);
                } catch (error) {
                    triggerAlert("Error de Operación", "No fue posible modificar el estado del usuario.");
                }
            },
            newStatus ? "Habilitar" : "Bloquear"
        );
    };

    const handleDeleteUser = async (userId) => {
        // Encontrar reservaciones asociadas a este usuario (cliente)
        const userReservas = reservas.filter(res => res.cliente_id === userId);
        const hasReservas = userReservas.length > 0;

        const confirmTitle = hasReservas ? "Eliminación con Reservas" : "Eliminar Registro";
        const confirmMessage = hasReservas 
            ? `Este usuario tiene ${userReservas.length} reservación(es) activa(s). Al aceptar, se eliminarán permanentemente tanto el usuario como todas sus reservaciones asociadas automáticamente. ¿Desea continuar?`
            : "¿Desea eliminar permanentemente este usuario del ecosistema Luxury? Esta acción retirará todos sus permisos.";
        
        const confirmBtn = hasReservas ? "Eliminar Todo" : "Eliminar Cuenta";

        triggerConfirm(
            confirmTitle,
            confirmMessage,
            async () => {
                try {
                    // Si tiene reservaciones, las eliminamos primero
                    if (hasReservas) {
                        await Promise.all(userReservas.map(res => reservacionService.delete(res.id)));
                    }
                    
                    await usuarioService.delete(userId);
                    await fetchUsers();
                    if (hasReservas) await fetchReservations(); // Actualizar lista de reservas también
                    
                    triggerAlert("Proceso Finalizado", "El usuario y sus registros asociados han sido removidos exitosamente.");
                } catch (error) {
                    console.error("Error deleting user/reservations:", error);
                    triggerAlert("Error de Sistema", "No se pudo procesar la baja completa del usuario.");
                }
            },
            confirmBtn
        );
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await usuarioService.create(userForm);
            await fetchUsers();
            setIsAddingUser(false);
            resetUserForm();
            triggerAlert("Usuario Creado", "La nueva cuenta ha sido registrada en el sistema.");
        } catch (error) {
            triggerAlert("Error al Crear", "No se pudo registrar al usuario. Verifique los datos o si el correo ya existe.");
        }
    };

    const handleUpdateConfig = async (e) => {
        e.preventDefault();
        try {
            await configuracionService.updateCurrent(configForm);
            setIsEditingConfig(false);
            triggerAlert("Configuración Guardada", "Las reglas globales del sistema han sido actualizadas.");
        } catch (error) {
            triggerAlert("Error de Configuración", "No fue posible guardar las nuevas parametrizaciones.");
        }
    };

    const handleConfigChange = (e) => {
        setConfigForm({
            ...configForm,
            [e.target.name]: e.target.value
        });
    };

    const resetPackageForm = () => {
        setPackageForm({
            name: '', price: '', capacity: '', duration: 5, 
            extraHourPrice: 0, includedServices: '', notes: '', description: '',
            numero_tiempos: 3, incluye_menu: true
        });
        setCoverPreview(null); setCoverFile(null);
        setGalleryPreviews([]); setDeletedGalleryIds([]);
    };

    const resetAdicionalForm = () => {
        setAdicionalForm({ 
            name: '', 
            price: '', 
            category: 'Entretenimiento', 
            description: '',
            tipo_cobro: 'Por Evento'
        });
    };

    const resetUserForm = () => {
        setUserForm({
            username: '', email: '', password: '', 
            first_name: '', apellido_paterno: '', rol: 'Cliente', estatus: true
        });
    };

    const handleRenameCategory = async (oldName, newName) => {
        if (oldName === newName) return;
        const catId = menus[oldName]?.id;
        if (catId) {
            try {
                await menuService.updateCategoria(catId, { nombre: newName });
                await fetchMenus();
                triggerAlert("Sección Renombrada", `La sección ahora se identifica como ${newName}.`);
            } catch (error) {
                triggerAlert("Error", "No se pudo renombrar la sección.");
            }
        }
    };

    const handleRemoveItem = async (category, itemId) => {
        triggerConfirm(
            "Retirar Platillo",
            "¿Desea eliminar este elemento de la propuesta gastronómica?",
            async () => {
                try {
                    await menuService.deletePlatillo(itemId);
                    await fetchMenus();
                    triggerAlert("Elemento Retirado", "El platillo ha sido removido exitosamente.");
                } catch (error) {
                    triggerAlert("Error", "No se pudo eliminar el platillo.");
                }
            },
            "Eliminar"
        );
    };

    const handleRemoveCategory = async (categoryName) => {
        const catId = menus[categoryName]?.id;
        triggerConfirm(
            "Eliminar Categoría",
            "¿Desea eliminar toda la sección y sus platillos contenidos?",
            async () => {
                try {
                    await menuService.deleteCategoria(catId);
                    await fetchMenus();
                    triggerAlert("Sección Eliminada", "La categoría ha sido removida del sistema.");
                } catch (error) {
                    triggerAlert("Error", "No se pudo eliminar la categoría.");
                }
            },
            "Eliminar"
        );
    };

    const handleCreateCategory = async (catName) => {
        const formData = new FormData();
        formData.append('nombre', catName);
        
        try {
            await menuService.createCategoria(formData);
            await fetchMenus();
            triggerAlert("Categoría Creada", `La sección '${catName}' se ha añadido al menú.`);
        } catch (error) {
            console.error("Error creating category:", error.response?.data || error);
            const detail = error.response?.data?.nombre?.[0] || error.response?.data?.error || "Es posible que el nombre ya exista.";
            triggerAlert("Error de Catálogo", `No se pudo crear la nueva categoría. Detalle: ${detail}`);
        }
    };

    return {
        activeTab, setActiveTab, userRole, clients, contracts, testimonios,
        usersList, packages, reservas, adicionales, menus, galeria, 
        searchTerm, setSearchTerm, reservaFilter, setReservaFilter,
        galleryFilter, setGalleryFilter, adicionalFilter, setAdicionalFilter,
        userRoleFilter, setUserRoleFilter, contractFilter, setContractFilter,
        isAddingPackage, setIsAddingPackage, editingPackage, setEditingPackage,
        isAddingAdicional, setIsAddingAdicional, editingAdicional, setEditingAdicional,
        isAddingGallery, setIsAddingGallery, isAddingReservation, setIsAddingReservation,
        isAddingUser, setIsAddingUser,
        isEditingConfig, setIsEditingConfig,
        selectedReservationForContract, setSelectedReservationForContract,
        selectedContractForPayments, setSelectedContractForPayments,
        editingMenuCategory, setEditingMenuCategory,
        editingGallery, setEditingGallery,
        packageForm, setPackageForm, adicionalForm, setAdicionalForm,
        reservationForm, setReservationForm, contractForm, setContractForm,
        userForm, setUserForm, configForm, setConfigForm,
        confirmState, setConfirmState, triggerConfirm, triggerPrompt, triggerAlert,
        coverPreview, setCoverPreview, galleryPreviews, setGalleryPreviews,
        coverFile, setCoverFile, deletedGalleryIds, setDeletedGalleryIds,
        fetchData, handleCreateGallery, handleUpdateGallery, handleDeleteGallery, handleCreatePackage,
        handleUpdatePackage, handleDeletePackage, handleApproveTestimonio,
        handleDeleteTestimonio, handleCancelReservation, handleConfirmReservation, handleCreateContract,
        handleCreatePayment, handleCreateReservation, handleCreateAdicional,
        handleUpdateAdicional, handleDeleteAdicional, handleUpdateUserRole,
        handleToggleUserStatus, handleDeleteUser, handleCreateUser, handleDeleteContract, resetPackageForm, 
        resetAdicionalForm, resetUserForm, handleUpdateConfig, handleConfigChange,
        normalizeText, formatImageUrl, handleRenameCategory, handleRemoveItem, handleRemoveCategory, handleCreateCategory
    };
};
