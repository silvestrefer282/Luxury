import React from 'react';
import { Utensils, Edit3, Trash2 } from 'lucide-react';

const MenuCard = ({ category, menus, setEditingMenuCategory, handleRemoveCategory }) => (
    <div className="bg-white border border-luxury-black/5 hover:border-luxury-black p-12 transition-all duration-700 shadow-sm hover:shadow-2xl group overflow-hidden relative h-full flex flex-col justify-between">
        <div className="absolute -right-8 -top-8 text-luxury-black opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000">
            <Utensils size={160} />
        </div>

        <div>
            <div className="flex justify-between items-start mb-12 relative z-10">
                <div className="flex items-center gap-6">
                    {menus[category]?.imagen && (
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-luxury-black/5 shadow-sm">
                            <img src={menus[category].imagen} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div>
                        <span className="text-[9px] uppercase tracking-[0.4em] text-luxury-gray-mid font-bold block mb-2 italic">Colección</span>
                        <h3 className="text-4xl font-serif uppercase tracking-tighter text-luxury-black group-hover:translate-x-2 transition-transform duration-500">{category}</h3>
                    </div>
                </div>
            </div>

            <ul className="space-y-6 relative z-10 max-h-[350px] overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-luxury-black/10 hover:[&::-webkit-scrollbar-thumb]:bg-luxury-black/30">
                {menus[category]?.items?.map((item, i) => (
                    <li key={item.id} className="flex gap-6 items-start group/item border-b border-luxury-black/5 pb-4 hover:border-luxury-black transition-all mr-2">
                        <span className="text-lg font-serif text-luxury-black opacity-20 group-hover/item:opacity-100 transition-opacity">{i < 9 ? `0${i + 1}` : i + 1}</span>
                        <span className="text-sm font-light text-luxury-gray-dark group-hover/item:text-luxury-black transition-colors">{item.nombre}</span>
                    </li>
                ))}
            </ul>
        </div>

        <div className="mt-12 flex gap-2 relative z-10">
            <button
                onClick={() => setEditingMenuCategory(category)}
                className="flex-1 py-5 bg-luxury-black text-luxury-white text-[10px] uppercase tracking-[0.5em] font-bold hover:bg-luxury-gray-dark transition-all duration-500 shadow-xl flex items-center justify-center gap-4"
            >
                <Edit3 size={14} /> Editar Sección
            </button>
            <button
                onClick={() => handleRemoveCategory(category)}
                className="w-16 h-16 flex items-center justify-center border border-red-700/10 text-red-700 hover:bg-red-700 hover:text-white transition-all shadow-sm"
                title="Eliminar Categoría"
            >
                <Trash2 size={16} />
            </button>
        </div>
    </div>
);

const MenusView = ({ 
    menus, 
    searchTerm, 
    normalizeText,
    setEditingMenuCategory,
    handleRemoveCategory 
}) => (
    <div className="space-y-20 animate-in fade-in slide-in-from-left-5 duration-700">
        <div className="flex justify-end items-end mb-16 border-b-2 border-luxury-black pb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 px-8 py-3 border border-black/10 rounded-full">Editor Maestro Gastronómico</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {Object.keys(menus)
                .filter(category => {
                    const catMatches = normalizeText(category).includes(normalizeText(searchTerm));
                    const itemsMatch = (menus[category]?.items || [])
                        .some(item => normalizeText(item.nombre).includes(normalizeText(searchTerm)));
                    return catMatches || itemsMatch;
                })
                .map((category) => (
                    <MenuCard 
                        key={category} 
                        category={category} 
                        menus={menus}
                        setEditingMenuCategory={setEditingMenuCategory}
                        handleRemoveCategory={handleRemoveCategory}
                    />
                ))}
        </div>
    </div>
);

export default MenusView;
