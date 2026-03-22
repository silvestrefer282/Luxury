import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CTA = () => {
    const { user } = useAuth();

    return (
        <section 
            className="py-16 md:py-24 text-center text-white relative bg-cover bg-center bg-no-repeat"
            style={{ 
                background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2000") no-repeat center center/cover`
            }}
        >
            <div className="container mx-auto px-6">
                <h2 className="text-3xl md:text-5xl text-white mb-6 font-serif tracking-tight">
                    ¿Listo Para Crear Momentos Inolvidables?
                </h2>

                <p className="text-base md:text-xl text-white/90 max-w-[700px] mx-auto mb-12">
                    Reserva ahora y obtén asesoramiento personalizado gratuito para planificar tu evento perfecto
                </p>

                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center' 
                }}>

                    {/* 👇 SI NO HAY USUARIO → SOLO REGISTRO */}
                    {!user && (
                        <Link 
                            to="/registro" 
                            className="btn-outline" 
                            style={{ 
                                background: '#000', 
                                color: '#fff',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '5px',
                                fontWeight: '500'
                            }}
                        >
                            Crear cuenta
                        </Link>
                    )}

                    {/* 👇 SI HAY USUARIO → SOLO RESERVAR */}
                    {user && (
                        <Link to="/reservar" className="btn-luxury">
                            Reservar ahora
                        </Link>
                    )}

                </div>
            </div>
        </section>
    );
};

export default CTA;