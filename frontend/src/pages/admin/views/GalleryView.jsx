import React from 'react';
import { Trash2, Image as ImageIcon } from 'lucide-react';

const GalleryView = ({ 
    galeria, 
    galleryFilter, 
    setGalleryFilter, 
    handleDeleteGallery,
    setIsAddingGallery 
}) => (
    <div className="animate-in fade-in slide-in-from-right-5 duration-700">
        <div className="flex justify-end items-center mb-10 border-b border-luxury-black pb-8">
            <div className="flex gap-4">
                {['Todas', 'Montaje', 'Gastronomía', 'Retrato', 'Arquitectura'].map(f => (
                    <button 
                        key={f} 
                        onClick={() => setGalleryFilter(f)}
                        className={`text-[10px] uppercase tracking-[0.3em] font-bold px-8 py-3 border rounded-full transition-all duration-300 shadow-sm ${
                            galleryFilter === f 
                            ? 'bg-luxury-black text-luxury-white border-luxury-black shadow-lg shadow-black/10' 
                            : 'text-luxury-black/40 border-black/5 hover:border-luxury-black/20 hover:text-luxury-black'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-8">
            {galeria
                .filter(img => galleryFilter === 'Todas' || img.category === galleryFilter)
                .map((img) => (
                <div key={img.id} className="group relative aspect-[3/4] bg-luxury-black overflow-hidden border border-luxury-black/5 shadow-lg rounded-3xl">
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-all duration-1000 grayscale group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 p-10 flex flex-col justify-between">
                        <div className="flex justify-end gap-5 translate-y-[-20px] group-hover:translate-y-0 transition-transform duration-500">
                            <button onClick={() => handleDeleteGallery(img.id)} className="p-4 bg-white text-luxury-black hover:bg-red-600 hover:text-white transition-colors shadow-2xl rounded-2xl"><Trash2 size={16} /></button>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 block mb-2">{img.category}</span>
                            <h3 className="text-xl font-serif text-white uppercase tracking-tight">{img.title}</h3>
                        </div>
                    </div>
                </div>
            ))}

            <div 
                onClick={() => setIsAddingGallery(true)}
                className="aspect-[3/4] border-2 border-luxury-black/10 border-dashed flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-luxury-black transition-all duration-700 bg-white/50 rounded-3xl"
            >
                <div className="w-20 h-20 bg-luxury-black rounded-full flex items-center justify-center text-luxury-white mb-8 group-hover:bg-luxury-gray-dark transition-all">
                    <ImageIcon size={32} className="opacity-40 group-hover:opacity-100" />
                </div>
                <span className="text-[11px] uppercase tracking-[0.5em] text-luxury-gray-light font-bold italic group-hover:text-luxury-black transition-colors">Cargar más archivos editorial...</span>
            </div>
        </div>
    </div>
);

export default GalleryView;
