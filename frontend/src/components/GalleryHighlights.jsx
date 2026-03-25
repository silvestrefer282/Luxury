import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { galeriaService } from '../services/api';

const GalleryHighlights = () => {
    const [highlights, setHighlights] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await galeriaService.getAll();
                // Fetch up to 8 images for the carousel
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

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % highlights.length);
    }, [highlights.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + highlights.length) % highlights.length);
    }, [highlights.length]);

    // Auto-play (7 seconds)
    useEffect(() => {
        if (highlights.length === 0 || loading) return;
        const timer = setInterval(nextSlide, 7000);
        return () => clearInterval(timer);
    }, [highlights.length, loading, nextSlide]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-40 bg-white">
            <div className="w-12 h-12 border-t-2 border-black rounded-full animate-spin mb-6"></div>
        </div>
    );

    if (highlights.length === 0) return null;

    // Helper to get relative items
    const getItem = (offset) => {
        const index = (currentIndex + offset + highlights.length) % highlights.length;
        return highlights[index];
    };

    return (
        <section className="py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-6 text-center">
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-primary-400 font-bold tracking-[0.5em] uppercase text-[10px] block mb-6"
                >
                    Narrativa Visual
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl mb-24 font-serif uppercase tracking-tighter"
                >
                    Eventos <span className="italic font-light">Destacados</span>
                </motion.h2>

                {/* 3D Stack Carousel */}
                <div className="relative h-[500px] md:h-[650px] w-full flex items-center justify-center">
                    
                    {/* Left (Behind) */}
                    <div 
                        className="absolute left-[5%] md:left-[15%] w-[60%] md:w-[40%] aspect-[4/5] opacity-20 scale-75 blur-sm cursor-pointer transition-all duration-700 hidden md:block"
                        onClick={prevSlide}
                    >
                        <img src={getItem(-1).img} className="w-full h-full object-cover border border-black/5" alt="previous" />
                    </div>

                    {/* Right (Behind) */}
                    <div 
                        className="absolute right-[5%] md:right-[15%] w-[60%] md:w-[40%] aspect-[4/5] opacity-20 scale-75 blur-sm cursor-pointer transition-all duration-700 hidden md:block"
                        onClick={nextSlide}
                    >
                        <img src={getItem(1).img} className="w-full h-full object-cover border border-black/5" alt="next" />
                    </div>

                    {/* Active (Front) */}
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="relative z-20 w-[85%] md:w-[45%] aspect-[4/5] shadow-2xl overflow-hidden group"
                        >
                            <img 
                                src={highlights[currentIndex].img} 
                                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" 
                                alt={highlights[currentIndex].title} 
                            />
                            
                            {/* Title Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10 text-left">
                                <span className="text-white/60 text-[10px] uppercase tracking-[0.4em] mb-4">Fotografía del Evento</span>
                                <h3 className="text-white text-3xl font-serif italic mb-6">{highlights[currentIndex].title}</h3>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <button 
                        onClick={prevSlide}
                        className="absolute left-4 md:left-10 z-30 w-12 h-12 md:w-16 md:h-16 border border-black/10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md hover:bg-black hover:text-white transition-all duration-500 shadow-xl"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute right-4 md:right-10 z-30 w-12 h-12 md:w-16 md:h-16 border border-black/10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md hover:bg-black hover:text-white transition-all duration-500 shadow-xl"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-4 mt-16 mb-24">
                    {highlights.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`h-1 transition-all duration-500 ${i === currentIndex ? 'w-12 bg-black' : 'w-4 bg-black/10'}`}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="flex justify-center"
                >
                    <Link to="/galeria" className="btn-luxury group">
                        Ver Galería Completa <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default GalleryHighlights;
