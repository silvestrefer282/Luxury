import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Package, Clock, Star, MessageSquare, ChevronRight, CheckCircle2, AlertCircle, X, Users, DollarSign, Utensils, Info } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { reservacionService, testimonioService } from '../services/api';

const MisReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedReserva, setSelectedReserva] = useState(null);
    const [reviewForm, setReviewForm] = useState({
        calificacion: 5,
        comentario: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [reservaToCancel, setReservaToCancel] = useState(null);
    const [canceling, setCanceling] = useState(false);

    const handleOpenDetails = (reserva) => {
        setSelectedReserva(reserva);
        setIsDetailsModalOpen(true);
    };

    const handleOpenCancel = (reserva) => {
        setReservaToCancel(reserva);
        setIsCancelModalOpen(true);
    };

    const handleConfirmCancel = async () => {
        try {
            setCanceling(true);
            await reservacionService.cancelar(reservaToCancel.id);
            setIsCancelModalOpen(false);
            setReservaToCancel(null);
            fetchData();
        } catch (error) {
            console.error("Error canceling:", error);
            alert(error.response?.data?.error || "Ocurrió un error al intentar cancelar.");
        } finally {
            setCanceling(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const resReservas = await reservacionService.getAll({ personal: 'true' });
            setReservas(resReservas.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenReview = (reserva) => {
        setSelectedReserva(reserva);
        setReviewForm({ calificacion: 5, comentario: '' });
        setIsReviewModalOpen(true);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await testimonioService.create({
                reservacion: selectedReserva.id,
                calificacion: reviewForm.calificacion,
                comentario: reviewForm.comentario
            });
            setIsReviewModalOpen(false);
            fetchData(); // Recargar para actualizar estado
        } catch (error) {
            console.error("Error creating review:", error, error.response?.data);
            let alertMsg = "No se pudo enviar el comentario. Intente de nuevo.";
            if (error.response?.data?.reservacion) {
                alertMsg = "Ya ha enviado una calificación para este evento anteriormente.";
            } else if (error.response?.data?.[0]) {
                alertMsg = error.response.data[0];
            }
            alert(alertMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            
            <div className="pt-40 pb-20">
                <div className="max-w-[1200px] mx-auto px-6">
                    <header className="mb-20">
                        <span className="text-[10px] uppercase tracking-[0.5em] font-black text-black/30 block mb-4">Experiencias Luxury</span>
                        <h1 className="text-6xl font-serif text-black leading-tight">
                            Mis <span className="italic font-light">Reservas</span>
                        </h1>
                    </header>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : reservas.length === 0 ? (
                        <div className="bg-black/5 rounded-[3rem] p-20 text-center">
                            <AlertCircle className="mx-auto mb-6 opacity-20" size={48} />
                            <p className="text-xl font-serif italic text-black/40">Aún no tienes reservaciones registradas.</p>
                        </div>
                    ) : (
                        <div className="grid gap-8">
                            {reservas.map((reserva, idx) => {
                                const isFinalizada = reserva.estado === 'Finalizada';
                                const hasReview = reserva.has_testimonio;
                                
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group relative bg-white border border-black/5 rounded-[2.5rem] p-10 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden"
                                    >
                                        <div className="flex flex-col lg:flex-row gap-12 items-center">
                                            {/* Info Principal */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-black ${
                                                        reserva.estado === 'Finalizada' ? 'bg-green-50 text-green-600' :
                                                        reserva.estado === 'Confirmada' ? 'bg-blue-50 text-blue-600' :
                                                        reserva.estado === 'Cancelada' ? 'bg-red-50 text-red-600' :
                                                        'bg-black/5 text-black/40'
                                                    }`}>
                                                        {reserva.estado}
                                                    </span>
                                                    <span className="text-[9px] uppercase tracking-widest font-bold text-black/20">#{reserva.id.toString().padStart(4, '0')}</span>
                                                </div>

                                                <h3 className="text-3xl font-serif text-black mb-8">{reserva.paquete_nombre}</h3>

                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center text-black">
                                                            <Calendar size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] uppercase tracking-widest text-black/40 font-bold mb-0.5">Fecha</p>
                                                            <p className="text-xs font-black text-black">{reserva.fecha_evento}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center text-black">
                                                            <Clock size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] uppercase tracking-widest text-black/40 font-bold mb-0.5">Horario</p>
                                                            <p className="text-xs font-black text-black">{reserva.hora_inicio} - {reserva.hora_fin}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Acción */}
                                            <div className="w-full lg:w-72 lg:border-l lg:border-black/5 lg:pl-12 flex flex-col justify-center gap-3">
                                                <button 
                                                    onClick={() => handleOpenDetails(reserva)}
                                                    className="w-full py-4 bg-black/5 text-black text-[10px] uppercase tracking-[0.3em] font-black rounded-2xl hover:bg-black/10 transition-all border border-black/10 flex items-center justify-center gap-2"
                                                >
                                                    <Info size={14} />
                                                    Ver Detalles
                                                </button>
                                                {isFinalizada ? (
                                                    hasReview ? (
                                                        <div className="flex flex-col items-center text-center gap-2">
                                                            <CheckCircle2 className="text-green-500 mb-2" size={32} />
                                                            <p className="text-[10px] uppercase tracking-widest font-black text-black">Calificado</p>
                                                            <p className="text-[10px] italic text-black/40">¡Gracias por tu opinión!</p>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleOpenReview(reserva)}
                                                            className="w-full py-5 bg-black text-white text-[10px] uppercase tracking-[0.3em] font-black rounded-2xl hover:bg-black/80 transition-all shadow-xl group/btn"
                                                        >
                                                            Calificar Servicio
                                                        </button>
                                                    )
                                                ) : reserva.estado === 'Cancelada' ? (
                                                    <div className="text-center p-6 bg-red-50 rounded-2xl border border-dashed border-red-200">
                                                        <p className="text-[10px] uppercase tracking-widest font-bold text-red-600">Evento Cancelado</p>
                                                    </div>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleOpenCancel(reserva)}
                                                        className="w-full py-4 bg-white text-red-600 border border-red-200 text-[10px] uppercase tracking-[0.3em] font-black rounded-2xl hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <X size={14} />
                                                        Cancelar Reserva
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {isDetailsModalOpen && selectedReserva && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsDetailsModalOpen(false)}
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh]"
                        >
                            <button 
                                onClick={() => setIsDetailsModalOpen(false)}
                                className="absolute top-6 right-6 lg:top-8 lg:right-8 text-black/20 hover:text-black transition-colors bg-black/5 hover:bg-black/10 p-2 rounded-full"
                            >
                                <X size={20} />
                            </button>

                            <header className="mb-8 border-b border-black/5 pb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className={`px-3 py-1 rounded-full text-[8.5px] uppercase tracking-widest font-black ${
                                        selectedReserva.estado === 'Finalizada' ? 'bg-green-50 text-green-600' :
                                        selectedReserva.estado === 'Confirmada' ? 'bg-blue-50 text-blue-600' :
                                        selectedReserva.estado === 'Cancelada' ? 'bg-red-50 text-red-600' :
                                        'bg-black/5 text-black/60'
                                    }`}>
                                        {selectedReserva.estado}
                                    </span>
                                    <span className="text-[9px] uppercase tracking-widest font-bold text-black/30">FOLIO #{selectedReserva.id.toString().padStart(4, '0')}</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-serif text-black">{selectedReserva.paquete_nombre}</h2>
                                <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-black/40 mt-2">{selectedReserva.tipo_evento} • {selectedReserva.nombre_festejado}</p>
                            </header>

                            <div className="space-y-8">
                                {/* Grid de Info Principal */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-black/5 p-4 md:p-5 rounded-2xl flex items-start gap-3 flex-col sm:flex-row sm:items-center">
                                        <Calendar className="text-black/40" size={18} />
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-black/40 font-bold mb-1">Fecha</p>
                                            <p className="text-sm font-black text-black">{selectedReserva.fecha_evento}</p>
                                        </div>
                                    </div>
                                    <div className="bg-black/5 p-4 md:p-5 rounded-2xl flex items-start gap-3 flex-col sm:flex-row sm:items-center">
                                        <Clock className="text-black/40" size={18} />
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-black/40 font-bold mb-1">Horario</p>
                                            <p className="text-sm font-black text-black">{selectedReserva.hora_inicio} a {selectedReserva.hora_fin}</p>
                                            {selectedReserva.horas_adicionales > 0 && (
                                                <p className="text-[10px] text-black/50 mt-1 font-bold">+{selectedReserva.horas_adicionales} hrs extra</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-black/5 p-4 md:p-5 rounded-2xl flex items-start gap-3 flex-col sm:flex-row sm:items-center">
                                        <Users className="text-black/40" size={18} />
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-black/40 font-bold mb-1">Invitados</p>
                                            <p className="text-sm font-black text-black">{selectedReserva.num_personas} Pax</p>
                                        </div>
                                    </div>
                                    <div className="bg-black/5 p-4 md:p-5 rounded-2xl flex items-start gap-3 flex-col sm:flex-row sm:items-center">
                                        <DollarSign className="text-black/40" size={18} />
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-black/40 font-bold mb-1">Inversión Estimada</p>
                                            <p className="text-sm font-black text-black">${Number(selectedReserva.total_estimado).toLocaleString()} MXN</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Menú y Servicios */}
                                {(selectedReserva.platillos_detalle?.length > 0 || selectedReserva.servicios_detalle?.length > 0) && (
                                    <div className="border border-black/5 rounded-3xl p-6 md:p-8 space-y-6">
                                        {selectedReserva.platillos_detalle?.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Utensils size={16} className="text-black/40" />
                                                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black">Menú Seleccionado</h4>
                                                </div>
                                                <ul className="space-y-3">
                                                    {selectedReserva.platillos_detalle.map(p => (
                                                        <li key={p.id} className="flex items-center justify-between text-sm">
                                                            <span className="font-bold text-black/80">{p.nombre}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        {selectedReserva.platillos_detalle?.length > 0 && selectedReserva.servicios_detalle?.length > 0 && (
                                            <hr className="border-black/5" />
                                        )}

                                        {selectedReserva.servicios_detalle?.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Package size={16} className="text-black/40" />
                                                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black">Servicios Extra</h4>
                                                </div>
                                                <ul className="space-y-3">
                                                    {selectedReserva.servicios_detalle.map(s => (
                                                        <li key={s.id} className="flex items-center justify-between text-sm">
                                                            <span className="font-bold text-black/80">{s.nombre}</span>
                                                            <span className="text-black/40 font-medium">${Number(s.precio_unitario).toLocaleString()}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Datos de Contacto */}
                                <div className="bg-gray-50 rounded-3xl p-6 md:p-8 mt-6 border border-black/[0.03]">
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-black mb-4">Logística y Contacto</h4>
                                    <div className="space-y-3 text-sm text-black/80">
                                        <div className="flex justify-between items-center border-b border-black/5 pb-2">
                                            <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Titular</span>
                                            <span className="font-medium text-right">{selectedReserva.cliente_nombre || '-'}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-black/5 pb-2">
                                            <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Festejado</span>
                                            <span className="font-medium text-right">{selectedReserva.nombre_festejado}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-black/5 pb-2">
                                            <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Teléfono/s</span>
                                            <span className="font-medium text-right">{selectedReserva.telefono_contacto || selectedReserva.cliente_telefono}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 border-b border-black/5 pb-2">
                                            <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold">Domicilio de Contrato</span>
                                            <span className="font-medium leading-relaxed">{selectedReserva.domicilio_contacto}</span>
                                        </div>
                                    </div>
                                    
                                    {selectedReserva.observaciones && (
                                        <div className="mt-6 pt-2">
                                            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-black/40 mb-2">Notas Especiales / Políticas</p>
                                            <p className="text-sm font-medium text-black/80 italic leading-relaxed bg-white border border-black/5 p-4 rounded-xl">{selectedReserva.observaciones}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Cancel Modal */}
            <AnimatePresence>
                {isCancelModalOpen && reservaToCancel && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => !canceling && setIsCancelModalOpen(false)}
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                                    <AlertCircle size={32} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-serif text-center mb-4 text-black">¿Cancelar Reservación?</h3>
                            
                            <div className="bg-gray-50 border border-black/5 rounded-2xl p-6 text-xs text-black/70 mb-8 space-y-4">
                                <p className="font-bold uppercase tracking-widest text-[10px] text-red-600 mb-2">Políticas de Cancelación:</p>
                                <ul className="list-disc pl-4 space-y-2">
                                    <li>En caso de cancelación <strong>no hay reembolso de los $1000</strong> que dejó como apartado y depósito de su evento.</li>
                                    <li>Si cancela a los <strong>2 meses</strong> de la fecha de su evento, se le retendrán <strong>$2000 mil pesos ADICIONAL AL DEPÓSITO</strong>.</li>
                                    <li>Si cancela al <strong>mes o menos</strong> de la fecha de su evento, se le retendrán <strong>$4000 mil pesos ADICIONAL AL DEPÓSITO</strong>.</li>
                                </ul>
                            </div>

                            <p className="text-sm font-medium text-center text-black/60 mb-8">Esta acción es irreversible y aplicará las retenciones que correspondan según la fecha del evento ({reservaToCancel.fecha_evento}).</p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => setIsCancelModalOpen(false)}
                                    disabled={canceling}
                                    className="flex-1 py-4 bg-black/5 text-black text-[10px] uppercase tracking-[0.3em] font-black rounded-2xl hover:bg-black/10 transition-all font-sans"
                                >
                                    No, Volver
                                </button>
                                <button
                                    onClick={handleConfirmCancel}
                                    disabled={canceling}
                                    className="flex-1 py-4 bg-red-600 text-white text-[10px] uppercase tracking-[0.3em] font-black rounded-2xl hover:bg-red-700 transition-all flex items-center justify-center font-sans"
                                >
                                    {canceling ? 'Cancelando...' : 'Sí, Cancelar'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Review Modal */}
            <AnimatePresence>
                {isReviewModalOpen && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => !submitting && setIsReviewModalOpen(false)}
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-xl bg-white rounded-[3rem] p-12 shadow-2xl overflow-hidden"
                        >
                            <button 
                                onClick={() => setIsReviewModalOpen(false)}
                                className="absolute top-8 right-8 text-black/20 hover:text-black transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <header className="mb-10">
                                <span className="text-[9px] uppercase tracking-[0.4em] font-black text-black/40 block mb-3">Feedback de Invitado</span>
                                <h2 className="text-4xl font-serif text-black italic">Tu Experiencia</h2>
                                <p className="text-xs text-black/50 mt-4 leading-relaxed font-medium">Cuéntanos qué te pareció el servicio en tu evento: <span className="text-black font-bold font-sans uppercase text-[10px] tracking-widest ml-1">{selectedReserva?.paquete_nombre}</span></p>
                            </header>

                            <form onSubmit={handleSubmitReview} className="space-y-8">
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-black/40 block mb-6">Calificación General</label>
                                    <div className="flex gap-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewForm(prev => ({ ...prev, calificacion: star }))}
                                                className="transition-transform active:scale-95 group"
                                            >
                                                <Star 
                                                    size={32} 
                                                    className={`${star <= reviewForm.calificacion ? 'text-black fill-black' : 'text-black/10'}`} 
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-black/40 block mb-4">Comentarios</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={reviewForm.comentario}
                                        onChange={(e) => setReviewForm(prev => ({ ...prev, comentario: e.target.value }))}
                                        placeholder="Escribe tu opinión aquí..."
                                        className="w-full bg-black/5 rounded-2xl p-6 text-sm font-medium text-black placeholder:text-black/20 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all outline-none resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-6 bg-black text-white text-[11px] uppercase tracking-[0.4em] font-black shadow-2xl hover:bg-black/90 transition-all rounded-2xl disabled:opacity-50 flex items-center justify-center gap-4"
                                >
                                    {submitting ? 'Enviando...' : 'Enviar Calificación'}
                                    {!submitting && <ChevronRight size={18} />}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default MisReservas;
