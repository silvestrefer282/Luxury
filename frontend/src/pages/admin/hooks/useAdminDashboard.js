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
    usuarioService
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

    // Form states
    const [packageForm, setPackageForm] = useState({
        name: '', price: '', capacity: '', duration: 5, extraHourPrice: 0, 
        includedServices: '', notes: '', description: ''
    });
    const [adicionalForm, setAdicionalForm] = useState({
        name: '', price: '', category: 'Entretenimiento', description: ''
    });
    const [reservationForm, setReservationForm] = useState({
        cliente: '', paquete: '', fecha_evento: '', hora_inicio: '14:00', 
        hora_fin: '19:00', num_personas: 100, menu: '', servicios_adicionales: []
    });
    const [contractForm, setContractForm] = useState({
        folio: '', representante_salon: 'Graciela Herrera Ramírez',
        lugar_evento: '2 de Abril 2503 Col. El Carmen, Apizaco, Tlax.',
        cantidad_personas: 0, duracion_horas: 5, total_operacion: 0,
        deposito_garantia: 1000, anticipo_monto: 0, fecha_limite_pago: '', notas_especiales: ''
    });
    const [userForm, setUserForm] = useState({
        username: '', email: '', password: '', 
        first_name: '', apellido_paterno: '', rol: 'Cliente', estatus: true
    });

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
        return `http://127.0.0.1:8000${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const normalizeText = (text) => {
        return text ? text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
    };

    const triggerConfirm = (title, message, onConfirm, confirmText = 'Confirmar') => {
        setConfirmState({ isOpen: true, title, message, onConfirm, type: 'confirm', confirmText });
    };

    const triggerAlert = (title, message) => {
        setConfirmState({ isOpen: true, title, message, onConfirm: null, type: 'alert', confirmText: 'Entendido' });
    };

    const fetchData = async () => {
        try {
            const [respPkg, respRes, respAd, respCats, respPlat, respGal, respCont, respClients, respTest, respUsers] = await Promise.all([
                paqueteService.getAll(),
                reservacionService.getAll(),
                servicioService.getAll(),
                menuService.getCategorias(),
                menuService.getPlatillos(),
                galeriaService.getAll(),
                contratoService.getAll(),
                clienteService.getAll(),
                testimonioService.getAll(),
                usuarioService.getAll()
            ]);
            
            setPackages(respPkg.data.map(p => ({
                id: p.id,
                name: p.nombre,
                price: p.precio_base,
                capacity: p.capacidad_personas,
                duration: p.duracion_horas,
                extraHourPrice: p.precio_hora_adicional,
                includedServices: p.servicios_incluidos,
                notes: p.notes,
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
                hora_inicio: r.hora_inicio,
                hora_fin: r.hora_fin,
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

            setContracts(respCont.data.map(c => ({
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
                total_pagado: c.total_pagado
            })));

            setClients(respClients.data.map(c => ({
                id: c.id,
                name: c.usuario_detalle?.get_full_name || 'N/A'
            })));

            setTestimonios(respTest.data);
            setUsersList(respUsers.data);
          
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
                total_operacion: Number(selectedReservationForContract.total.replace('$', '').replace(',', '')),
                anticipo_monto: 0
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
        data.append('descripcion', 'Imagen exclusiva de Luxury');
        
        const img = formData.get('imagen');
        if (img && img.size > 0) data.append('imagen', img);

        try {
            await galeriaService.create(data);
            fetchData();
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
                    await fetchData();
                    triggerAlert("Imagen Eliminada", "La imagen ha sido retirada de la galería exitosamente");
                } catch (error) {
                    triggerAlert("Error de Archivo", "No se pudo eliminar la imagen seleccionada.");
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
        data.append('descripcion', formData.get('description'));
        
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
        
        if (coverFile) data.append('imagen', coverFile);
        galleryPreviews.forEach(p => data.append('galeria_imgs', p.file));
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

    const handleApproveTestimonio = async (id) => {
        try {
            // Optimistic UI update to remove the button instantly (absolute zero delay)
            setTestimonios(prev => prev.map(t => 
                t.id === id ? { ...t, aprobado: true } : t
            ));

            await testimonioService.update(id, { aprobado: true });
            
            fetchData();
            triggerAlert("Reseña Aprobada", "El testimonio ahora es visible en la página principal.");
        } catch (error) {
            // Revert changes on error
            setTestimonios(prev => prev.map(t => 
                t.id === id ? { ...t, aprobado: false } : t
            ));
            console.error("Error approving testimonio:", error.response?.data || error);
            triggerAlert("Error", "No se pudo actualizar el estado del testimonio.\n" + JSON.stringify(error.response?.data || {}));
        }
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
                    
                    fetchData();
                    triggerAlert("Eliminado", "La reseña ha sido retirada con éxito.");
                } catch (error) {
                    triggerAlert("Error", "No se pudo eliminar el testimonio.");
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

    const handleCreateContract = async (e) => {
        e.preventDefault();
        try {
            await contratoService.create({
                ...contractForm,
                reservacion: selectedReservationForContract.id
            });
            fetchData();
            setSelectedReservationForContract(null);
            triggerAlert("Contrato Generado", "El acuerdo legal ha sido digitalizado y vinculado a la reserva exitosamente.");
        } catch (error) {
            triggerAlert("Error de Registro", "Hubo un problema al intentar formalizar el contrato.");
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
            fetchData();
            setSelectedContractForPayments(null);
        } catch (error) {
            triggerAlert("Error de Caja", "No se pudo registrar el abono en este momento.");
        }
    };

    const handleCreateReservation = async (e) => {
        e.preventDefault();
        try {
            await reservacionService.create(reservationForm);
            fetchData();
            setIsAddingReservation(false);
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
        data.append('tipo_cobro', 'Por Evento');
        
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
        data.append('descripcion', formData.get('description'));
        
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

    const handleUpdateUserRole = async (userId, newRol) => {
        try {
            await usuarioService.update(userId, { rol: newRol });
            fetchData();
            triggerAlert("Rol Actualizado", `El usuario ahora tiene permisos de ${newRol}.`);
        } catch (error) {
            triggerAlert("Error de Sistema", "No fue posible actualizar el privilegio del usuario.");
        }
    };

    const handleToggleUserStatus = async (userId, newStatus) => {
        try {
            await usuarioService.update(userId, { estatus: newStatus });
            fetchData();
            triggerAlert("Estatus Modificado", `Se ha ${newStatus ? 'habilitado' : 'restringido'} el acceso al sistema.`);
        } catch (error) {
            triggerAlert("Error de Operación", "No fue posible modificar el estado del usuario.");
        }
    };

    const handleDeleteUser = async (userId) => {
        triggerConfirm(
            "Eliminar Registro",
            "¿Desea eliminar permanentemente este usuario del ecosistema Luxury? Esta acción retirará todos sus permisos.",
            async () => {
                try {
                    await usuarioService.delete(userId);
                    fetchData();
                    triggerAlert("Usuario Eliminado", "La cuenta ha sido removida exitosamente.");
                } catch (error) {
                    triggerAlert("Error", "No se pudo procesar la baja del usuario.");
                }
            },
            "Eliminar Cuenta"
        );
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await usuarioService.create(userForm);
            fetchData();
            setIsAddingUser(false);
            resetUserForm();
            triggerAlert("Usuario Creado", "La nueva cuenta ha sido registrada en el sistema.");
        } catch (error) {
            triggerAlert("Error al Crear", "No se pudo registrar al usuario. Verifique los datos o si el correo ya existe.");
        }
    };

    const resetPackageForm = () => {
        setPackageForm({
            name: '', price: '', capacity: '', duration: 5, 
            extraHourPrice: 0, includedServices: '', notes: '', description: ''
        });
        setCoverPreview(null); setCoverFile(null);
        setGalleryPreviews([]); setDeletedGalleryIds([]);
    };

    const resetAdicionalForm = () => {
        setAdicionalForm({ name: '', price: '', category: 'Entretenimiento', description: '' });
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
                fetchData();
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
                    fetchData();
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
                    fetchData();
                    triggerAlert("Sección Eliminada", "La categoría ha sido removida del sistema.");
                } catch (error) {
                    triggerAlert("Error", "No se pudo eliminar la categoría.");
                }
            },
            "Eliminar"
        );
    };

    return {
        activeTab, setActiveTab, userRole, clients, contracts, testimonios,
        usersList, packages, reservas, adicionales, menus, galeria, 
        searchTerm, setSearchTerm, reservaFilter, setReservaFilter,
        galleryFilter, setGalleryFilter, adicionalFilter, setAdicionalFilter,
        isAddingPackage, setIsAddingPackage, editingPackage, setEditingPackage,
        isAddingAdicional, setIsAddingAdicional, editingAdicional, setEditingAdicional,
        isAddingGallery, setIsAddingGallery, isAddingReservation, setIsAddingReservation,
        isAddingUser, setIsAddingUser,
        selectedReservationForContract, setSelectedReservationForContract,
        selectedContractForPayments, setSelectedContractForPayments,
        editingMenuCategory, setEditingMenuCategory,
        packageForm, setPackageForm, adicionalForm, setAdicionalForm,
        reservationForm, setReservationForm, contractForm, setContractForm,
        userForm, setUserForm,
        confirmState, setConfirmState, triggerConfirm, triggerAlert,
        coverPreview, setCoverPreview, galleryPreviews, setGalleryPreviews,
        coverFile, setCoverFile, deletedGalleryIds, setDeletedGalleryIds,
        fetchData, handleCreateGallery, handleDeleteGallery, handleCreatePackage,
        handleUpdatePackage, handleDeletePackage, handleApproveTestimonio,
        handleDeleteTestimonio, handleCancelReservation, handleCreateContract,
        handleCreatePayment, handleCreateReservation, handleCreateAdicional,
        handleUpdateAdicional, handleDeleteAdicional, handleUpdateUserRole,
        handleToggleUserStatus, handleDeleteUser, handleCreateUser, resetPackageForm, 
        resetAdicionalForm, resetUserForm,
        normalizeText, formatImageUrl, handleRenameCategory, handleRemoveItem, handleRemoveCategory
    };
};
