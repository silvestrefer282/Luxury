import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Image as ImageIcon } from 'lucide-react';

const PackageModal = ({ 
    isOpen, 
    onClose, 
    isAdding, 
    editingPackage, 
    packageForm, 
    handlePackageFormChange, 
    coverPreview, 
    setCoverPreview, 
    setCoverFile, 
    galleryPreviews, 
    setGalleryPreviews,
    handleCreatePackage,
    handleUpdatePackage
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
                    className="m-auto bg-white max-w-4xl w-full p-12 md:p-20 relative shadow-2xl h-fit border border-black/5"
                >
                    <button onClick={onClose} className="absolute top-8 right-8 opacity-40 hover:opacity-100 transition-opacity">
                        <X size={30} />
                    </button>

                    <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-black/40 block mb-6 px-1 border-l-2 border-luxury-black">
                        {isAdding ? 'Archivo Maestro: Nuevo Registro' : 'Archivo Maestro: Modificación'}
                    </span>
                    <h2 className="text-5xl font-serif uppercase tracking-tight mb-16">
                        {isAdding ? 'Definir' : 'Ajustar'} <span className="italic font-light">{isAdding ? 'Nuevo Paquete' : editingPackage.name}</span>
                    </h2>

                    <form onSubmit={isAdding ? handleCreatePackage : handleUpdatePackage} className="space-y-12">
                        {/* Form contents from original file lines 910-1076 */}
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Nombre de la Pieza</label>
                            <input 
                                name="name" 
                                required
                                value={packageForm.name} 
                                onChange={handlePackageFormChange}
                                className="w-full border-b border-black/10 py-4 px-2 focus:border-black outline-none font-serif text-3xl transition-all" 
                                placeholder="Ej. Imperial Gold Edition"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Inversión Base ($)</label>
                                <input 
                                    name="price" 
                                    type="number" 
                                    min="0"
                                    required
                                    value={packageForm.price} 
                                    onChange={handlePackageFormChange}
                                    className="w-full border-b border-black/10 py-4 px-2 focus:border-black outline-none text-2xl font-light transition-all" 
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Capacidad (Pax)</label>
                                <input 
                                    name="capacity" 
                                    type="number" 
                                    min="0"
                                    required
                                    value={packageForm.capacity} 
                                    onChange={handlePackageFormChange}
                                    className="w-full border-b border-black/10 py-4 px-2 focus:border-black outline-none text-2xl font-light transition-all" 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Duración (Horas)</label>
                                <input 
                                    name="duration" 
                                    type="number" 
                                    min="0"
                                    required
                                    value={packageForm.duration} 
                                    onChange={handlePackageFormChange}
                                    className="w-full border-b border-black/10 py-4 px-2 focus:border-black outline-none text-xl font-light transition-all" 
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Hora Extra ($)</label>
                                <input 
                                    name="extraHourPrice" 
                                    type="number" 
                                    min="0"
                                    required
                                    value={packageForm.extraHourPrice} 
                                    onChange={handlePackageFormChange}
                                    className="w-full border-b border-black/10 py-4 px-2 focus:border-black outline-none text-xl font-light transition-all" 
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Imagen de Portada (Catálogo)</label>
                            <div className="flex items-center gap-8 p-10 border border-dashed border-luxury-black/10 rounded-xl bg-black/[0.01]">
                                <div className="w-32 h-32 bg-white border border-black/5 overflow-hidden flex-shrink-0 relative group">
                                    {coverPreview ? (
                                        <img src={coverPreview} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-black/5">
                                            <ImageIcon size={24} className="opacity-20" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input 
                                        type="file" 
                                        name="coverFile"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setCoverFile(file);
                                                setCoverPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                        className="text-[10px] uppercase tracking-widest font-bold"
                                    />
                                    <p className="mt-3 text-[9px] text-black/30 font-bold uppercase tracking-widest">Dimensiones sugeridas: 1200x1600px</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Galería de Evidencia (Carousel)</label>
                            <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mb-4">
                                {galleryPreviews.map((p, idx) => (
                                    <div key={`new-${idx}`} className="aspect-square bg-black/5 border border-black/20 overflow-hidden relative group">
                                        <img src={p.url} alt={`New Gallery ${idx}`} className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => setGalleryPreviews(galleryPreviews.filter((_, i) => i !== idx))}
                                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} className="text-white" />
                                        </button>
                                        <div className="absolute top-1 right-1 bg-black text-white text-[7px] uppercase p-1 font-bold shadow-xl">Nuevo</div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-4 items-center border-b border-black/10 py-2">
                                <input 
                                    type="file" 
                                    name="galleryFiles"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files);
                                        const newPreviews = files.map(file => ({
                                            file: file,
                                            url: URL.createObjectURL(file)
                                        }));
                                        setGalleryPreviews([...galleryPreviews, ...newPreviews]);
                                        e.target.value = '';
                                    }}
                                    className="text-[10px] uppercase tracking-widest font-bold w-full cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Servicios Incluidos</label>
                            <textarea 
                                name="includedServices" 
                                rows="3"
                                value={packageForm.includedServices} 
                                onChange={handlePackageFormChange}
                                className="w-full border border-black/10 p-4 focus:border-black outline-none font-serif text-lg transition-all resize-none" 
                                placeholder="Ej. Meseros, Loza, Mantelería..."
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Notas Internas</label>
                            <textarea 
                                name="notes" 
                                rows="2"
                                value={packageForm.notes} 
                                onChange={handlePackageFormChange}
                                className="w-full border border-black/10 p-4 focus:border-black outline-none font-serif text-lg transition-all italic resize-none" 
                                placeholder="Observaciones adicionales..."
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Descripción Editorial (Catálogo)</label>
                            <textarea 
                                name="description" 
                                rows="2"
                                value={packageForm.description} 
                                onChange={handlePackageFormChange}
                                className="w-full border border-black/10 p-4 focus:border-black outline-none font-serif text-lg transition-all italic resize-none" 
                                placeholder="Breve reseña poética para el catálogo de lujo..."
                            />
                        </div>

                        <div className="pt-10">
                            <button type="submit" className="w-full bg-luxury-black text-white py-6 text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-luxury-gray-dark shadow-2xl transition-all">
                                {isAdding ? 'Añadir Paquete' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PackageModal;
