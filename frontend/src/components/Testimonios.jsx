import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { testimonioService } from '../services/api';

const TestimonialCard = ({ img, name, role, text, calificacion = 5 }) => (
    <div
        className="card-luxury"
        style={{
            textAlign: 'left',
            padding: '3rem 2.5rem',
            background: '#fff',
            position: 'relative',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
            minHeight: '380px'
        }}
    >
        <div
            style={{
                position: 'absolute',
                top: '1.5rem',
                right: '2rem',
                opacity: 0.05,
                color: 'var(--accent)'
            }}
        >
            <Quote size={70} fill="currentColor" />
        </div>

        <div style={{ display: 'flex', gap: '4px', color: '#D4AF37', marginBottom: '2rem' }}>
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    size={18}
                    fill={i < calificacion ? '#D4AF37' : 'transparent'}
                    color="#D4AF37"
                />
            ))}
        </div>

        <p
            style={{
                color: 'var(--text-primary)',
                fontSize: '1.15rem',
                lineHeight: '1.8',
                marginBottom: '2.5rem',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                position: 'relative',
                zIndex: 1
            }}
        >
            "{text}"
        </p>

        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '1.8rem'
            }}
        >
            <img
                src={img}
                alt={name}
                style={{
                    width: '65px',
                    height: '65px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid var(--accent-light)'
                }}
            />
            <div>
                <h4
                    style={{
                        fontSize: '1.15rem',
                        fontFamily: 'var(--font-sans)',
                        fontWeight: '700',
                        margin: 0
                    }}
                >
                    {name}
                </h4>
                <p
                    style={{
                        color: 'var(--accent)',
                        fontSize: '0.8rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginTop: '0.35rem'
                    }}
                >
                    {role}
                </p>
            </div>
        </div>
    </div>
);

const Testimonios = () => {
    const hardcodedReviews = [
        {
            name: 'María González',
            role: 'Novia',
            img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
            text: 'Fue el día más especial de nuestras vidas. LUXURY superó todas nuestras expectativas. La atención al detalle y el montaje fueron simplemente impecables, nos sentimos en un cuento de hadas.',
            calificacion: 5
        },
        {
            name: 'Carlos Ramírez',
            role: 'Eventos Corporativos',
            img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
            text: 'Organizamos nuestra gala anual aquí y el profesionalismo es de otro nivel. El equipo técnico y la coordinación logística hicieron que todo fluyera sin un solo contratiempo. Altamente recomendados.',
            calificacion: 5
        },
        {
            name: 'Ana Martínez',
            role: 'Quinceañera',
            img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
            text: 'Hicieron realidad los sueños de mi hija. La decoración era exactamente lo que imaginamos y la comida fue el comentario de todos nuestros invitados. Gracias por hacer esto posible.',
            calificacion: 5
        }
    ];

    const [reviews, setReviews] = useState(hardcodedReviews);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await testimonioService.getAll({ approved_only: true });

                if (res.data && res.data.length > 0) {
                    const mapped = res.data.map((t) => ({
                        name: `${t.cliente_nombre} ${t.cliente_apellido}`,
                        role: 'Invitado Luxury',
                        text: t.comentario,
                        calificacion: t.calificacion,
                        img: `https://ui-avatars.com/api/?name=${t.cliente_nombre}+${t.cliente_apellido}&background=000&color=fff&size=128`
                    }));

                    setReviews([...mapped, ...hardcodedReviews].slice(0, 6));
                }
            } catch (error) {
                console.error('Error fetching testimonials:', error);
            }
        };

        fetchReviews();
    }, []);

    useEffect(() => {
        if (reviews.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % reviews.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [reviews]);

    if (!reviews.length) return null;

    const nextIndex = (currentIndex + 1) % reviews.length;

    return (
        <section className="section-padding" style={{ overflow: 'hidden' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <span
                        style={{
                            color: 'var(--accent)',
                            fontWeight: '800',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            fontSize: '0.9rem'
                        }}
                    >
                        Testimonios
                    </span>
                    <h2 style={{ fontSize: '4rem', marginTop: '1.5rem' }}>
                        Lo Que Dicen Nuestros Invitados
                    </h2>
                </div>

                <div
                    style={{
                        position: 'relative',
                        maxWidth: '1100px',
                        margin: '0 auto',
                        height: '430px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            right: '-120px',
                            width: '75%',
                            transform: 'scale(0.9)',
                            opacity: 0.35,
                            zIndex: 1,
                            pointerEvents: 'none'
                        }}
                    >
                        <TestimonialCard {...reviews[nextIndex]} />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 120 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -120 }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                            style={{
                                position: 'relative',
                                width: '75%',
                                zIndex: 2
                            }}
                        >
                            <TestimonialCard {...reviews[currentIndex]} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        marginTop: '2rem'
                    }}
                >
                    {reviews.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                border: 'none',
                                cursor: 'pointer',
                                background: i === currentIndex ? 'var(--accent)' : '#d1d5db'
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonios;