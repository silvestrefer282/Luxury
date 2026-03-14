import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Image as ImageIcon } from 'lucide-react';
import { menuService } from '../../../services/api';

const MenuCategoryModal = ({
    isOpen,
    onClose,
    category,
    menus,
    fetchData,
    handleRenameCategory,
    handleRemoveItem
}) => {
    const [newItemName, setNewItemName] = useState('');
    const [newItemDesc, setNewItemDesc] = useState('');
    const [newItemFile, setNewItemFile] = useState(null);
    const [categoryDesc, setCategoryDesc] = useState(menus[category]?.descripcion || '');

    if (!isOpen) return null;

    const handleAddItem = async (catName) => {
        const catId = menus[catName]?.id;
        if (catId && newItemName) {
            const formData = new FormData();
            formData.append('categoria', catId);
            formData.append('nombre', newItemName);
            formData.append('descripcion', newItemDesc);
            if (newItemFile) formData.append('imagen', newItemFile);

            try {
                await menuService.createPlatillo(formData);
                fetchData();
                setNewItemName('');
                setNewItemDesc('');
                setNewItemFile(null);
            } catch (error) {
                console.error("Error adding item:", error);
            }
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[3000] bg-luxury-black/95 backdrop-blur-sm flex items-center justify-center p-10"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
                    className="bg-luxury-white max-w-4xl w-full p-20 relative max-h-[90vh] overflow-y-auto shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5"
                >
                    <button onClick={onClose} className="absolute top-10 right-10 text-luxury-gray-mid hover:text-luxury-black transition-all">
                        <X size={32} />
                    </button>

                    <span className="text-[12px] uppercase tracking-[0.8em] font-bold text-luxury-gray-mid block mb-6 px-1 border-l-4 border-luxury-black">Architecture Gastronomique</span>
                    <div className="flex items-center gap-8 mb-20 group/title">
                        <h2 className="text-7xl font-serif uppercase tracking-tight text-luxury-black">Sección</h2>
                        <input 
                            defaultValue={category}
                            onBlur={(e) => handleRenameCategory(category, e.target.value)}
                            className="text-7xl font-serif italic font-light text-luxury-gray-mid bg-transparent border-none outline-none focus:text-luxury-black transition-colors"
                        />
                        <Edit3 size={14} className="text-luxury-gray-mid opacity-0 group-hover/title:opacity-100 transition-opacity" />
                    </div>

                    <div className="mb-20 space-y-4">
                        <label className="text-[11px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid block italic">Descripción de la Sección</label>
                        <textarea 
                            value={categoryDesc}
                            onChange={(e) => setCategoryDesc(e.target.value)}
                            onBlur={() => {
                                const catId = menus[category]?.id;
                                if (catId) menuService.updateCategoria(catId, { descripcion: categoryDesc }).then(() => fetchData());
                            }}
                            className="w-full bg-transparent border-b border-luxury-black/10 py-4 font-serif text-xl italic outline-none focus:border-luxury-black transition-all"
                            placeholder="Subtítulo o descripción corta para esta categoría..."
                        />
                    </div>

                    <div className="space-y-16">
                        <div className="space-y-8">
                            <label className="text-[11px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid block italic">Repertorio Actual</label>
                            <div className="space-y-6">
                                {menus[category]?.items?.map((item, i) => (
                                    <div key={item.id} className="group relative flex items-center border-b border-luxury-black/10 pb-6 hover:border-luxury-black transition-all">
                                        <span className="text-2xl font-serif text-luxury-black opacity-10 mr-10 italic">{i < 9 ? `0${i + 1}` : i + 1}</span>
                                        {item.imagen && (
                                            <div className="w-12 h-12 bg-luxury-white border border-luxury-black/5 overflow-hidden mr-6 flex-shrink-0 grayscale group-hover:grayscale-0 transition-all">
                                                <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <input
                                            value={item.nombre}
                                            readOnly
                                            className="bg-transparent border-none outline-none flex-1 text-2xl font-serif font-light tracking-tight text-luxury-black"
                                        />
                                        <button
                                            onClick={() => handleRemoveItem(category, item.id)}
                                            className="p-2 opacity-0 group-hover:opacity-100 hover:text-red-700 transition-all duration-300"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8 pt-16 border-t border-luxury-black/10">
                            <div className="flex gap-0 group border-b-2 border-luxury-black/20 focus-within:border-luxury-black transition-all">
                                <input
                                    placeholder="Nombre del nuevo platillo maestro..."
                                    className="flex-1 bg-transparent py-8 px-4 text-3xl font-serif text-luxury-black outline-none italic placeholder:text-luxury-gray-mid"
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                />
                                <div className="relative flex items-center px-6 border-l border-luxury-black/10">
                                    <input 
                                        type="file" 
                                        onChange={(e) => setNewItemFile(e.target.files[0])}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <ImageIcon className={`transition-colors ${newItemFile ? 'text-luxury-black' : 'text-luxury-gray-mid opacity-30'}`} size={20} />
                                </div>
                            </div>
                            <textarea 
                                placeholder="Descripción o ingredientes del platillo..."
                                className="w-full bg-transparent p-4 font-serif text-xl italic outline-none border border-transparent focus:border-luxury-black/10 transition-all resize-none"
                                rows="2"
                                value={newItemDesc}
                                onChange={(e) => setNewItemDesc(e.target.value)}
                            />
                            <button
                                onClick={() => handleAddItem(category)}
                                className="w-full py-8 bg-luxury-black text-luxury-white text-[12px] uppercase tracking-[0.5em] font-bold hover:bg-luxury-gray-dark transition-all"
                            >
                                Añadir a la Carta
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full bg-luxury-black text-luxury-white py-12 text-[14px] uppercase tracking-[0.8em] font-bold shadow-3xl hover:bg-luxury-gray-dark transition-all duration-500 mt-16"
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MenuCategoryModal;
