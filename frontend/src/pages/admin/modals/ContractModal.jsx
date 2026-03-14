import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ContractModal = ({
    isOpen,
    onClose,
    selectedReservation,
    contractForm,
    setContractForm,
    handleCreateContract
}) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[5000] bg-black/95 overflow-y-auto flex p-4 sm:p-10"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
                    className="m-auto bg-white max-w-5xl w-full p-12 md:p-20 relative shadow-2xl rounded-3xl"
                >
                    <button onClick={onClose} className="absolute top-8 right-8 text-luxury-gray-mid hover:text-black transition-all">
                        <X size={32} />
                    </button>

                    <div className="flex justify-between items-end border-b-4 border-luxury-black pb-12 mb-20">
                        <div>
                            <span className="text-[12px] uppercase tracking-[0.8em] font-bold text-luxury-gray-mid block mb-6 px-1 border-l-4 border-luxury-black">Legal & Compliance</span>
                            <h2 className="text-6xl font-serif uppercase tracking-tight text-luxury-black">Digitalizar <span className="italic font-light">Contrato</span></h2>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-gray-mid">Folio Reservado</p>
                            <p className="text-4xl font-serif text-luxury-black italic">{contractForm.folio}</p>
                        </div>
                    </div>

                    <form onSubmit={handleCreateContract} className="grid grid-cols-2 gap-20">
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <label className="text-[11px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid italic block">Folio del Documento</label>
                                <input value={contractForm.folio} readOnly className="w-full border-b border-black/10 py-4 font-serif text-2xl text-luxury-gray-mid outline-none" />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[11px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid italic block">Representante Legal (Sirlux)</label>
                                <input 
                                    value={contractForm.representante_salon} 
                                    onChange={(e) => setContractForm({...contractForm, representante_salon: e.target.value})}
                                    className="w-full border-b border-black/10 py-4 font-serif text-2xl outline-none focus:border-black"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[11px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid italic block">Dirección del Inmueble</label>
                                <input 
                                    value={contractForm.lugar_evento} 
                                    onChange={(e) => setContractForm({...contractForm, lugar_evento: e.target.value})}
                                    className="w-full border-b border-black/10 py-4 font-serif text-xl outline-none focus:border-black"
                                />
                            </div>
                        </div>

                        <div className="space-y-12 bg-black/[0.02] p-12 rounded-3xl border border-black/5">
                            <div className="grid grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gray-mid block">Aforo Pack</label>
                                    <input value={contractForm.cantidad_personas} readOnly className="w-full border-b border-black/10 py-4 font-serif text-2xl text-luxury-gray-mid bg-transparent" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gray-mid block">Inversión Pactada</label>
                                    <input value={`$${contractForm.total_operacion.toLocaleString()}`} readOnly className="w-full border-b border-black/10 py-4 font-serif text-2xl text-luxury-black font-bold bg-transparent" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gray-mid block underline decoration-luxury-black/20 decoration-2 underline-offset-8">Garantía ($)</label>
                                    <input 
                                        type="number"
                                        min="0"
                                        value={contractForm.deposito_garantia} 
                                        onChange={(e) => setContractForm({...contractForm, deposito_garantia: e.target.value})}
                                        className="w-full border-b border-black/10 py-4 font-serif text-2xl outline-none focus:border-black bg-transparent"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-gray-mid block">Fecha Límite Liquidación</label>
                                    <input 
                                        type="date"
                                        required
                                        value={contractForm.fecha_limite_pago} 
                                        onChange={(e) => setContractForm({...contractForm, fecha_limite_pago: e.target.value})}
                                        className="w-full border-b border-black/10 py-4 font-serif text-xl outline-none focus:border-black bg-transparent"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full py-10 bg-luxury-black text-white text-[12px] uppercase tracking-[0.5em] font-black shadow-3xl hover:bg-luxury-gray-dark transition-all rounded-2xl">
                                Formalizar Acuerdo Digital
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ContractModal;
