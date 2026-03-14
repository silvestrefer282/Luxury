import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Award, Leaf, Flame } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { menuService } from '../services/api';

const Menus = () => {
    const [activeCategory, setActiveCategory] = useState(null);
    const [menuData, setMenuData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const [catsRes, itemsRes] = await Promise.all([
                    menuService.getCategorias(),
                    menuService.getPlatillos()
                ]);

                const formattedData = {};
                
                catsRes.data.forEach(cat => {
                    formattedData[cat.id] = {
                        title: cat.nombre,
                        subtitle: cat.descripcion || 'Propuesta Editorial de Autor',
                        items: itemsRes.data
                            .filter(item => item.categoria === cat.id)
                            .map(item => ({
                                name: item.nombre,
                                description: item.descripcion
                            }))
                    };
                });

                setMenuData(formattedData);
                if (catsRes.data.length > 0) {
                    setActiveCategory(catsRes.data[0].id);
                }
            } catch (err) {
                console.error("Error fetching gastronomic content:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMenus();
    }, []);

    return (
        <div className="bg-[#f9f9f9] min-h-screen pt-32">
            <Navbar />

            {/* Gastronomy Header */}
            <div className="container mx-auto px-10 mb-32 text-center">
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-black/40 block mb-6 px-4 border-l-2 border-black inline-block">Culinaria Luxury</span>
                <h1 className="text-7xl md:text-8xl font-serif uppercase tracking-tighter mb-10">Signature <br /><span className="italic font-light text-black/80">Menus</span></h1>
                <p className="max-w-xl mx-auto text-black/50 text-[10px] uppercase tracking-[0.3em] font-medium leading-loose border-t border-black/10 pt-10">
                    Una experiencia gastronómica de alta costura diseñada para cautivar los sentidos.
                    Ingredientes frescos, técnicas vanguardistas.
                </p>
            </div>

            {/* Menu Navigator */}
            <div className="sticky top-24 z-50 bg-white/80 backdrop-blur-xl border-y border-black/5 py-8 mb-20">
                <div className="container mx-auto px-10 flex flex-wrap justify-center gap-12 md:gap-20">
                    {Object.keys(menuData).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`text-[10px] uppercase tracking-[0.4em] font-bold transition-all duration-300 relative group ${activeCategory === cat ? 'text-black' : 'text-black/30 hover:text-black'
                                }`}
                        >
                            {menuData[cat].title.split(' ')[0]}
                            {activeCategory === cat && (
                                <motion.div layoutId="menuTab" className="absolute -bottom-4 left-0 right-0 h-px bg-black" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40">
                    <div className="w-16 h-16 border-t-2 border-black rounded-full animate-spin mb-10"></div>
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-black/40">Componiendo Menú...</span>
                </div>
            ) : Object.keys(menuData).length > 0 ? (
                /* Content Section */
                <div className="max-w-6xl mx-auto px-10 mb-40">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                        {/* Visual Aspect */}
                        <div className="relative aspect-[3/4] bg-black overflow-hidden group">
                            <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                            <div className="absolute inset-x-10 top-10 flex justify-between items-start border-b border-white/20 pb-10">
                                <Utensils className="text-white" size={24} strokeWidth={1} />
                                <span className="text-white/40 text-[9px] uppercase tracking-[0.4em]">Section {activeCategory && menuData[activeCategory]?.title.toUpperCase()}</span>
                            </div>
                            <div className="absolute inset-x-10 bottom-10">
                                <h2 className="text-white text-6xl font-serif italic mb-6 leading-tight">{activeCategory && menuData[activeCategory]?.title}</h2>
                                <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold">Reserva Gastronómica Exclusiva</p>
                            </div>
                            {/* Decorative Icons */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 scale-150">
                                <Utensils size={400} />
                            </div>
                        </div>

                        {/* Listing Aspect */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10 py-10"
                            >
                                {activeCategory && menuData[activeCategory]?.subtitle && (
                                    <h3 className="text-[11px] uppercase tracking-[0.5em] font-black text-black/20 mb-10">{menuData[activeCategory].subtitle}</h3>
                                )}

                                <div className="space-y-12">
                                    {activeCategory && menuData[activeCategory]?.items.map((item, i) => (
                                        <div key={i} className="group cursor-default border-b border-black/5 pb-10 hover:border-black transition-all duration-500">
                                            <div className="flex items-start gap-8">
                                                <span className="text-xl font-serif text-black/20 group-hover:text-black transition-colors">{i < 9 ? `0${i + 1}` : i + 1}</span>
                                                <div className="space-y-4">
                                                    <p className="text-lg font-light leading-relaxed text-black tracking-tight">{item.name}</p>
                                                    {item.description && (
                                                        <p className="text-[10px] text-black/40 uppercase tracking-widest font-black italic">{item.description}</p>
                                                    )}
                                                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Leaf size={12} className="text-black/30" title="Ingredientes frescos" />
                                                        <Award size={12} className="text-black/30" title="Selección del Chef" />
                                                        <Flame size={12} className="text-black/30" title="Preparación al momento" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-20 pt-10 border-t border-black/10">
                                    <button className="bg-black text-white w-full py-8 text-[11px] uppercase tracking-[0.5em] font-bold hover:bg-black/90 transition-all shadow-2xl">
                                        Consultar Disponibilidad
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            ) : (
                <div className="text-center py-40">
                    <p className="text-black/40 uppercase tracking-widest">No hay propuestas gastronómicas disponibles en este momento.</p>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Menus;
