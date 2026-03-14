import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ReservationModal = ({
    isOpen,
    onClose,
    clients,
    packages,
    reservationForm,
    setReservationForm,
    handleCreateReservation
}) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[5000] bg-luxury-black/95 backdrop-blur-xl overflow-y-auto flex p-4 sm:p-10"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
                    className="m-auto bg-white max-w-4xl w-full p-12 md:p-20 relative shadow-2xl border border-white/10 rounded-3xl"
                >
                    <button onClick={onClose} className="absolute top-8 right-8 text-luxury-gray-mid hover:text-black transition-all">
                        <X size={32} />
                    </button>

                    <div className="border-b-4 border-luxury-black pb-10 mb-20">
                        <span className="text-[10px] uppercase tracking-[0.6em] font-bold text-luxury-gray-mid block mb-4">Registro Manual</span>
                        <h2 className="text-6xl font-serif uppercase tracking-tight text-luxury-black">Nueva <span className="italic font-light">Reservación</span></h2>
                    </div>

                    <form onSubmit={handleCreateReservation} className="grid grid-cols-2 gap-16">
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gray-mid italic">Seleccionar Cliente</label>
                                <select 
                                    required
                                    value={reservationForm.cliente}
                                    onChange={(e) => setReservationForm({...reservationForm, cliente: e.target.value})}
                                    className="w-full border-b border-black/10 py-4 font-serif text-xl outline-none focus:border-black bg-transparent"
                                >
                                    <option value="">-- Elija un cliente --</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gray-mid italic">Paquete Editorial</label>
                                <select 
                                    required
                                    value={reservationForm.paquete}
                                    onChange={(e) => setReservationForm({...reservationForm, paquete: e.target.value})}
                                    className="w-full border-b border-black/10 py-4 font-serif text-xl outline-none focus:border-black bg-transparent"
                                >
                                    <option value="">-- Seleccione paquete --</option>
                                    {packages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gray-mid italic">Fecha del Evento</label>
                                <input 
                                    type="date"
                                    required
                                    value={reservationForm.fecha_evento}
                                    onChange={(e) => setReservationForm({...reservationForm, fecha_evento: e.target.value})}
                                    className="w-full border-b border-black/10 py-4 font-serif text-xl outline-none focus:border-black"
                                />
                            </div>
                        </div>

                        <div className="space-y-12">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gray-mid italic">Hora Inicio</label>
                                    <input 
                                        type="time"
                                        value={reservationForm.hora_inicio}
                                        onChange={(e) => setReservationForm({...reservationForm, hora_inicio: e.target.value})}
                                        className="w-full border-b border-black/10 py-4 font-serif text-xl outline-none focus:border-black"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gray-mid italic">Hora Fin</label>
                                    <input 
                                        type="time"
                                        value={reservationForm.hora_fin}
                                        onChange={(e) => setReservationForm({...reservationForm, hora_fin: e.target.value})}
                                        className="w-full border-b border-black/10 py-4 font-serif text-xl outline-none focus:border-black"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gray-mid italic">Cantidad de Invitados</label>
                                <input 
                                    type="number"
                                    min="0"
                                    value={reservationForm.num_personas}
                                    onChange={(e) => setReservationForm({...reservationForm, num_personas: e.target.value})}
                                    className="w-full border-b border-black/10 py-4 font-serif text-xl outline-none focus:border-black"
                                />
                            </div>

                            <button type="submit" className="w-full py-10 bg-luxury-black text-white text-[12px] uppercase tracking-[0.4em] font-black shadow-3xl hover:bg-luxury-gray-dark transition-all mt-10 rounded-2xl">
                                Confirmar Reserva Maestra
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ReservationModal;
