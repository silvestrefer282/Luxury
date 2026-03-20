import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Clock, Utensils, Shield, User, MapPin, Phone, Star, Info } from 'lucide-react';

const ReservationModal = ({
    isOpen,
    onClose,
    clients,
    packages,
    menus,
    adicionales,
    config,
    reservationForm,
    setReservationForm,
    handleCreateReservation
}) => {
    const [selectedPackage, setSelectedPackage] = useState(null);

    // Formato 12h para mostrar en UI
    const format12h = (time24h) => {
        if (!time24h) return '--:--';
        const [h, m] = time24h.split(':').map(Number);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return `${h12}:${m === 0 ? '00' : m < 10 ? '0' + m : m} ${ampm}`;
    };

    // Calcular Hora Fin automáticamente
    const calculateEndTime = () => {
        if (!reservationForm.paquete || !reservationForm.hora_inicio) return '--:--';
        const pkg = packages.find(p => p.id === parseInt(reservationForm.paquete));
        if (!pkg) return '--:--';
        
        const totalDuration = Number(pkg.duration || pkg.duracion_horas) + Number(reservationForm.horas_adicionales || 0);
        const [h, m] = reservationForm.hora_inicio.split(':').map(Number);
        
        const endH = (h + Math.floor(totalDuration)) % 24;
        const endM = (m + (totalDuration % 1) * 60) % 60;
        
        const timeStr = `${String(endH).padStart(2, '0')}:${String(Math.round(endM)).padStart(2, '0')}`;
        return format12h(timeStr);
    };

    useEffect(() => {
        if (reservationForm.paquete) {
            const pkg = packages.find(p => p.id === parseInt(reservationForm.paquete));
            setSelectedPackage(pkg);
            // Sincronizar invitados si está vacío o es el default
            if (pkg) {
                setReservationForm(prev => ({ 
                    ...prev, 
                    num_personas: pkg.capacity || pkg.capacidad_personas,
                    // Limpiar platillos si el nuevo paquete no admite tantos
                    platillos_seleccionados: prev.platillos_seleccionados.slice(0, pkg.numero_tiempos)
                }));
            }
        }
    }, [reservationForm.paquete, packages]);

    if (!isOpen) return null;

    const togglePlatillo = (platilloId) => {
        const pkg = selectedPackage;
        const limit = pkg ? pkg.numero_tiempos : 1;
        
        // Encontrar categoría del platillo clickeado
        let clickedCat = null;
        Object.entries(menus).forEach(([catName, data]) => {
            if (data.items.find(i => i.id === platilloId)) clickedCat = data.id;
        });

        setReservationForm(prev => {
            let current = [...prev.platillos_seleccionados];
            
            if (current.includes(platilloId)) {
                return { ...prev, platillos_seleccionados: current.filter(id => id !== platilloId) };
            }

            // Regla: 1 por categoría
            const existingInCategory = current.find(id => {
                let catId = null;
                Object.entries(menus).forEach(([catName, data]) => {
                    if (data.items.find(i => i.id === id)) catId = data.id;
                });
                return catId === clickedCat;
            });

            if (existingInCategory) {
                current = current.filter(id => id !== existingInCategory);
                current.push(platilloId);
                return { ...prev, platillos_seleccionados: current };
            }

            if (current.length >= limit) return prev;
            return { ...prev, platillos_seleccionados: [...current, platilloId] };
        });
    };

    const toggleService = (id) => {
        setReservationForm(prev => {
            const current = prev.servicios_adicionales;
            const updated = current.includes(id)
                ? current.filter(sId => sId !== id)
                : [...current, id];
            return { ...prev, servicios_adicionales: updated };
        });
    };

    const endTimeDisplay = calculateEndTime();

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[5000] bg-black/95 backdrop-blur-xl overflow-y-auto flex p-4 sm:p-10"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
                    className="m-auto bg-white max-w-6xl w-full p-12 md:p-16 relative shadow-2xl border border-white/10 rounded-[40px] overflow-hidden"
                >
                    <button onClick={onClose} className="absolute top-10 right-10 text-gray-400 hover:text-black transition-all z-10">
                        <X size={32} />
                    </button>

                    <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-100 pb-12 mb-12 gap-8">
                        <div>
                            <span className="text-[10px] uppercase tracking-[0.6em] font-black text-gray-300 block mb-4">Módulo de Administración</span>
                            <h2 className="text-5xl font-serif text-black leading-tight">Nueva <span className="italic font-light">Inscripción Maestra</span></h2>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-center min-w-[200px]">
                            <span className="text-[9px] uppercase tracking-widest font-black text-gray-400 block mb-2">Hora Final Estimada</span>
                            <div className="flex items-center justify-center gap-3 text-2xl font-serif">
                                <Clock size={20} className="text-gray-300" />
                                {endTimeDisplay}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleCreateReservation} className="space-y-16">
                        {/* 1. SUJETO Y PAQUETE */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gray-400 italic">
                                    <User size={12}/> Cliente Titular
                                </label>
                                <select 
                                    required
                                    value={reservationForm.cliente}
                                    onChange={(e) => setReservationForm({...reservationForm, cliente: e.target.value})}
                                    className="w-full border-b border-gray-100 py-4 font-serif text-lg outline-none focus:border-black transition-all"
                                >
                                    <option value="">-- Elija un cliente --</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gray-400 italic">
                                    <Star size={12}/> Paquete Premium
                                </label>
                                <select 
                                    required
                                    value={reservationForm.paquete}
                                    onChange={(e) => setReservationForm({...reservationForm, paquete: e.target.value})}
                                    className="w-full border-b border-gray-100 py-4 font-serif text-lg outline-none focus:border-black transition-all"
                                >
                                    <option value="">-- Seleccione paquete --</option>
                                    {packages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gray-400 italic">
                                    <Info size={12}/> Categoría de Evento
                                </label>
                                <select 
                                    required
                                    value={reservationForm.tipo_evento}
                                    onChange={(e) => setReservationForm({...reservationForm, tipo_evento: e.target.value})}
                                    className="w-full border-b border-gray-100 py-4 font-serif text-lg outline-none focus:border-black transition-all"
                                >
                                    <option value="">Selecciona...</option>
                                    <option value="Boda">Boda Real</option>
                                    <option value="XV Años">XV Años Gala</option>
                                    <option value="Corporativo">Corporativo</option>
                                    <option value="Social">Social</option>
                                </select>
                            </div>
                        </div>

                        {/* 2. LOGISTICA Y CONTACTO */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 bg-gray-50/50 p-10 rounded-[40px] border border-gray-50">
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-widest font-black text-gray-300 block italic">Fecha</label>
                                <input type="date" required value={reservationForm.fecha_evento} onChange={(e) => setReservationForm({...reservationForm, fecha_evento: e.target.value})} className="w-full bg-transparent border-b border-gray-100 py-3 font-serif text-lg outline-none focus:border-black" />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-widest font-black text-gray-300 block italic">Invitados</label>
                                <input type="number" value={reservationForm.num_personas} onChange={(e) => setReservationForm({...reservationForm, num_personas: e.target.value})} className="w-full bg-transparent border-b border-gray-100 py-3 font-serif text-lg outline-none focus:border-black" />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-widest font-black text-gray-300 block italic">Inicio</label>
                                <input type="time" value={reservationForm.hora_inicio} onChange={(e) => setReservationForm({...reservationForm, hora_inicio: e.target.value})} className="w-full bg-transparent border-b border-gray-100 py-3 font-serif text-lg outline-none focus:border-black" />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-widest font-black text-gray-300 block italic">Horas Extra</label>
                                <input type="number" min="0" value={reservationForm.horas_adicionales} onChange={(e) => setReservationForm({...reservationForm, horas_adicionales: e.target.value})} className="w-full bg-transparent border-b border-gray-100 py-3 font-serif text-lg outline-none focus:border-black" />
                            </div>

                            <div className="md:col-span-2 space-y-4">
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gray-300 italic"><User size={10}/> Nombre Festejado</label>
                                <input type="text" value={reservationForm.nombre_festejado} onChange={(e) => setReservationForm({...reservationForm, nombre_festejado: e.target.value})} placeholder="Ej: Alejandra García" className="w-full bg-transparent border-b border-gray-100 py-3 font-serif text-lg outline-none focus:border-black" />
                            </div>
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gray-300 italic"><MapPin size={10}/> Domicilio Contrato</label>
                                <input type="text" value={reservationForm.domicilio_contacto} onChange={(e) => setReservationForm({...reservationForm, domicilio_contacto: e.target.value})} className="w-full bg-transparent border-b border-gray-100 py-3 font-serif text-lg outline-none focus:border-black" />
                            </div>
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-gray-300 italic"><Phone size={10}/> Teléfono</label>
                                <input type="tel" value={reservationForm.telefono_contacto} onChange={(e) => setReservationForm({...reservationForm, telefono_contacto: e.target.value})} className="w-full bg-transparent border-b border-gray-100 py-3 font-serif text-lg outline-none focus:border-black" />
                            </div>
                        </div>

                        {/* 3. MENU Y SERVICIOS */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pt-8">
                            {/* MENU */}
                            {selectedPackage?.incluye_menu && (
                                <div className="space-y-10">
                                    <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                                        <h4 className="flex items-center gap-3 text-xl font-serif italic"><Utensils size={20} className="text-gray-300"/> Selección de Tiempos</h4>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-luxury-black bg-gray-100 px-4 py-1 rounded-full">
                                            {reservationForm.platillos_seleccionados?.length} / {selectedPackage.numero_tiempos}
                                        </span>
                                    </div>
                                    <div className="space-y-8 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                        {Object.entries(menus).map(([category, data]) => (
                                            <div key={category} className="space-y-4">
                                                <h5 className="text-[9px] uppercase tracking-[0.3em] font-black text-gray-300 flex items-center gap-4">
                                                    {category}
                                                    <div className="h-[1px] bg-gray-50 flex-1"></div>
                                                </h5>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {data.items.map(platillo => {
                                                        const isSelected = reservationForm.platillos_seleccionados.includes(platillo.id);
                                                        return (
                                                            <div 
                                                                key={platillo.id}
                                                                onClick={() => togglePlatillo(platillo.id)}
                                                                className={`flex justify-between items-center p-4 rounded-2xl cursor-pointer transition-all border-2 ${isSelected ? 'border-black bg-black text-white' : 'border-gray-50 bg-white hover:border-gray-200'}`}
                                                            >
                                                                <span className="text-xs uppercase tracking-widest font-bold">{platillo.nombre}</span>
                                                                {isSelected && <Check size={14} />}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SERVICIOS ADICIONALES */}
                            <div className="space-y-10">
                                <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                                    <h4 className="flex items-center gap-3 text-xl font-serif italic"><Shield size={20} className="text-gray-300"/> Servicios Luxury</h4>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Complementos</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                    {adicionales.map(s => {
                                        const isSelected = reservationForm.servicios_adicionales.includes(s.id);
                                        return (
                                            <div
                                                key={s.id}
                                                onClick={() => toggleService(s.id)}
                                                className={`p-5 rounded-2xl cursor-pointer transition-all border-2 flex justify-between items-center ${isSelected ? 'border-black bg-white shadow-xl px-7' : 'border-gray-50 bg-white hover:border-black/5'}`}
                                            >
                                                <div className="space-y-1">
                                                    <span className="text-[8px] uppercase tracking-widest font-black block">{s.name}</span>
                                                    <span className="text-gray-400 text-[10px]">$ {Number(s.price).toLocaleString()}</span>
                                                </div>
                                                {isSelected && <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center"><Check size={10} className="text-white"/></div>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* SUBMIT */}
                        <div className="pt-10 flex flex-col items-center gap-10">
                            {selectedPackage?.incluye_menu && reservationForm.platillos_seleccionados?.length < selectedPackage.numero_tiempos && (
                                <div className="flex items-center gap-3 text-red-500 bg-red-50 px-8 py-3 rounded-full border border-red-100 animate-pulse">
                                    <X size={16}/>
                                    <span className="text-[10px] uppercase tracking-widest font-black">Pendiente: Selecciones Gourmet ({selectedPackage.numero_tiempos} requeridos)</span>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={selectedPackage?.incluye_menu && reservationForm.platillos_seleccionados?.length < selectedPackage.numero_tiempos}
                                className={`w-full py-10 text-[12px] uppercase tracking-[0.8em] font-black shadow-3xl transition-all rounded-full ${
                                    selectedPackage?.incluye_menu && reservationForm.platillos_seleccionados?.length < selectedPackage.numero_tiempos
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                    : 'bg-black text-white hover:scale-[1.02] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)]'
                                }`}
                            >
                                Registrar Evento en Calendario
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ReservationModal;
