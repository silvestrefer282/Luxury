import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { paqueteService, reservacionService, servicioService, menuService, configuracionService } from '../services/api';
import { Calendar, Users, Info, Star, Shield, ArrowRight, Clock, MapPin, Phone, Utensils, AlertCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Reservar = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [paquetes, setPaquetes] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [platillos, setPlatillos] = useState([]);
    const [config, setConfig] = useState(null);
    const [reservacionesActivas, setReservacionesActivas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isBarFixed, setIsBarFixed] = useState(false);
    const [activeCatIndex, setActiveCatIndex] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');

    const notify = (msg) => {
        setErrorMsg(msg);
        // Eliminado el temporizador para que el usuario deba cerrarlo manualmente
        // setTimeout(() => setErrorMsg(''), 4000); 
    };

    const [formData, setFormData] = useState({
        paquete: '',
        tipo_evento: '',
        fecha_evento: '',
        num_personas: '',
        hora_inicio: '14:00',
        hora_fin: '19:00',
        horas_adicionales: 0,
        servicios_adicionales: [],
        platillos_seleccionados: [],
        nombre_festejado: '',
        domicilio_contacto: '',
        telefono_contacto: '',
        notas: ''
    });

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [pkgs, svcs, cats, plates, cfg, reservas] = await Promise.all([
                    paqueteService.getAll(),
                    servicioService.getAll(),
                    menuService.getCategorias(),
                    menuService.getPlatillos(),
                    configuracionService.getCurrent(),
                    reservacionService.getPublicCalendar()
                ]);
                setPaquetes(pkgs.data);
                setServicios(svcs.data);
                setCategorias(cats.data);
                setPlatillos(plates.data);
                setConfig(cfg.data);
                setReservacionesActivas(reservas.data);
            } catch (err) {
                console.error("Error loading reservation data:", err);
            }
        };
        fetchAll();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'fecha_evento') {
            const isBooked = reservacionesActivas.some(r => r.fecha === value);
            if (isBooked) {
                notify("Esta fecha ya se encuentra reservada. Por favor, selecciona otro día.");
                setFormData(prev => ({ ...prev, [name]: '' }));
                return;
            }
        }
        
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceToggle = (id) => {
        setFormData(prev => {
            const current = prev.servicios_adicionales;
            const updated = current.includes(id)
                ? current.filter(sId => sId !== id)
                : [...current, id];
            return { ...prev, servicios_adicionales: updated };
        });
    };

    const handlePlatilloToggle = (id) => {
        const pkg = paquetes.find(p => p.id === formData.paquete);
        const limit = pkg ? pkg.numero_tiempos : 1;
        const clickedPlatillo = platillos.find(p => p.id === id);

        setFormData(prev => {
            let current = [...prev.platillos_seleccionados];
            
            // Si ya está seleccionado, lo quitamos
            if (current.includes(id)) {
                return { ...prev, platillos_seleccionados: current.filter(pId => pId !== id) };
            }

            // REGLA: Solo uno por categoría. Buscamos si hay otro de la misma categoría
            const existingInCategory = current.find(pId => {
                const p = platillos.find(item => item.id === pId);
                return p && p.categoria === clickedPlatillo.categoria;
            });

            if (existingInCategory) {
                // Intercambiamos (SWAP)
                current = current.filter(pId => pId !== existingInCategory);
                current.push(id);
                return { ...prev, platillos_seleccionados: current };
            }

            // Si llegamos aquí es un platillo nuevo en una categoría nueva
            if (current.length >= limit) {
                notify(`Límite alcanzado: Este paquete solo permite elegir ${limit} tiempos.`);
                return prev;
            }

            return { ...prev, platillos_seleccionados: [...current, id] };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user || (!user.cliente_id && user.rol !== 'Administrador')) {
            notify("Debes iniciar sesión para reservar.");
            return;
        }

        if (!formData.paquete) {
            notify("Por favor selecciona un paquete.");
            return;
        }

        // --- VALIDACIÓN DE HORARIOS DEL SALÓN ---
        if (config) {
            const start = formData.hora_inicio;
            const pkg = paquetes.find(p => p.id === formData.paquete);
            const totalDuration = (pkg?.duracion_horas || 0) + (formData.horas_adicionales || 0);
            
            const [sh, sm] = start.split(':').map(Number);
            let startTotal = sh * 60 + sm;
            
            const [ah, am] = config.hora_apertura.split(':').map(Number);
            const apertureTotal = ah * 60 + am;
            
            let [ch, cm] = config.hora_cierre.split(':').map(Number);
            
            // Fix mistaken 12:00 PM configuration for midnight
            if (ch === 12 && cm === 0 && ah >= 6) {
                ch = 0;
            }
            
            let closureTotal = ch * 60 + cm;
            
            if (closureTotal <= apertureTotal) {
                closureTotal += 1440;
            }
            
            if (startTotal < apertureTotal) {
                startTotal += 1440;
            }
            
            const endTotal = startTotal + (totalDuration * 60);

            if (startTotal < apertureTotal) {
                notify(`El salón abre a las ${format12h(config.hora_apertura)}. Por favor ajusta la hora de inicio.`);
                return;
            }
            if (endTotal > closureTotal) {
                notify(`El evento terminaría a las ${endTimeFormatted}, pero el salón cierra a las ${format12h(config.hora_cierre)}. Por favor reduce las horas o ajusta el inicio.`);
                return;
            }
        }

        setLoading(true);
        try {
            // Asegurar que el ID del cliente existe
            const clienteId = user.cliente_id;
            
            if (!clienteId) {
                notify("Error: No se encontró un perfil de cliente asociado a tu cuenta. Intenta cerrar sesión y volver a entrar.");
                setLoading(false);
                return;
            }

            const payload = {
                ...formData,
                num_personas: Number(formData.num_personas),
                cliente: clienteId,
                observaciones: `Evento: ${formData.tipo_evento}. Festejado: ${formData.nombre_festejado}. Notas: ${formData.notas}`
            };
            await reservacionService.create(payload);
            notify("¡Reservación realizada con éxito!");
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error(error);
            notify(error.response?.data?.error || "Error al procesar la reserva. Verifica disponibilidad.");
        } finally {
            setLoading(false);
        }
    };

    const selectedPkg = paquetes.find(p => p.id == formData.paquete);
    const selectedServices = servicios.filter(s => formData.servicios_adicionales.some(id => id == s.id));
    
    const extraHoursCost = (formData.horas_adicionales || 0) * (Number(selectedPkg?.precio_hora_adicional) || 0);
    const totalPrice = (Number(selectedPkg?.precio_base) || 0) + extraHoursCost + selectedServices.reduce((sum, s) => sum + Number(s.precio_unitario || 0), 0);

    const format12h = (time24) => {
        if (!time24) return '--:--';
        const [h, m] = time24.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    const calculateEndTime = () => {
        if (!formData.hora_inicio || !selectedPkg) return '--:--';
        const [h, m] = formData.hora_inicio.split(':').map(Number);
        const totalDuration = (selectedPkg.duracion_horas || 0) + (formData.horas_adicionales || 0);
        const endH = (h + totalDuration) % 24;
        const ampm = endH >= 12 ? 'PM' : 'AM';
        const h12 = endH % 12 || 12;
        return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    const startTimeFormatted = format12h(formData.hora_inicio);
    const endTimeFormatted = calculateEndTime();

    const getAvailableHours = () => {
        if (!config || !selectedPkg) return [];
        const hours = [];
        
        const [ah, am] = config.hora_apertura.split(':').map(Number);
        let [ch, cm] = config.hora_cierre.split(':').map(Number);
        
        // Fix mistaken 12:00 PM configuration for midnight
        if (ch === 12 && cm === 0 && ah >= 6) {
            ch = 0;
        }
        
        let apertureMin = ah * 60 + am;
        let closureMin = ch * 60 + cm;
        
        // Soporte para horarios que cruzan la medianoche
        if (closureMin <= apertureMin) {
            closureMin += 1440;
        }

        const totalDuration = (selectedPkg.duracion_horas || 0) + (formData.horas_adicionales || 0);
        const cleaning = Number(config.hora_limpieza) || 0;
        
        // El evento debe terminar + limpieza antes o igual al cierre
        const startLimit = closureMin - (totalDuration * 60);

        for (let t = apertureMin; t <= startLimit; t += 30) {
            const h = Math.floor(t / 60) % 24;
            const m = t % 60;
            const time24 = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            hours.push({
                value: time24,
                label: format12h(time24)
            });
        }
        return hours;
    };

    const availableHours = getAvailableHours();

    // Efecto para ajustar la hora de inicio si la actual deja de ser válida
    useEffect(() => {
        if (availableHours.length > 0) {
            const isCurrentValid = availableHours.some(h => h.value === formData.hora_inicio);
            if (!isCurrentValid && formData.hora_inicio) {
                // ALERTA: Notificar que la duración excedió el límite para la hora actual
                notify(`Al añadir tiempo extra, el evento terminaría después del cierre del salón (${format12h(config.hora_cierre)}). Por favor ajusta la hora de inicio o las horas adicionales.`);
                
                // Si la hora por defecto (14:00) o la seleccionada no es válida, 
                // tomamos la primera disponible o una cercana a la tarde si es posible
                const preferred = availableHours.find(h => h.value === '14:00') || availableHours[0];
                setFormData(prev => ({ ...prev, hora_inicio: preferred.value }));
            }
        } else if (selectedPkg && config && (formData.fecha_evento || formData.tipo_evento)) {
            // ALERTA: El paquete completo es físicamente imposible para el horario del salón
            const duration = selectedPkg.duracion_horas + formData.horas_adicionales;
            notify(`Atención: El paquete seleccionado con tiempo extra (${duration}h) excede el horario total de operación del salón (${format12h(config.hora_apertura)} a ${format12h(config.hora_cierre)}).`);
        }
    }, [availableHours, formData.hora_inicio, selectedPkg, config, formData.horas_adicionales, formData.fecha_evento, formData.tipo_evento]);

    // EFECTO: Sincronizar hora_fin automáticamente en el formData
    useEffect(() => {
        if (formData.hora_inicio && selectedPkg) {
            const [h, m] = formData.hora_inicio.split(':').map(Number);
            const totalDuration = (selectedPkg.duracion_horas || 0) + (formData.horas_adicionales || 0);
            const endH = (h + totalDuration) % 24;
            const time24 = `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            
            if (formData.hora_fin !== time24) {
                setFormData(prev => ({ ...prev, hora_fin: time24 }));
            }
        }
    }, [formData.hora_inicio, formData.horas_adicionales, selectedPkg, formData.hora_fin]);

    const renderSummaryPanel = () => (
        <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1a1a1a] text-white p-10 rounded-[40px] shadow-2xl space-y-10 w-full"
        >
            <div className="border-b border-white/10 pb-8">
                <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-white/40 mb-2">Resumen de Selección</h4>
                <div className="text-3xl font-serif italic mb-2">Tu Evento</div>
                <div className="text-[10px] uppercase tracking-widest text-white/60">
                    {formData.fecha_evento || 'Sin fecha'} • {startTimeFormatted} - {endTimeFormatted}
                </div>
            </div>

            <div className="space-y-6">
                {selectedPkg ? (
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                            <p className="text-[9px] uppercase tracking-widest text-white/30 font-black">Paquete</p>
                            <p className="text-sm font-bold tracking-tighter uppercase">{selectedPkg.nombre}</p>
                        </div>
                        <span className="text-sm font-light tracking-tighter text-white/60">${Number(selectedPkg.precio_base).toLocaleString()}</span>
                    </div>
                ) : (
                    <p className="text-[10px] uppercase tracking-widest text-white/20 italic">No se ha seleccionado paquete...</p>
                )}

                {formData.horas_adicionales > 0 && selectedPkg && (
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                        <div className="space-y-1">
                            <p className="text-[9px] uppercase tracking-widest text-white/30 font-black">Tiempo Extra</p>
                            <p className="text-[11px] font-bold uppercase">{formData.horas_adicionales} {formData.horas_adicionales === 1 ? 'Hora' : 'Horas'}</p>
                        </div>
                        <span className="text-[11px] text-white/60">+ ${extraHoursCost.toLocaleString()}</span>
                    </div>
                )}

                {formData.platillos_seleccionados.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <p className="text-[9px] uppercase tracking-widest text-white/30 font-black">Menú Seleccionado</p>
                        <div className="space-y-2">
                            {formData.platillos_seleccionados.map(pId => {
                                const p = platillos.find(item => item.id === pId);
                                return p ? (
                                    <div key={pId} className="flex items-center gap-3">
                                        <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                                        <span className="text-[10px] uppercase tracking-wider text-white/80">{p.nombre}</span>
                                    </div>
                                ) : null;
                            })}
                        </div>
                    </div>
                )}

                {selectedServices.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <p className="text-[9px] uppercase tracking-widest text-white/30 font-black">Adicionales Luxury</p>
                        <div className="space-y-3">
                            {selectedServices.map(s => (
                                <div key={s.id} className="flex justify-between items-center">
                                    <span className="text-[10px] uppercase tracking-wider text-white/80">{s.nombre}</span>
                                    <span className="text-[10px] text-white/40">${Number(s.precio_unitario).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-8 border-t-2 border-white/10">
                <div className="flex justify-between items-baseline mb-2">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40 leading-none">Inversión Total</span>
                    <span className="text-4xl font-serif italic text-white leading-none">${totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-[8px] uppercase tracking-widest text-white/20">Sujeto a cambios según disponibilidad de fecha y extras.</p>
            </div>

            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-4 text-white/60">
                    <Shield size={16} />
                    <p className="text-[9px] uppercase tracking-widest leading-loose">Protegido por el acuerdo de exclusividad SIR LUXURY</p>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', scrollBehavior: 'smooth' }}>
            <Navbar />

            <div className="container mx-auto px-4 md:px-8 py-32 md:py-40">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative items-start">
                    
                    {/* LEFT: FORM STEPS */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex-1 space-y-20"
                    >
                        <div className="pb-12 border-b border-gray-100 text-center">
                             <h1 style={{ fontSize: '3.5rem', lineHeight: 1.1 }} className="font-serif italic mb-4">Configura Tu Experiencia</h1>
                             <p className="text-[12px] uppercase tracking-[0.5em] text-gray-400 font-black">Luxury Reservation Portal</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-32">
                            {/* 1. Selecciona Paquete */}
                            <section id="step1" className="space-y-16">
                                <div className="flex flex-col items-center text-center gap-4">
                                    <span className="w-12 h-12 rounded-full border border-black flex items-center justify-center text-[10px] font-black">01</span>
                                    <h3 className="font-serif text-4xl uppercase tracking-tight">Selección de la Experiencia</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {paquetes.map(p => {
                                        const isSelected = formData.paquete === p.id;
                                        return (
                                            <motion.div
                                                key={p.id}
                                                whileHover={{ y: -5 }}
                                                onClick={() => setFormData({ 
                                                    ...formData, 
                                                    paquete: p.id, 
                                                    platillos_seleccionados: [],
                                                    num_personas: p.capacidad_personas 
                                                })}
                                                className={`relative p-12 cursor-pointer transition-all duration-500 rounded-[40px] border-2 flex flex-col items-center text-center ${isSelected ? 'border-black bg-white shadow-2xl scale-[1.02]' : 'border-gray-100 bg-white hover:border-black/20'}`}
                                            >
                                                <h4 className="font-serif text-3xl uppercase tracking-tighter mb-2">{p.nombre}</h4>
                                                <div className="flex items-baseline gap-1 mb-10">
                                                    <span className="text-4xl font-light tracking-tighter">${Number(p.precio_base).toLocaleString()}</span>
                                                </div>

                                                <div className="space-y-4 text-[11px] uppercase tracking-widest text-gray-400 font-bold flex flex-col items-center">
                                                    <div className="flex items-center gap-3"><Clock size={14} className="text-black" /> {p.duracion_horas} Horas</div>
                                                    <div className="flex items-center gap-3"><Users size={14} className="text-black" /> {p.capacidad_personas} Pax</div>
                                                    {p.incluye_menu && <div className="text-black underline underline-offset-4 flex items-center gap-2"><Utensils size={14} /> {p.numero_tiempos} Tiempos</div>}
                                                </div>

                                                {/* Hora adicional info */}
                                                <div className="mt-12 pt-8 border-t border-gray-50 w-full flex justify-between items-center text-[10px] uppercase tracking-widest font-black text-gray-300">
                                                    <span>Hora Adicional</span>
                                                    <span className="text-black">${Number(p.precio_hora_adicional).toLocaleString()}</span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Selector de Horas Adicionales */}
                                {selectedPkg && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-12 bg-white p-10 rounded-[40px] border border-gray-100 flex flex-col items-center justify-center text-center gap-8 shadow-sm"
                                    >
                                        <div className="space-y-1">
                                            <h4 className="font-serif text-2xl italic">¿Deseas extender la celebración?</h4>
                                            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300">Añade horas extras al paquete seleccionado</p>
                                        </div>
                                        <div className="flex items-center gap-8 bg-gray-50 p-4 rounded-full px-8 border border-gray-100">
                                            <button 
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, horas_adicionales: Math.max(0, prev.horas_adicionales - 1) }))}
                                                className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all shadow-sm"
                                            >-</button>
                                            <div className="text-center min-w-[50px]">
                                                <span className="text-2xl font-serif">{formData.horas_adicionales}</span>
                                                <p className="text-[8px] uppercase tracking-widest font-black text-gray-400">Horas</p>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, horas_adicionales: prev.horas_adicionales + 1 }))}
                                                className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all shadow-sm"
                                            >+</button>
                                        </div>
                                    </motion.div>
                                )}
                            </section>

                             {/* 2. Datos generales y Contacto */}
                             <section id="step2" className="space-y-16">
                                 <div className="flex flex-col items-center text-center gap-4">
                                     <span className="w-12 h-12 rounded-full border border-black flex items-center justify-center text-[10px] font-black">02</span>
                                     <h3 className="font-serif text-4xl uppercase tracking-tight">Logística del Evento</h3>
                                 </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 bg-white p-12 rounded-[40px] shadow-sm border border-gray-50">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300 block">Categoría de Evento</label>
                                        <select name="tipo_evento" value={formData.tipo_evento} onChange={handleChange} required className="w-full bg-transparent border-b border-gray-100 py-3 font-serif text-lg outline-none focus:border-black transition-colors">
                                            <option value="">Selecciona...</option>
                                            <option value="Boda">Boda Real</option>
                                            <option value="XV Años">XV Años Gala</option>
                                            <option value="Bautizo">Bautizo</option>
                                            <option value="Graduación">Graduación</option>
                                            <option value="Corporativo">Corporativo</option>
                                            <option value="Social">Social</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300 block">Calendario</label>
                                        <input type="date" name="fecha_evento" value={formData.fecha_evento} min={new Date().toISOString().split('T')[0]} onChange={handleChange} required className="w-full bg-transparent border-b border-gray-100 py-3 font-serif text-lg outline-none focus:border-black" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300 block">Hora de Inicio</label>
                                        <select 
                                            name="hora_inicio" 
                                            value={formData.hora_inicio} 
                                            onChange={handleChange} 
                                            required 
                                            className="w-full bg-transparent border-b border-gray-100 py-3 font-serif text-lg outline-none focus:border-black appearance-none cursor-pointer"
                                        >
                                            <option value="">{availableHours.length === 0 && selectedPkg ? 'No hay horarios disponibles (Paquete muy largo)' : 'Selecciona...'}</option>
                                            {availableHours.map(h => (
                                                <option key={h.value} value={h.value}>{h.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2 group">
                                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300 block">Hora de Finalización</label>
                                        <div className="w-full border-b border-gray-100 py-3 font-serif text-lg text-gray-600 flex items-center justify-between">
                                            {endTimeFormatted}
                                            <Clock size={16} className="text-gray-200" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300 block">Nombre del Festejado</label>
                                        <input type="text" name="nombre_festejado" value={formData.nombre_festejado} onChange={handleChange} placeholder="Ej: Alejandra García" required className="w-full bg-transparent border-b border-gray-100 py-3 font-serif text-lg outline-none focus:border-black" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300 block">Invitados (Fijo por Paquete)</label>
                                        <input type="number" name="num_personas" value={formData.num_personas} readOnly className="w-full bg-transparent border-b border-gray-100 py-3 font-serif text-lg text-gray-400 cursor-not-allowed outline-none focus:border-gray-200" />
                                    </div>
                                    <div className="space-y-2 lg:col-span-2">
                                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300 block">Dirección de Contacto (Contrato)</label>
                                        <input type="text" name="domicilio_contacto" value={formData.domicilio_contacto} onChange={handleChange} placeholder="Dirección completa..." required className="w-full bg-transparent border-b border-gray-100 py-3 font-serif text-lg outline-none focus:border-black" />
                                    </div>
                                    <div className="space-y-2 lg:col-span-2">
                                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300 block">Línea Telefónica</label>
                                        <input type="tel" name="telefono_contacto" value={formData.telefono_contacto} onChange={handleChange} placeholder="10 dígitos" required className="w-full bg-transparent border-b border-gray-100 py-3 font-serif text-lg outline-none focus:border-black" />
                                    </div>
                                </div>
                            </section>

                            {/* 3. Selección de Menú */}
                            {selectedPkg && selectedPkg.incluye_menu && (
                                <section id="step3" className="space-y-16">
                                    <div className="flex flex-col items-center text-center gap-4">
                                        <span className="w-12 h-12 rounded-full border border-black flex items-center justify-center text-[10px] font-black">03</span>
                                        <h3 className="font-serif text-4xl uppercase tracking-tight">Curaduría Gourmet</h3>
                                    </div>

                                    {/* Category Navigator for Menu Selection */}
                                    <div className="bg-white p-6 rounded-full border border-gray-100 shadow-sm flex items-center justify-between mb-12">
                                        <button 
                                            type="button"
                                            onClick={() => setActiveCatIndex(Math.max(0, activeCatIndex - 1))}
                                            disabled={activeCatIndex === 0}
                                            className={`flex items-center gap-2 p-2 px-6 rounded-full transition-all text-[10px] font-black uppercase tracking-widest ${activeCatIndex === 0 ? 'opacity-20 grayscale' : 'hover:bg-gray-50 text-black'}`}
                                        >
                                            <ChevronLeft size={16} /> Anterior
                                        </button>

                                        <div className="flex flex-col items-center">
                                            <span className="text-[9px] uppercase tracking-[0.4em] text-gray-400 font-bold mb-1">Categoría {activeCatIndex + 1} de {categorias.length}</span>
                                            <h4 className="font-serif text-2xl italic text-black">{categorias[activeCatIndex]?.nombre}</h4>
                                        </div>

                                        <button 
                                            type="button"
                                            onClick={() => setActiveCatIndex(Math.min(categorias.length - 1, activeCatIndex + 1))}
                                            disabled={activeCatIndex === categorias.length - 1}
                                            className={`flex items-center gap-2 p-2 px-6 rounded-full transition-all text-[10px] font-black uppercase tracking-widest ${activeCatIndex === categorias.length - 1 ? 'opacity-20 grayscale' : 'hover:bg-gray-50 text-black'}`}
                                        >
                                            Siguiente <ChevronRight size={16} />
                                        </button>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        <motion.div 
                                            key={activeCatIndex}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                                        >
                                            {platillos.filter(p => p.categoria === categorias[activeCatIndex]?.id).map(p => {
                                                const isSelected = formData.platillos_seleccionados.includes(p.id);
                                                return (
                                                    <motion.div 
                                                        key={p.id} 
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={() => handlePlatilloToggle(p.id)}
                                                        className={`cursor-pointer transition-all p-6 rounded-[32px] border-2 flex items-center gap-6 ${isSelected ? 'border-black bg-white shadow-xl scale-[1.02]' : 'border-white bg-white hover:border-gray-100'}`}
                                                    >
                                                        <div className={`w-16 h-16 rounded-full overflow-hidden border-2 shadow-inner ${isSelected ? 'border-black' : 'border-gray-50'}`}>
                                                            {p.imagen && <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className={`text-[11px] font-black uppercase tracking-widest leading-tight ${isSelected ? 'text-black' : 'text-gray-500'}`}>{p.nombre}</p>
                                                            {isSelected && <p className="text-[10px] text-gray-400 mt-1 font-serif italic">Seleccionado</p>}
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </motion.div>
                                    </AnimatePresence>
                                </section>
                            )}

                             {/* 4. Complementos */}
                            <section id="step4" className="space-y-16">
                                <div className="flex flex-col items-center text-center gap-4">
                                    <span className="w-12 h-12 rounded-full border border-black flex items-center justify-center text-[10px] font-black">04</span>
                                    <h3 className="font-serif text-4xl uppercase tracking-tight">Complementos Luxury</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {servicios.map(s => {
                                        const isSelected = formData.servicios_adicionales.includes(s.id);
                                        return (
                                            <div
                                                key={s.id}
                                                onClick={() => handleServiceToggle(s.id)}
                                                className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex justify-between items-center ${isSelected ? 'border-black bg-white shadow-xl' : 'border-white bg-white hover:border-black/5'}`}
                                            >
                                                <div className="space-y-1">
                                                    <span className="uppercase tracking-[0.2em] font-black text-[9px] block">{s.nombre}</span>
                                                    <span className="text-gray-400 text-xs">${Number(s.precio_unitario).toLocaleString()}</span>
                                                </div>
                                                <Shield size={16} className={isSelected ? 'text-black' : 'text-gray-100'} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                             {/* 5. Notas */}
                            <section id="step5" className="space-y-16">
                                <div className="flex flex-col items-center text-center gap-4">
                                    <span className="w-12 h-12 rounded-full border border-black flex items-center justify-center text-[10px] font-black">05</span>
                                    <h3 className="font-serif text-4xl uppercase tracking-tight">Notas de Producción</h3>
                                </div>
                                <textarea
                                    name="notas"
                                    value={formData.notas}
                                    onChange={handleChange}
                                    rows="6"
                                    placeholder="Comparte detalles específicos para elevar tu evento..."
                                    className="w-full border-2 border-gray-50 rounded-[30px] p-8 outline-none focus:border-black transition-all bg-gray-50/30"
                                ></textarea>
                            </section>

                            {/* Panel Summary en Móvil */}
                            <div className="lg:hidden w-full mt-12 pb-4">
                                {renderSummaryPanel()}
                            </div>

                            {/* 6. Submit */}
                            <div className="pt-10 md:pt-20">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-black text-white w-full py-10 text-[12px] uppercase tracking-[0.8em] font-black hover:bg-gray-900 transition-all rounded-full shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)]"
                                >
                                    {loading ? 'Formalizando...' : 'Finalizar Proceso de Reserva'}
                                </button>
                            </div>
                        </form>
                    </motion.div>

                    {/* RIGHT: STICKY SUMMARY PANEL */}
                    <div className="lg:w-[380px] sticky top-[10rem] hidden lg:block">
                        {renderSummaryPanel()}
                    </div>
                </div>
            </div>

            <Footer />

            {/* Premium Toast System */}
            <AnimatePresence>
                {errorMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                        style={{
                            position: 'fixed',
                            bottom: '2rem',
                            left: '50%',
                            x: '-50%',
                            zIndex: 9999,
                            minWidth: '320px',
                            background: '#000',
                            color: '#fff',
                            padding: '1.5rem 2rem',
                            borderRadius: '100px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        <div className="bg-white/10 p-2 rounded-full">
                            <AlertCircle size={18} className="text-white" />
                        </div>
                        <p className="text-[11px] uppercase tracking-[0.3em] font-black">{errorMsg}</p>
                        <button 
                            onClick={() => setErrorMsg('')}
                            className="ml-auto hover:rotate-90 transition-transform p-1"
                        >
                            <X size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Reservar;