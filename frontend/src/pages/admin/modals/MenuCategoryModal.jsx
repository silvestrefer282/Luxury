import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Image as ImageIcon, Camera } from 'lucide-react';
import { menuService } from '../../../services/api';

const MenuCategoryModal = ({
    isOpen,
    onClose,
    category,
    menus,
    fetchData,
    handleRenameCategory,
    handleRemoveItem,
    triggerAlert,
    triggerConfirm
}) => {
    const [newItemName, setNewItemName] = useState('');
    const [newItemImage, setNewItemImage] = useState(null);

    if (!isOpen) return null;

    const handleAddItem = async (catName) => {
        const catId = menus[catName]?.id;
        if (catId && newItemName) {
            const formData = new FormData();
            formData.append('categoria', catId);
            formData.append('nombre', newItemName);
            formData.append('descripcion', ''); 
            if (newItemImage) {
                formData.append('imagen', newItemImage);
            }

            try {
                await menuService.createPlatillo(formData);
                fetchData();
                setNewItemName('');
                setNewItemImage(null);
                triggerAlert("Platillo Añadido", `El plato '${newItemName}' ha sido integrado con éxito.`);
            } catch (error) {
                console.error("Error adding item:", error);
                const detail = error.response?.data?.nombre?.[0] || error.response?.data?.error || "Error interno del servidor (500). Verifique los datos.";
                triggerAlert("Error de Registro", `No se pudo añadir el platillo. Detalle: ${detail}`);
            }
        }
    };

    const handleUpdatePlatilloImage = async (platilloId, file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append('imagen', file);
        try {
            await menuService.updatePlatillo(platilloId, formData);
            fetchData();
            triggerAlert("Imagen Actualizada", "La imagen del platillo ha sido cargada.");
        } catch (error) {
            triggerAlert("Error", "No se pudo cargar la imagen del platillo.");
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
                    <div className="flex flex-col gap-8 mb-20 group/title">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-7xl font-serif uppercase tracking-tight text-luxury-black">Sección</h2>
                            <div className="flex items-center gap-6">
                                <label className="cursor-pointer bg-luxury-black text-luxury-white px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-luxury-gray-dark transition-all flex items-center gap-3">
                                    <ImageIcon size={14} />
                                    {menus[category]?.imagen ? 'Cambiar Imagen Principal' : 'Agregar Imagen Principal'}
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const catId = menus[category]?.id;
                                                const formData = new FormData();
                                                formData.append('imagen', file);
                                                await menuService.updateCategoria(catId, formData);
                                                fetchData();
                                            }
                                        }}
                                    />
                                </label>
                                {menus[category]?.imagen && (
                                    <span className="text-[9px] uppercase tracking-widest text-green-600 font-bold">Imagen Cargada</span>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <input 
                                defaultValue={category}
                                onBlur={(e) => {
                                    const newName = e.target.value;
                                    if (newName !== category && newName.trim()) {
                                        triggerConfirm(
                                            "Renombrar Sección",
                                            `¿Desea cambiar el nombre de '${category}' a '${newName}'?`,
                                            () => handleRenameCategory(category, newName)
                                        );
                                    }
                                }}
                                className="text-7xl font-serif italic font-light text-luxury-gray-mid bg-transparent border-none outline-none focus:text-luxury-black transition-colors"
                            />
                            <Edit3 size={14} className="text-luxury-gray-mid opacity-0 group-hover/title:opacity-100 transition-opacity" />
                        </div>
                    </div>


                    <div className="space-y-16">
                        <div className="space-y-8">
                            <label className="text-[11px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid block italic">Repertorio Actual</label>
                            <div className="space-y-6">
                                {menus[category]?.items?.map((item, i) => (
                                    <div key={item.id} className="group relative flex items-center border-b border-luxury-black/10 pb-6 hover:border-luxury-black transition-all">
                                        <span className="text-2xl font-serif text-luxury-black opacity-10 mr-10 italic">{i < 9 ? `0${i + 1}` : i + 1}</span>
                                        
                                        <div className="flex items-center gap-6 flex-1">
                                            <label className="relative cursor-pointer group/img">
                                                <div className="w-16 h-16 rounded-full overflow-hidden border border-luxury-black/10 flex items-center justify-center bg-gray-50 transition-all group-hover/img:border-luxury-black">
                                                    {item.imagen ? (
                                                        <img src={item.imagen} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Camera size={16} className="text-luxury-gray-mid group-hover/img:text-luxury-black" />
                                                    )}
                                                </div>
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center rounded-full transition-opacity">
                                                    <Camera size={14} className="text-white" />
                                                </div>
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    onChange={(e) => handleUpdatePlatilloImage(item.id, e.target.files[0])}
                                                />
                                            </label>

                                            <input
                                                value={item.nombre}
                                                readOnly
                                                className="bg-transparent border-none outline-none flex-1 text-2xl font-serif font-light tracking-tight text-luxury-black"
                                            />
                                        </div>

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
                            <div className="flex items-center gap-6 border-b-2 border-luxury-black/20 focus-within:border-luxury-black transition-all">
                                <label className="cursor-pointer group/new">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${newItemImage ? 'border-green-500 bg-green-50' : 'border-dashed border-luxury-black/20 group-hover/new:border-luxury-black'}`}>
                                        {newItemImage ? (
                                            <img src={URL.createObjectURL(newItemImage)} className="w-full h-full object-cover rounded-full" />
                                        ) : (
                                            <ImageIcon size={18} className="text-luxury-gray-mid group-hover/new:text-luxury-black" />
                                        )}
                                    </div>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={(e) => setNewItemImage(e.target.files[0])}
                                    />
                                </label>
                                <input
                                    placeholder="Nombre del nuevo platillo maestro..."
                                    className="flex-1 bg-transparent py-8 text-3xl font-serif text-luxury-black outline-none italic placeholder:text-luxury-gray-mid"
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                />
                                {newItemImage && (
                                    <button onClick={() => setNewItemImage(null)} className="text-red-500 hover:text-red-700 p-2">
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
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