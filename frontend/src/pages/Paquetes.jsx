import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { Users, Clock, Info, X, Star, Heart, ChevronLeft, ChevronRight, Music, Sparkles, Utensils, Layout, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { paqueteService, servicioService } from '../services/api';

const Paquetes = () => {
    const [catalogData, setCatalogData] = useState([]);
    const [extraServices, setExtraServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPack, setSelectedPack] = useState(null);
    const [filter, setFilter] = useState('Todos');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const [packsRes, servicesRes] = await Promise.all([
                    paqueteService.getAll(),
                    servicioService.getAll()
                ]);

                const mappedPacks = packsRes.data.map(pkg => ({
                    id: pkg.id,
                    category: pkg.incluye_menu ? 'Banquetes' : 'Básicos',
                    title: pkg.nombre.toUpperCase(),
                    price: Number(pkg.precio_base).toLocaleString('es-MX', { minimumFractionDigits: 2 }),
                    capacity: pkg.capacidad_personas,
                    duration: pkg.duracion_horas,
                    img: pkg.imagen || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000',
                    gallery: pkg.galeria?.length > 0 
                        ? pkg.galeria.map(imgObj => imgObj.imagen) 
                        : [pkg.imagen].filter(Boolean),
                    desc: pkg.descripcion || 'Experiencia exclusiva diseñada para redefinir el estándar de la elegancia.',
                    included: pkg.servicios_incluidos ? pkg.servicios_incluidos.split('\n').filter(s => s.trim()) : [],
                    extraHour: `$${Number(pkg.precio_hora_adicional).toLocaleString()}`,
                    notes: pkg.notes
                }));

                const mappedServices = servicesRes.data.map(s => {
                    let Icon = Star;
                    const cat = s.categoria;
                    if (cat === 'Entretenimiento') Icon = Music;
                    else if (cat === 'Decoración') Icon = Sparkles;
                    else if (cat === 'Gastronomía') Icon = Utensils;
                    else if (cat === 'Estructura') Icon = Layout;
                    else if (cat === 'Fotografía') Icon = Camera;

                    return {
                        name: s.nombre,
                        price: `$${Number(s.precio_unitario).toLocaleString()}${s.tipo_cobro === 'Por Persona' ? '/p' : ''}`,
                        icon: Icon
                    };
                });

                setCatalogData(mappedPacks);
                setExtraServices(mappedServices);
            } catch (err) {
                console.error("Error loading luxury content:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    // Auto-slide effect for the gallery
    useEffect(() => {
        let interval;
        if (selectedPack && selectedPack.gallery && selectedPack.gallery.length > 1) {
            interval = setInterval(() => {
                const currentIndex = selectedPack.gallery.indexOf(selectedPack.img);
                const nextIndex = (currentIndex + 1) % selectedPack.gallery.length;
                setSelectedPack(prev => ({ ...prev, img: prev.gallery[nextIndex] }));
            }, 4000); // Change image every 4 seconds
        }
        return () => clearInterval(interval);
    }, [selectedPack?.id, selectedPack?.img]); // Reset interval when pack or image changes

    const filteredPacks = filter === 'Todos'
        ? catalogData
        : catalogData.filter(p => (p.category || "").includes(filter) || (p.title || "").includes(filter));

    return (
        <PageTransition>
            <div className="bg-white min-h-screen">
                <Navbar />

                {/* Hero Section */}
                <section className="pt-48 pb-32 px-10 bg-white">
                    <div className="max-w-[1600px] mx-auto text-center">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-primary-400 text-[11px] uppercase tracking-[0.6em] font-bold inline-block mb-10"
                        >
                            Catálogo 2024 / LUXURY
                        </motion.span>
                        <h1 className="text-7xl md:text-9xl mb-12 font-serif uppercase tracking-tight leading-none text-black">
                            Colección <span className="italic font-light">Exclusiva</span>
                        </h1>
                        <p className="text-primary-500 text-xl max-w-4xl mx-auto font-light leading-relaxed mb-10">
                            Una curaduría meticulosa de experiencias diseñadas para redefinir el estándar de la elegancia.
                            Cada paquete es una declaración de estilo y sofisticación minimalista.
                        </p>
                    </div>
                </section>

                {/* Filter section */}
                <div className="sticky top-24 z-40 bg-white/90 backdrop-blur-md border-y border-primary-100 py-8 mb-24">
                    <div className="max-w-[1600px] mx-auto flex justify-center gap-16 px-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
                        {['Todos', 'Básicos', 'Banquetes'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`text-[11px] uppercase tracking-[0.4em] font-bold transition-all relative py-2 ${filter === cat ? 'text-black' : 'text-primary-400 hover:text-black'
                                    }`}
                            >
                                {cat}
                                {filter === cat && (
                                    <motion.div layoutId="activeFilter" className="absolute -bottom-1 left-0 right-0 h-[2px] bg-black" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="w-16 h-16 border-t-2 border-black rounded-full animate-spin mb-10"></div>
                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-black/40">Cargando Colección...</span>
                    </div>
                ) : (
                    <>
                        {/* Main Catalog Grid */}
                        <section className="px-10 pb-40">
                            <div className="max-w-[1600px] mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-24 gap-x-16">
                                    {filteredPacks.map((pack, idx) => (
                                        <motion.div
                                            key={pack.id}
                                            initial={{ opacity: 0, y: 40 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 1, ease: [0.2, 1, 0.3, 1], delay: idx * 0.1 }}
                                            viewport={{ once: true }}
                                            className="group cursor-pointer flex flex-col"
                                            onClick={() => setSelectedPack(pack)}
                                        >
                                            <div className="relative aspect-[3/4] overflow-hidden bg-primary-50 mb-10 shadow-sm border border-primary-100">
                                                <img
                                                    src={pack.img}
                                                    alt={pack.title}
                                                    className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
                                                />
                                                <div className="absolute top-8 left-8 bg-black text-white px-8 py-3 shadow-2xl">
                                                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold">{pack.category}</span>
                                                </div>
                                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <div className="flex justify-between items-baseline mb-6">
                                                    <h3 className="text-3xl font-serif uppercase tracking-wider text-black group-hover:text-primary-700 transition-colors">
                                                        {pack.title}
                                                    </h3>
                                                    <span className="text-xl font-light text-primary-400">/{pack.id.toString().padStart(2, '0')}</span>
                                                </div>
                                                <p className="text-primary-500 font-light text-base leading-relaxed mb-10 line-clamp-2 max-w-sm italic">
                                                    {pack.desc}
                                                </p>
                                                <div className="mt-auto flex justify-between items-center pt-8 border-t border-primary-100">
                                                    <div className="flex gap-10 text-[10px] uppercase tracking-[0.3em] font-bold text-primary-400">
                                                        <span className="flex items-center gap-3"><Users size={14} className="text-black" /> {pack.capacity} P</span>
                                                        <span className="flex items-center gap-3"><Clock size={14} className="text-black" /> {pack.duration}H</span>
                                                    </div>
                                                    <span className="text-2xl font-medium text-black tracking-tight">${pack.price}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Complementary Services - Magazine Layout */}
                                <div className="mt-64">
                                    <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
                                        <div className="max-w-xl">
                                            <span className="text-primary-400 text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block">Add-ons</span>
                                            <h2 className="text-5xl md:text-7xl font-serif uppercase text-black leading-none">Servicios <span className="italic font-light">Adicionales</span></h2>
                                        </div>
                                        <p className="text-primary-500 font-light text-lg max-w-sm italic leading-relaxed">
                                            Personaliza tu experiencia hasta el último detalle con nuestra selección de servicios a la carta.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-primary-100">
                                        {extraServices.map((s, i) => (
                                            <div key={i} className="p-12 border-b border-r border-primary-100 hover:bg-primary-50 transition-colors group">
                                                <div className="flex items-start justify-between mb-10">
                                                    <div className="w-12 h-12 flex items-center justify-center bg-black text-white group-hover:scale-110 transition-transform duration-500">
                                                        <s.icon size={20} />
                                                    </div>
                                                    <span className="text-2xl font-medium text-black tracking-tight">{s.price}</span>
                                                </div>
                                                <h4 className="text-xs uppercase tracking-[0.4em] font-bold text-primary-900">{s.name}</h4>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}

                {/* Detailed Modal Carousel */}
                <AnimatePresence>
                    {selectedPack && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[2000] flex items-center justify-center p-6 md:p-12 bg-black/95 backdrop-blur-2xl"
                            onClick={() => setSelectedPack(null)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                onClick={e => e.stopPropagation()}
                                className="bg-white w-full max-w-[1400px] h-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
                            >
                                {/* Left Gallery Section */}
                                <div className="flex-[1.2] relative bg-black flex flex-col">
                                    <div className="flex-1 relative overflow-hidden group/modal">
                                        <AnimatePresence mode="wait">
                                            <motion.img
                                                key={selectedPack.img}
                                                src={selectedPack.img}
                                                alt={selectedPack.title}
                                                initial={{ opacity: 0, scale: 1.1 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.8 }}
                                                className="w-full h-full object-cover"
                                            />
                                        </AnimatePresence>

                                        {/* Arrows */}
                                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-8 opacity-0 group-hover/modal:opacity-100 transition-opacity duration-300 pointer-events-none">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const idx = selectedPack.gallery.indexOf(selectedPack.img);
                                                    const prev = (idx - 1 + selectedPack.gallery.length) % selectedPack.gallery.length;
                                                    setSelectedPack({ ...selectedPack, img: selectedPack.gallery[prev] });
                                                }}
                                                className="w-16 h-16 bg-white flex items-center justify-center text-black pointer-events-auto hover:bg-gray-100 transition-colors"
                                            >
                                                <ChevronLeft size={32} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const idx = selectedPack.gallery.indexOf(selectedPack.img);
                                                    const next = (idx + 1) % selectedPack.gallery.length;
                                                    setSelectedPack({ ...selectedPack, img: selectedPack.gallery[next] });
                                                }}
                                                className="w-16 h-16 bg-white flex items-center justify-center text-black pointer-events-auto hover:bg-gray-100 transition-colors"
                                            >
                                                <ChevronRight size={32} />
                                            </button>
                                        </div>

                                        <div className="absolute top-10 left-10">
                                            <div className="bg-white px-8 py-3 text-black text-[12px] uppercase tracking-[0.5em] font-bold shadow-2xl">
                                                {selectedPack.category}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thumbnails */}
                                    <div className="bg-black/40 backdrop-blur-md p-4 grid grid-cols-4 md:grid-cols-6 gap-3">
                                        {selectedPack.gallery?.map((gImg, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setSelectedPack({ ...selectedPack, img: gImg })}
                                                className={`aspect-square cursor-pointer overflow-hidden border-2 transition-all duration-300 ${selectedPack.img === gImg ? 'border-white opacity-100 scale-105' : 'border-transparent opacity-40 hover:opacity-70'
                                                    }`}
                                            >
                                                <img src={gImg} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Content Section */}
                                <div className="flex-[0.8] p-12 md:p-20 overflow-y-auto bg-white flex flex-col">
                                    <div className="flex justify-between items-start mb-16">
                                        <h2 className="text-5xl font-serif uppercase tracking-tight text-black">{selectedPack.title}</h2>
                                        <button onClick={() => setSelectedPack(null)} className="text-primary-400 hover:text-black transition-colors">
                                            <X size={32} />
                                        </button>
                                    </div>

                                    <div className="flex gap-12 mb-16 pb-12 border-b border-primary-100">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] uppercase tracking-widest text-primary-400 font-bold">Capacidad</span>
                                            <span className="text-2xl font-medium text-black">{selectedPack.capacity} P</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] uppercase tracking-widest text-primary-400 font-bold">Duración</span>
                                            <span className="text-2xl font-medium text-black">{selectedPack.duration} Hrs</span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] uppercase tracking-widest text-primary-400 font-bold">Inversión</span>
                                            <span className="text-2xl font-medium text-black">${selectedPack.price}</span>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-primary-600 text-lg font-light leading-relaxed mb-16 italic border-l-4 border-black pl-8">
                                            {selectedPack.desc}
                                        </p>
                                        
                                        <h4 className="text-[11px] uppercase tracking-[0.4em] font-bold text-black mb-10">Servicios Incluidos</h4>
                                        <div className="grid grid-cols-1 gap-6 mb-20">
                                            {selectedPack.included.map((item, i) => (
                                                <div key={i} className="flex items-center gap-6 group">
                                                    <div className="w-8 h-[1px] bg-primary-200 group-hover:w-12 group-hover:bg-black transition-all duration-500" />
                                                    <span className="text-primary-600 font-light text-lg">{item}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {selectedPack.notes && (
                                            <div className="bg-primary-50 p-10 border-l-[6px] border-black mb-16">
                                                <p className="text-primary-700 italic font-light leading-relaxed">
                                                    "{selectedPack.notes}"
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-auto pt-12 flex gap-6">
                                        <button
                                            onClick={() => navigate('/reservar')}
                                            className="flex-1 bg-black text-white text-[11px] uppercase tracking-[0.5em] font-bold py-6 hover:bg-primary-800 transition-all shadow-2xl"
                                        >
                                            Reservar Experiencia
                                        </button>
                                        <button
                                            onClick={() => setSelectedPack(null)}
                                            className="px-10 border border-primary-200 text-primary-400 text-[11px] uppercase tracking-[0.5em] font-bold hover:bg-black hover:text-white transition-all"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Footer />
            </div>
        </PageTransition>
    );
};

export default Paquetes;