import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon } from 'lucide-react';

const GalleryEditModal = ({ 
    isOpen, 
    onClose, 
    editingGallery,
    handleUpdateGallery 
}) => {
    const [formData, setFormData] = useState({
        titulo: '',
        categoria: 'Montaje',
        descripcion: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    
    useEffect(() => {
        if (editingGallery) {
            setFormData({
                titulo: editingGallery.title || '',
                categoria: editingGallery.category || 'Montaje',
                descripcion: editingGallery.description || ''
            });
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    }, [editingGallery]);

    if (!isOpen || !editingGallery) return null;

    const onSubmit = (e) => {
        e.preventDefault();
        handleUpdateGallery(editingGallery.id, {
            ...formData,
            imagen: selectedFile
        });
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

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
                    <button type="button" onClick={onClose} className="absolute top-6 right-6 text-black/50 hover:text-black hover:bg-black/5 p-3 rounded-full transition-all">
                        <X size={24} />
                    </button>

                    <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-black/40 block mb-6 px-1 border-l-2 border-luxury-black">Expediente Visual</span>
                    <h2 className="text-5xl font-serif uppercase tracking-tight mb-16">Editar <span className="italic font-light">Evidencia</span></h2>

                    <form onSubmit={onSubmit} className="space-y-12">
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Título de la Obra</label>
                            <input 
                                name="titulo" 
                                value={formData.titulo}
                                onChange={handleChange}
                                required 
                                className="w-full border-b border-black/10 py-4 px-2 focus:border-black outline-none font-serif text-2xl transition-all" 
                                placeholder="Ej. Gala Imperial Autumn 24" 
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Categoría Editorial</label>
                            <select 
                                name="categoria" 
                                value={formData.categoria}
                                onChange={handleChange}
                                required 
                                className="w-full border-b border-black/10 py-4 px-2 focus:border-black outline-none text-xl font-light transition-all bg-transparent"
                            >
                                <option value="Montaje">Montaje</option>
                                <option value="Gastronomía">Gastronomía</option>
                                <option value="Retrato">Retrato</option>
                                <option value="Arquitectura">Arquitectura</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Descripción Detallada</label>
                            <textarea 
                                name="descripcion" 
                                value={formData.descripcion}
                                onChange={handleChange}
                                required 
                                rows="4"
                                className="w-full border-b border-black/10 py-4 px-2 focus:border-black outline-none font-light text-lg transition-all bg-transparent resize-none" 
                                placeholder="Describa los detalles exclusivos de esta captura..."
                            ></textarea>
                        </div>
                        
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Actualizar Imagen (Opcional)</label>
                            <div className="flex items-center gap-8 p-10 border border-dashed border-luxury-black/10 rounded-xl bg-black/[0.01]">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Nueva Previa" className="w-24 h-24 object-cover rounded-xl shadow-lg border-2 border-luxury-black" />
                                ) : editingGallery.url ? (
                                    <img src={editingGallery.url} alt="Previa Actual" className="w-24 h-24 object-cover rounded-xl grayscale opacity-50" />
                                ) : (
                                    <div className="w-24 h-24 bg-black/5 rounded-xl flex items-center justify-center">
                                        <ImageIcon className="text-luxury-black opacity-20" size={30} />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <input 
                                        type="file" 
                                        name="imagen" 
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setSelectedFile(file);
                                                setPreviewUrl(URL.createObjectURL(file));
                                            }
                                        }}
                                        className="text-[10px] uppercase tracking-widest font-bold w-full cursor-pointer" 
                                    />
                                    <p className="mt-3 text-[9px] text-black/30 font-bold uppercase tracking-widest">Deja vacío para conservar la imagen actual</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="pt-8 flex gap-4">
                            <button type="button" onClick={onClose} className="w-1/3 border border-luxury-black/20 text-luxury-black py-6 text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-black/5 transition-all">
                                Cancelar
                            </button>
                            <button type="submit" className="w-2/3 bg-luxury-black text-white py-6 text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-luxury-gray-dark shadow-2xl transition-all">
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default GalleryEditModal;
