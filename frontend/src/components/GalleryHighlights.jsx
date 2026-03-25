import React, { useState, useEffect } from 'react';
import { ArrowRight, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { galeriaService } from '../services/api';

const GalleryCard = ({ img, title, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8, ease: [0.2, 1, 0.3, 1] }}
    viewport={{ once: true }}
    className="group relative aspect-[4/5] overflow-hidden bg-primary-50 border border-black/5 hover:border-black transition-all duration-700 shadow-sm hover:shadow-2xl"
  >
    <img
      src={img || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800'}
      alt={title}
      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-105"
    />
    
    {/* Overlay */}
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-left">
      <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-white/70 mb-2">Luxury Highlights</span>
      <h3 className="text-white text-2xl font-serif italic mb-4">{title || "Esencia Luxury"}</h3>
      <div className="flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
        <Maximize2 size={16} />
        <span className="text-[9px] uppercase tracking-widest font-bold">Ver Detalles</span>
      </div>
    </div>
  </motion.div>
);

const GalleryHighlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await galeriaService.getAll();
        // Limit to 3 recent highlights for the home page
        const mapped = response.data.slice(0, 3).map(img => ({
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

  return (
    <section className="py-32 bg-white px-6">
      <div className="container mx-auto text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-primary-400 font-bold tracking-[0.5em] uppercase text-[10px] block mb-6"
        >
          Visual Storytelling
        </motion.span>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl mb-10 font-serif uppercase tracking-tighter"
        >
          Eventos <span className="italic font-light">Destacados</span>
        </motion.h2>
        
        <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            className="h-px bg-black mx-auto mb-10"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-primary-500 text-lg max-w-2xl mx-auto mb-20 leading-relaxed font-light italic"
        >
          Una curaduría visual de los momentos más exclusivos capturados en nuestro salón. 
          Donde cada detalle cuenta una historia de sofisticación.
        </motion.p>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-t-2 border-black rounded-full animate-spin mb-6"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
            {highlights.map((h, i) => (
              <GalleryCard 
                key={h.id} 
                img={h.img}
                title={h.title}
                delay={i * 0.1} 
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <Link to="/galeria" className="btn-luxury group">
            Explorar Galería Completa 
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default GalleryHighlights;
