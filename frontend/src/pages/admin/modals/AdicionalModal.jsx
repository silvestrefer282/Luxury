import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon } from 'lucide-react';

const AdicionalModal = ({
    isOpen,
    onClose,
    isAdding,
    editingAdicional,
    adicionalForm,
    handleAdicionalFormChange,
    handleCreateAdicional,
    handleUpdateAdicional
}) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[3000] bg-black/95 overflow-y-auto flex p-4 sm:p-10"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                    className="m-auto bg-white max-w-2xl w-full p-12 md:p-20 relative shadow-2xl h-fit border border-black/5"
                >
                    <button onClick={onClose} className="absolute top-8 right-8 opacity-40 hover:opacity-100 transition-opacity">
                        <X size={30} />
                    </button>

                    <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-black/40 block mb-6 px-1 border-l-2 border-luxury-black">
                        {isAdding ? 'Nuevo Registro' : 'Modificación de Propuesta'}
                    </span>
                    <h2 className="text-5xl font-serif uppercase tracking-tight mb-16">
                        {isAdding ? 'Definir' : 'Ajustar'} <span className="italic font-light">{isAdding ? 'Adicional' : editingAdicional.name}</span>
                    </h2>

                    <form onSubmit={isAdding ? handleCreateAdicional : handleUpdateAdicional} className="space-y-12">
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
                        <div className="h-px bg-black/5 w-full"></div>
                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Inversión ($)</label>
                                <input 
                                    name="price" 
                                    type="number" 
                                    min="0"
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
                        <div className="h-px bg-black/5 w-full"></div>
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Descripción del Servicio</label>
                            <textarea 
                                name="description" 
                                rows="3"
                                value={adicionalForm.description}
                                onChange={handleAdicionalFormChange}
                                className="w-full border border-black/10 p-4 focus:border-black outline-none font-serif text-lg transition-all italic resize-none" 
                                placeholder="Describa brevemente el servicio y lo que incluye..."
                            />
                        </div>
                        <div className="h-px bg-black/5 w-full"></div>
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Imagen Representativa</label>
                            <div className="flex items-center gap-8 p-10 border border-dashed border-luxury-black/10 rounded-xl hover:border-luxury-black transition-all bg-black/[0.01]">
                                <div className="w-20 h-20 bg-white flex items-center justify-center rounded-full border border-luxury-black/5 shadow-sm">
                                    <ImageIcon className="text-luxury-black/20" size={32} />
                                </div>
                                <div className="flex-1">
                                    <input 
                                        type="file" 
                                        name="imagen"
                                        className="text-[10px] uppercase tracking-widest font-bold cursor-pointer"
                                    />
                                    <p className="mt-3 text-[9px] text-black/30 font-bold uppercase tracking-widest">Formato: JPG, PNG o WEBP (Máx. 5MB)</p>
                                </div>
                            </div>
                        </div>
                        <div className="h-px bg-black/5 w-full"></div>
                        <div className="pt-8">
                            <button type="submit" className="w-full bg-luxury-black text-white py-6 text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-luxury-gray-dark shadow-2xl transition-all">
                                {isAdding ? 'Añadir Servicio' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AdicionalModal;
