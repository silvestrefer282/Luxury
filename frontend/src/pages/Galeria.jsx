import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { galeriaService } from '../services/api';

const Galeria = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await galeriaService.getAll();
                const mapped = res.data.map(img => ({
                    id: img.id,
                    url: img.imagen,
                    title: img.titulo || 'Esencia Luxury'
                }));
                setImages(mapped);
            } catch (err) {
                console.error("Error loading gallery:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    return (
        <div className="bg-white min-h-screen pt-32">
            <Navbar />

            {/* Gallery Header */}
            <div className="container mx-auto px-10 mb-20 text-center">
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-black/40 block mb-6">Visual Storytelling</span>
                <h1 className="text-7xl md:text-8xl font-serif uppercase tracking-tighter mb-10">Editorial <br /><span className="italic font-light">Gallery</span></h1>
                <div className="w-20 h-px bg-black mx-auto mb-10"></div>
                <p className="max-w-2xl mx-auto text-black/60 text-sm font-light leading-relaxed uppercase tracking-widest">
                    Una curaduría visual de los momentos más exclusivos capturados en Luxury Salón Social.
                    Donde cada evento es una portada de revista.
                </p>
            </div>

            {/* Masonry-like Grid */}
            <div className="px-5 md:px-20 mb-32">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="w-16 h-16 border-t-2 border-black rounded-full animate-spin mb-10"></div>
                        <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-black/40">Revelando Galería...</span>
                    </div>
                ) : images.length > 0 ? (
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
                        {images.map((img) => (
                            <motion.div
                                key={img.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="relative group cursor-none overflow-hidden bg-gray-100"
                                onClick={() => setSelectedImage(img)}
                            >
                                <img
                                    src={img.url}
                                    alt={img.title}
                                    className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-110"
                                />

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                    <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/60 mb-2">Luxury Moments</span>
                                    <h3 className="text-white text-xl font-serif italic">{img.title}</h3>
                                    <Maximize2 className="text-white absolute top-8 right-8" size={20} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40">
                        <p className="text-black/40 uppercase tracking-widest">Aún no hay capturas en la galería maestra.</p>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[2000] bg-black flex items-center justify-center p-10 md:p-20"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-10 right-10 text-white/60 hover:text-white transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={40} strokeWidth={1} />
                        </button>

                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={selectedImage.url}
                            alt={selectedImage.title}
                            className="max-w-full max-h-full object-contain shadow-2xl"
                        />

                        <div className="absolute bottom-10 left-10 md:left-20">
                            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-white/40 block mb-2 px-4 border-l border-white/40">Portfolio</span>
                            <h2 className="text-white text-4xl md:text-5xl font-serif italic px-4">{selectedImage.title}</h2>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default Galeria;
