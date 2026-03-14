import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Music, Sparkles, Clock, ArrowRight, CheckCircle2, Utensils, Layout } from 'lucide-react';
import { servicioService } from '../services/api';

const ServiceCard = ({ title, description, image, icon: Icon, price, delay, category }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay }}
        viewport={{ once: true }}
        className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-primary-100 hover:border-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5 flex flex-col"
    >
        <div className="relative h-72 overflow-hidden">
            <img
                src={image || "/images/placeholder.png"}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                <p className="text-white/90 text-sm font-medium">Desde ${Number(price).toLocaleString()}</p>
            </div>
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg text-accent">
                <Icon size={24} />
            </div>
            <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {category}
            </div>
        </div>

        <div className="p-8 flex-1 flex flex-col">
            <h3 className="text-2xl font-serif mb-3 group-hover:text-accent transition-colors duration-300">{title}</h3>
            <p className="text-primary-500 mb-6 leading-relaxed line-clamp-3">
                {description || "Servicio premium diseñado para elevar la calidad y sofisticación de su evento."}
            </p>

            <div className="flex items-center justify-between mt-auto">
                <button className="flex items-center gap-2 text-accent font-bold group/btn">
                    Ver detalles
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover/btn:translate-x-2" />
                </button>
            </div>
        </div>
    </motion.div>
);

function Servicios() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const getIconForCategory = (category) => {
        switch (category) {
            case 'Entretenimiento': return Music;
            case 'Decoración': return Sparkles;
            case 'Gastronomía': return Utensils;
            case 'Estructura': return Layout;
            case 'Fotografía': return Camera;
            default: return Sparkles;
        }
    };

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await servicioService.getAll();
                setServices(response.data);
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    return (
        <div className="min-h-screen bg-primary-50/30">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent blur-3xl opacity-50" />

                <div className="container px-6 mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-accent uppercase bg-accent-light rounded-full">
                            Personalización Total
                        </span>
                        <h1 className="text-6xl md:text-7xl mb-8 leading-[1.1]">
                            Servicios <span className="text-accent italic">Exclusivos</span> para tu Evento
                        </h1>
                        <p className="text-xl text-primary-500 mb-10 leading-relaxed font-sans max-w-2xl">
                            Elevamos cada detalle de tu celebración a un nivel de sofisticación incomparable. Descubre nuestros complementos diseñados para crear experiencias memorables.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 relative">
                <div className="container px-6 mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-t-2 border-accent rounded-full animate-spin mb-6"></div>
                            <span className="text-sm uppercase tracking-widest text-primary-400 font-bold">Curando Catálogo...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 xl:gap-14">
                            {services.map((service, index) => (
                                <ServiceCard 
                                    key={service.id} 
                                    title={service.nombre}
                                    description={service.descripcion}
                                    image={service.imagen}
                                    icon={getIconForCategory(service.categoria)}
                                    price={service.precio_unitario}
                                    category={service.categoria}
                                    delay={index * 0.1}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-24 bg-primary-900 overflow-hidden relative">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100" stroke="white" strokeWidth="0.1" fill="none" />
                    </svg>
                </div>

                <div className="container px-6 mx-auto relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-4xl md:text-5xl text-white mb-8">
                                El compromiso de <span className="text-accent italic">LUXURY</span> con la excelencia
                            </h2>
                            <div className="space-y-6">
                                {[
                                    "Garantía de calidad en cada proveedor",
                                    "Coordinación integral sin costo adicional",
                                    "Atención personalizada 24/7",
                                    "Equipos de última generación"
                                ].map((item, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        viewport={{ once: true }}
                                        key={i}
                                        className="flex items-center gap-4 text-white/80 text-lg"
                                    >
                                        <CheckCircle2 className="text-accent flex-shrink-0" size={24} />
                                        {item}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="aspect-square bg-accent/20 rounded-[3rem] absolute inset-0 rotate-6 translate-x-4 translate-y-4 -z-10" />
                            <img
                                src="/images/decor.png"
                                alt="Quality commitment"
                                className="rounded-[3rem] w-full h-full object-cover shadow-2xl"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer / Contact CTA */}
            <section className="py-32">
                <div className="container px-6 mx-auto text-center">
                    <h2 className="text-5xl mb-10 max-w-3xl mx-auto">¿Listo para comenzar a planear tu momento <span className="text-accent">inolvidable</span>?</h2>
                    <button className="btn-luxury mx-auto px-12 py-5 text-xl">
                        Contactar a un Asesor <ArrowRight size={24} />
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Servicios;