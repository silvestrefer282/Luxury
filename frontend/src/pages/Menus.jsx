import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Award, Leaf, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
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
                        subtitle: cat.descripcion || '',
                        imagen: cat.imagen,
                        items: itemsRes.data
                            .filter(item => item.categoria === cat.id)
                            .map(item => ({
                                id: item.id,
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
            <div className="container mx-auto px-10 pt-32 mb-32 text-center">
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-black/40 block mb-6 px-4 border-l-2 border-black inline-block">Culinaria Luxury</span>
                <h1 className="text-7xl md:text-8xl font-serif uppercase tracking-tighter mb-10">Menús <br /><span className="italic font-light text-black/80">de Autor</span></h1>
                <p className="max-w-xl mx-auto text-black/50 text-[10px] uppercase tracking-[0.3em] font-medium leading-loose border-t border-black/10 pt-10">
                    Una experiencia gastronómica de alta costura diseñada para cautivar los sentidos.
                    Ingredientes frescos, técnicas vanguardistas.
                </p>
            </div>
            {/* Menu Navigator */}
            <div 
                className="sticky top-[88px] z-[400] bg-white/95 backdrop-blur-xl border-y border-black/5 py-8 transition-all duration-300 shadow-sm sticky-submenu"
            >
                <div className="container mx-auto px-10 flex flex-wrap justify-center gap-12 md:gap-20">
                    {Object.keys(menuData).map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`text-[10px] uppercase tracking-[0.4em] font-bold transition-all duration-300 relative group ${activeCategory === cat ? 'text-black' : 'text-black/30 hover:text-black'
                                }`}
                        >
                            {menuData[cat].title.replace('Platos Fuertes - ', '')}
                            {activeCategory === cat && (
                                <motion.div layoutId="menuTab" className="absolute -bottom-4 left-0 right-0 h-px bg-black" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <PageTransition>
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
                        <div className="relative aspect-[3/4] bg-black overflow-hidden group border border-black/5">
                            {activeCategory && menuData[activeCategory]?.imagen ? (
                                <img 
                                    src={menuData[activeCategory].imagen} 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                    alt={menuData[activeCategory].title}
                                />
                            ) : (
                                <div className="absolute inset-0 bg-black flex items-center justify-center">
                                    <Utensils size={100} className="text-white/5" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                            
                            <div className="absolute inset-x-10 top-10 flex justify-between items-start border-b border-white/40 pb-10">
                                <Utensils className="text-white" size={24} strokeWidth={1} />
                                <span className="text-white/60 text-[9px] uppercase tracking-[0.4em]">Sección {activeCategory && menuData[activeCategory]?.title.toUpperCase()}</span>
                            </div>
                            <div className="absolute inset-x-10 bottom-10">
                                <h2 className="text-white text-6xl font-serif italic mb-6 leading-tight drop-shadow-2xl">{activeCategory && menuData[activeCategory]?.title}</h2>
                                <p className="text-white/80 text-[10px] uppercase tracking-widest font-bold">Reserva Gastronómica Exclusiva</p>
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
 

                                <div className="space-y-12 pr-4 max-h-[500px] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-black/10 hover:[&::-webkit-scrollbar-thumb]:bg-black/30">
                                    {activeCategory && menuData[activeCategory]?.items.map((item, i) => (
                                        <div key={i} className="group cursor-default border-b border-black/5 pb-10 hover:border-black transition-all duration-500 mr-2">
                                            <div className="flex items-start gap-8">
                                                <span className="text-xl font-serif text-black/20 group-hover:text-black transition-colors">{i < 9 ? `0${i + 1}` : i + 1}</span>
                                                <div className="space-y-4">
                                                    <p className="text-lg font-light leading-relaxed text-black tracking-tight">{item.name}</p>
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

                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            ) : (
                <div className="text-center py-40">
                    <p className="text-black/40 uppercase tracking-widest">No hay propuestas gastronómicas disponibles en este momento.</p>
                </div>
            )}
            </PageTransition>

            <Footer />
        </div>
    );
};

export default Menus;