import React from 'react';
import { Edit3, Trash2, Image as ImageIcon } from 'lucide-react';

const adCategories = ['Todos', 'Entretenimiento', 'Decoración', 'Gastronomía', 'Estructura', 'Fotografía'];

const AdicionalesView = ({ 
    adicionales, 
    adicionalFilter, 
    setAdicionalFilter, 
    searchTerm, 
    normalizeText,
    setEditingAdicional,
    setAdicionalForm,
    handleDeleteAdicional
}) => (
    <div className="animate-in fade-in slide-in-from-right-5 duration-700">
        <div className="flex justify-end items-center mb-10 border-b border-luxury-black pb-8">
            <div className="flex gap-4">
                {adCategories.slice(0, 4).map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setAdicionalFilter(cat)}
                        className={`text-[10px] uppercase tracking-[0.3em] font-bold px-8 py-3 border rounded-full transition-all duration-300 ${
                            adicionalFilter === cat ? 'bg-luxury-black text-white border-luxury-black shadow-sm' : 'border-black/10 hover:border-black text-luxury-black/60 hover:text-luxury-black shadow-sm'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-8">
            {adicionales
                .filter(ad => {
                    const matchesFilter = adicionalFilter === 'Todos' || ad.category === adicionalFilter;
                    const matchesSearch = normalizeText(ad.name).includes(normalizeText(searchTerm));
                    return matchesFilter && matchesSearch;
                })
                .map((item) => (
                <div key={item.id} className="group relative bg-white border border-luxury-black/5 hover:border-luxury-black p-12 transition-all duration-1000 shadow-sm hover:shadow-2xl flex flex-col justify-between h-full min-h-[380px] overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-black/[0.02] -rotate-45 translate-x-16 -translate-y-16 group-hover:bg-luxury-black/[0.05] transition-all duration-1000" />
                    
                    <div className="relative z-10 w-full">
                        <div className="flex justify-between items-center mb-10">
                            <span className="text-[10px] uppercase tracking-[0.6em] text-luxury-gray-mid font-black">{item.category}</span>
                        </div>

                        {item.url && (
                            <div className="w-full aspect-video bg-luxury-white border border-luxury-black/5 overflow-hidden mb-10 grayscale group-hover:grayscale-0 transition-all duration-1000 scale-[1.02] group-hover:scale-100 shadow-sm">
                                <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                            </div>
                        )}

                        <h3 className="text-2xl font-serif text-luxury-black leading-tight mb-8 group-hover:translate-x-2 transition-transform duration-700">{item.name}</h3>
                    </div>

                    <div className="relative z-10 pt-8 border-t border-black/5 flex items-end justify-between">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.4em] text-luxury-gray-mid font-bold mb-2">Inversión</p>
                            <p className="text-4xl font-serif font-light text-luxury-black">
                                <span className="text-sm mr-2 opacity-40 font-sans">$</span>
                                {Number(item.price).toLocaleString()}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => {
                                    setEditingAdicional(item);
                                    setAdicionalForm({
                                        name: item.name || '',
                                        price: item.price || '',
                                        category: item.category || 'Entretenimiento',
                                        description: item.description || ''
                                    });
                                }} 
                                className="w-10 h-10 flex items-center justify-center text-luxury-black hover:bg-luxury-black hover:text-white border border-black/10 transition-all outline-none"
                            >
                                <Edit3 size={14} />
                            </button>
                            <button 
                                onClick={() => handleDeleteAdicional(item.id)} 
                                className="w-10 h-10 flex items-center justify-center text-red-700 hover:bg-red-700 hover:text-white border border-red-700/10 transition-all outline-none"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default AdicionalesView;
