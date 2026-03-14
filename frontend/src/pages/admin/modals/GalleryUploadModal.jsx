import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon } from 'lucide-react';

const GalleryUploadModal = ({ 
    isOpen, 
    onClose, 
    handleCreateGallery 
}) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[3000] bg-black/95 flex items-center justify-center p-10"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                    className="bg-white max-w-2xl w-full p-20 relative shadow-2xl"
                >
                    <button onClick={onClose} className="absolute top-10 right-10 opacity-40 hover:opacity-100 transition-opacity">
                        <X size={30} />
                    </button>

                    <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-black/40 block mb-6 px-1 border-l-2 border-luxury-black">Expediente Visual</span>
                    <h2 className="text-5xl font-serif uppercase tracking-tight mb-16">Cargar <span className="italic font-light">Nueva Evidencia</span></h2>

                    <form onSubmit={handleCreateGallery} className="space-y-12">
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Título de la Obra</label>
                            <input name="titulo" required className="w-full border-b border-black/10 py-4 px-2 focus:border-black outline-none font-serif text-2xl transition-all" placeholder="Ej. Gala Imperial Autumn 24" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Categoría Editorial</label>
                            <select name="categoria" required className="w-full border-b border-black/10 py-4 px-2 focus:border-black outline-none text-xl font-light transition-all bg-transparent">
                                <option value="Montaje">Montaje</option>
                                <option value="Gastronomía">Gastronomía</option>
                                <option value="Retrato">Retrato</option>
                                <option value="Arquitectura">Arquitectura</option>
                            </select>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Archivo de Imagen</label>
                            <div className="flex items-center gap-8 p-10 border border-dashed border-luxury-black/10 rounded-xl bg-black/[0.01]">
                                <ImageIcon className="text-luxury-black opacity-20" size={30} />
                                <input type="file" name="imagen" required className="text-[10px] uppercase tracking-widest font-bold" />
                            </div>
                        </div>
                        <div className="pt-8">
                            <button type="submit" className="w-full bg-luxury-black text-white py-6 text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-luxury-gray-dark shadow-2xl transition-all">
                                Procesar Carga
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default GalleryUploadModal;
