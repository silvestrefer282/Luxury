import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const Navbar = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState('login');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Inicio', path: '/' },
        { name: 'Catálogo', path: '/catalogar' },
        { name: 'Servicios', path: '/servicios' },
        { name: 'Galería', path: '/galeria' },
        { name: 'Menús', path: '/menus' },
        { name: 'Disponibilidad', path: '/disponibilidad' },
        { name: 'Reserva', path: '/reservar' },
    ];

    const openAuth = (mode) => {
        setAuthModalMode(mode);
        setIsAuthModalOpen(true);
    };

    const handleNavLinkClick = (e, link) => {
        if (link.name === 'Reserva' && !user) {
            e.preventDefault();
            setIsMobileMenuOpen(false);
            openAuth('login');
        } else {
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[1000] px-10 transition-all duration-500 ${isScrolled
                ? 'bg-white/95 backdrop-blur-md py-4 shadow-xl border-b border-black/5'
                : 'bg-white py-6 border-b border-black/5'
                }`}>
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    {/* 1. SECCIÓN IZQUIERDA: LOGO */}
                    <div className="flex-1 flex justify-start">
                        <Link to="/" className="no-underline group">
                            <img
                                src="/images/logo.png"
                                alt="LUXURY Salón Social"
                                className="h-12 md:h-14 w-auto object-contain transition-all duration-300 group-hover:opacity-80"
                                style={{ filter: 'brightness(0)' }}
                            />
                        </Link>
                    </div>

                    {/* 2. SECCIÓN CENTRAL: ENLACES (CENTRADO PERFECTO Y SIN ENCIMAR) */}
                    <div className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 flex-[2_2_0%]">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={(e) => handleNavLinkClick(e, link)}
                                className="relative text-[9.5px] uppercase tracking-[0.3em] font-bold text-black/60 hover:text-black transition-colors no-underline whitespace-nowrap"
                            >
                                {link.name}
                                {location.pathname === link.path && (
                                    <motion.div
                                        layoutId="navUnderline"
                                        className="absolute -bottom-2 left-0 right-0 h-[1.5px] bg-black"
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* 3. SECCIÓN DERECHA: AUTH Y BOTONES */}
                    <div className="flex-1 flex justify-end items-center gap-6">
                        {/* Desktop Auth Section */}
                        <div className="hidden lg:flex items-center gap-6">
                            <div className="h-6 w-px bg-black/5 mx-2" />
                            
                            {!user ? (
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => openAuth('login')}
                                        className="border border-black text-black text-[9px] uppercase tracking-[0.25em] px-6 py-2.5 font-bold hover:bg-black hover:text-white transition-all shadow-sm rounded-xl"
                                    >
                                        Iniciar Sesión
                                    </button>
                                    <button
                                        onClick={() => openAuth('register')}
                                        className="bg-black text-white text-[9px] uppercase tracking-[0.25em] px-6 py-2.5 font-bold hover:bg-black/80 transition-all shadow-lg rounded-xl"
                                    >
                                        Registrarse
                                    </button>
                                </div>
                            ) : (
                                <div className="group/user relative">
                                    <div className="flex items-center gap-3 cursor-pointer">
                                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-black">Mi Cuenta</span>
                                        <ChevronDown size={12} className="group-hover/user:rotate-180 transition-transform" />
                                    </div>

                                    <div className="absolute top-full right-0 mt-4 w-56 bg-white shadow-2xl border border-black/5 py-4 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all rounded-2xl">
                                        <Link to="/mis-reservas" className="block px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-black/60 hover:text-black hover:bg-black/5 no-underline">Mis Reservas</Link>

                                        {user.rol === 'Administrador' && (
                                            <Link to="/admin" className="block px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-black/60 hover:text-black hover:bg-black/5 no-underline">Panel de Administración</Link>
                                        )}

                                        {user.rol === 'Encargado' && (
                                            <Link to="/encargado" className="block px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-black/60 hover:text-black hover:bg-black/5 no-underline">Panel Encargado</Link>
                                        )}

                                        <div className="h-px bg-black/5 my-2" />
                                        <button onClick={logout} className="w-full text-left px-8 py-4 text-[10px] uppercase tracking-widest font-bold text-red-600 hover:bg-red-50 transition-colors">Cerrar Sesión</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className="lg:hidden text-black p-2"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-white/98 backdrop-blur-3xl overflow-hidden border-t border-black/5"
                        >
                            <div className="container px-6 py-12 flex flex-col gap-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={(e) => handleNavLinkClick(e, link)}
                                        className={`text-3xl font-serif font-light tracking-tight ${location.pathname === link.path ? 'text-black font-medium italic' : 'text-black/40'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <hr className="border-black/5" />

                                {!user ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                openAuth('login');
                                            }}
                                            className="py-5 border border-black text-[10px] uppercase tracking-widest font-bold rounded-xl"
                                        >
                                            Entrar
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                openAuth('register');
                                            }}
                                            className="py-5 bg-black text-white text-[10px] uppercase tracking-widest font-bold shadow-xl rounded-xl"
                                        >
                                            Registrarse
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4 py-4 px-2 border-b border-black/5">
                                            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-sm text-white font-bold">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold block">{user.first_name}</span>
                                                <span className="text-[10px] uppercase tracking-widest text-black/50">{user.rol}</span>
                                            </div>
                                        </div>
                                        <Link
                                            to="/mis-reservas"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="py-4 px-4 text-[11px] uppercase tracking-widest font-bold hover:bg-black/5 rounded-xl no-underline text-black/70"
                                        >
                                            Mis Reservas
                                        </Link>

                                        {user.rol === 'Administrador' && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="py-4 px-4 text-[11px] uppercase tracking-widest font-bold hover:bg-black/5 rounded-xl no-underline text-black/70"
                                            >
                                                Panel de Administración
                                            </Link>
                                        )}

                                        {user.rol === 'Encargado' && (
                                            <Link
                                                to="/encargado"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="py-4 px-4 text-[11px] uppercase tracking-widest font-bold hover:bg-black/5 rounded-xl no-underline text-black/70"
                                            >
                                                Panel Encargado
                                            </Link>
                                        )}

                                        <button
                                            onClick={() => {
                                                setIsMobileMenuOpen(false);
                                                logout();
                                            }}
                                            className="mt-4 py-5 text-red-600 text-[10px] uppercase tracking-widest font-bold border border-red-100 rounded-xl hover:bg-red-50"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authModalMode}
            />
        </>
    );
};

export default Navbar;