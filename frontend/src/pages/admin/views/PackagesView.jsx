import React from 'react';
import { Package, Edit3, Trash2 } from 'lucide-react';

const PackagesView = ({ 
    packages, 
    searchTerm, 
    normalizeText,
    setEditingPackage,
    setPackageForm,
    handleDeletePackage
}) => (
    <div className="space-y-16 animate-in fade-in slide-in-from-right-5 duration-700">
        <div className="h-px bg-luxury-black/10 w-full mb-16"></div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
            {packages
                .filter(pkg => normalizeText(pkg.name).includes(normalizeText(searchTerm)))
                .map((pkg) => (
                <div key={pkg.id} className="flex bg-white border border-luxury-black/5 hover:border-luxury-black transition-all duration-700 overflow-hidden min-h-[22rem] h-auto group shadow-sm hover:shadow-2xl">
                    <div className="w-2/5 overflow-hidden relative">
                        <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-luxury-black/20 group-hover:bg-transparent transition-colors duration-700" />
                    </div>
                    <div className="flex-1 p-10 flex flex-col justify-between relative">
                        <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                            <Package size={80} />
                        </div>
                        <div className="relative z-10">
                            <span className="text-[10px] uppercase tracking-[0.5em] text-luxury-gray-mid font-bold block mb-4">Registro: #00{pkg.id}</span>
                            <h3 className="text-3xl font-serif uppercase tracking-tighter mb-8 text-luxury-black group-hover:translate-x-2 transition-transform duration-500">{pkg.name}</h3>
                            <div className="flex gap-12">
                                <div>
                                    <p className="text-[9px] uppercase tracking-[0.4em] text-luxury-gray-mid font-bold mb-2">Inversión Base</p>
                                    <p className="text-2xl font-serif font-light text-luxury-black">${Number(pkg.price).toLocaleString()}</p>
                                </div>
                                <div className="border-l border-luxury-black/10 pl-12">
                                    <p className="text-[9px] uppercase tracking-[0.4em] text-luxury-gray-mid font-bold mb-2">Aforo Máximo</p>
                                    <p className="text-2xl font-serif font-light text-luxury-black">{pkg.capacity} <span className="text-xs uppercase tracking-widest text-luxury-gray-mid">Pax</span></p>
                                </div>
                            </div>
                            
                            {/* Galería rápida en la tarjeta */}
                            {pkg.gallery?.length > 0 && (
                                <div className="flex gap-2 mt-6 overflow-hidden">
                                    {pkg.gallery.slice(0, 4).map((img, i) => (
                                        <div key={i} className="w-10 h-10 border border-luxury-black/5 overflow-hidden flex-shrink-0">
                                            <img src={img.url} alt="Gallery thumb" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                                        </div>
                                    ))}
                                    {pkg.gallery.length > 4 && (
                                        <div className="w-10 h-10 bg-luxury-gray-dark flex items-center justify-center text-[10px] text-white font-bold">
                                            +{pkg.gallery.length - 4}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="pt-8 border-t border-luxury-black/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                             <div className="flex gap-4">
                                <button 
                                    onClick={() => {
                                        setEditingPackage(pkg);
                                        setPackageForm({
                                            name: pkg.name,
                                            price: pkg.price,
                                            capacity: pkg.capacity,
                                            duration: pkg.duration,
                                            extraHourPrice: pkg.extraHourPrice,
                                            includedServices: pkg.includedServices,
                                            notes: pkg.notes,
                                            description: pkg.description
                                        });
                                    }}
                                    className="p-3 bg-luxury-black text-white hover:bg-luxury-gray-dark transition-colors"
                                >
                                    <Edit3 size={14} />
                                </button>
                                <button 
                                    onClick={() => handleDeletePackage(pkg.id)}
                                    className="p-3 border border-red-700 text-red-700 hover:bg-red-700 hover:text-white transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                             </div>
                             <span className="text-[8px] uppercase tracking-[0.3em] font-black text-luxury-gray-mid">Luxury Estate Piece</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default PackagesView;
