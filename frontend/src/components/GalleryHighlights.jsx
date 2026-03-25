import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { galeriaService } from '../services/api';

const GalleryHighlights = () => {
    const [highlights, setHighlights] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0); // -1 for left, 1 for right
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await galeriaService.getAll();
                // Fetch up to 8 images for a richer carousel
                const mapped = response.data.slice(0, 8).map(img => ({
                    id: img.id,
                    img: img.imagen,
                    title: img.titulo || 'Esencia Luxury'
                }));
                setHighlights(mapped);
            } catch (error) {
                console.error("Error fetching gallery highlights:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, []);

    const paginate = useCallback((newDirection) => {
        setDirection(newDirection);
        setCurrentIndex((prev) => (prev + newDirection + highlights.length) % highlights.length);
    }, [highlights.length]);

    // Intervalo auto-play (6 segundos)
    useEffect(() => {
        if (highlights.length === 0 || loading) return;
        const timer = setInterval(() => {
            paginate(1);
        }, 6000);
        return () => clearInterval(timer);
    }, [highlights.length, loading, paginate]);

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 1.1
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.6 },
                scale: { duration: 1.2, ease: "easeOut" }
            }
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 0.9,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 }
            }
        })
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 bg-white">
            <div className="w-12 h-12 border-t-2 border-black rounded-full animate-spin mb-6"></div>
        </div>
    );

    if (highlights.length === 0) return null;

    return (
        <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-black group/carousel">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0"
                >
                    <div className="absolute inset-0 bg-black/30 z-10" />
                    <img
                        src={highlights[currentIndex].img}
                        alt={highlights[currentIndex].title}
                        className="h-full w-full object-cover"
                    />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 z-20 flex items-center justify-start pointer-events-none">
                        <div className="container mx-auto px-10 md:px-24">
                            <motion.div 
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="max-w-3xl"
                            >
                                <span className="text-white/60 text-[10px] uppercase tracking-[0.8em] font-bold block mb-8">
                                    Featured Event Selection
                                </span>
                                <h2 className="text-white text-7xl md:text-9xl font-serif leading-none mb-10 tracking-tighter uppercase">
                                    Momentos <br />
                                    <span className="italic font-light opacity-80">Seleccionados</span>
                                </h2>
                                <h3 className="text-white/90 text-xl font-serif italic mb-12 flex items-center gap-4">
                                   <span className="w-10 h-px bg-white/40" /> {highlights[currentIndex].title}
                                </h3>
                                
                                <div className="pointer-events-auto">
                                    <Link to="/galeria" className="inline-flex items-center gap-4 text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:gap-8 transition-all duration-300">
                                        Explorar Galería <ArrowRight size={20} />
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Premium Controls */}
            <div className="absolute bottom-16 right-16 z-30 flex items-center gap-8">
                <div className="flex items-center gap-4">
                  <span className="text-white/40 text-[10px] font-bold tracking-widest whitespace-nowrap">
                    {String(currentIndex + 1).padStart(2, '0')}
                  </span>
                  <div className="w-20 h-px bg-white/20 relative">
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-white"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentIndex + 1) / highlights.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-white/40 text-[10px] font-bold tracking-widest whitespace-nowrap">
                    {String(highlights.length).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => paginate(-1)}
                        className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500 hover:scale-110"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button 
                        onClick={() => paginate(1)}
                        className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500 hover:scale-110"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* Vertical Indicator */}
            <div className="absolute top-1/2 -translate-y-1/2 left-10 z-30 flex flex-col gap-3">
              {highlights.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  className={`w-1 transition-all duration-500 ${i === currentIndex ? 'h-8 bg-white' : 'h-3 bg-white/20'}`}
                />
              ))}
            </div>

            {/* Luxury Gradient Blur Bottom */}
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />
        </section>
    );
};

export default GalleryHighlights;
