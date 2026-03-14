import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, ArrowRight } from 'lucide-react';

const PaymentModal = ({
    isOpen,
    onClose,
    contract,
    handleCreatePayment
}) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[5000] bg-black/98 backdrop-blur-2xl overflow-y-auto flex p-4 sm:p-10"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
                    className="m-auto bg-white max-w-7xl w-full p-12 md:p-16 relative shadow-2xl flex flex-col lg:flex-row gap-10 lg:gap-20 rounded-[3rem] border border-black/5"
                >
                    <button onClick={onClose} className="absolute top-12 right-12 text-luxury-gray-mid hover:text-black transition-all z-50">
                        <X size={32} />
                    </button>

                    <div className="lg:w-1/2 space-y-16">
                        <div>
                            <span className="text-[12px] uppercase tracking-[0.8em] font-bold text-luxury-gray-mid block mb-6 px-1 border-l-4 border-luxury-black">Master Ledger</span>
                            <h2 className="text-6xl font-serif uppercase tracking-tight text-luxury-black mb-10">Estado de <span className="italic font-light">Cuenta</span></h2>
                        </div>

                        <div className="grid grid-cols-2 gap-10">
                            <div className="bg-black text-white p-12 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                                <Wallet size={100} className="absolute -bottom-8 -right-8 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
                                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 mb-4">Inversión Total</p>
                                <p className="text-5xl font-serif tracking-tighter">${Number(contract.total).toLocaleString()}</p>
                            </div>
                            <div className="bg-red-600 text-white p-12 rounded-[2rem] shadow-2xl relative overflow-hidden group">
                                <ArrowRight size={100} className="absolute -bottom-8 -right-8 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
                                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40 mb-4">Saldo Pendiente</p>
                                <p className="text-5xl font-serif tracking-tighter">${Number(contract.saldo_pendiente).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[13px] uppercase tracking-[0.5em] font-black text-luxury-black border-b border-black/10 pb-4">Historial Editorial de Abonos</h4>
                            <div className="max-h-72 overflow-y-auto pr-6 custom-scrollbar space-y-4">
                                {contract.pagos?.map((p, i) => (
                                    <div key={p.id} className="flex justify-between items-center group bg-black/[0.03] p-6 rounded-2xl border border-black/5 hover:border-black/20 hover:bg-black/[0.05] transition-all">
                                        <div>
                                            <p className="text-lg font-black text-luxury-black uppercase tracking-widest mb-1">{p.metodo_pago}</p>
                                            <p className="text-xs text-luxury-gray-dark font-serif italic">{new Date(p.fecha_pago).toLocaleDateString()} — Transacción #{p.id}</p>
                                        </div>
                                        <p className="text-3xl font-serif text-luxury-black group-hover:scale-105 transition-transform">${Number(p.monto).toLocaleString()}</p>
                                    </div>
                                ))}
                                {(!contract.pagos || contract.pagos.length === 0) && (
                                    <p className="text-base font-serif italic text-luxury-gray-mid py-10 opacity-50 text-center">No se registran movimientos financieros aún.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 bg-black/[0.02] p-16 rounded-[2.5rem] border border-black/5 flex flex-col justify-center">
                        <div className="mb-16">
                            <h3 className="text-4xl font-serif text-luxury-black mb-4 uppercase tracking-tighter">Registrar <span className="italic font-light">Nuevo Abono</span></h3>
                            <p className="text-sm font-serif italic text-luxury-gray-mid">Ingrese los detalles para actualizar el balance del folio {contract.folio}.</p>
                        </div>

                        <form onSubmit={handleCreatePayment} className="space-y-12">
                            <div className="space-y-6">
                                <label className="text-[11px] uppercase tracking-[0.5em] font-bold text-luxury-black block">Monto del Depósito ($)</label>
                                <input name="monto" type="number" min="0" required placeholder="0.00" className="w-full bg-transparent border-b-2 border-black/10 py-6 font-serif text-4xl text-luxury-black focus:border-black outline-none transition-all" />
                            </div>
                            <div className="space-y-6">
                                <label className="text-[11px] uppercase tracking-[0.5em] font-bold text-luxury-black block">Método de Captura</label>
                                <select name="metodo_pago" className="w-full bg-transparent border-b-2 border-black/10 py-6 font-serif text-2xl text-luxury-black outline-none focus:border-black">
                                    <option value="Transferencia">Transferencia Bancaria</option>
                                    <option value="Efectivo">Efectivo Portfolio</option>
                                    <option value="Tarjeta">Tarjeta de Crédito/Débito</option>
                                </select>
                            </div>
                            <div className="space-y-6">
                                <label className="text-[11px] uppercase tracking-[0.5em] font-bold text-luxury-black block">Notas de Auditoría</label>
                                <textarea name="notas" rows="2" className="w-full bg-transparent border-b-2 border-black/10 py-4 font-serif text-xl italic text-luxury-black outline-none focus:border-black resize-none" placeholder="Referencia bancaria, recibo físico..."></textarea>
                            </div>
                            <button type="submit" className="w-full py-10 bg-luxury-black text-white text-[13px] uppercase tracking-[0.6em] font-black shadow-3xl hover:bg-luxury-gray-dark transition-all rounded-3xl mt-10">
                                Validar y Procesar Transacción
                            </button>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PaymentModal;
