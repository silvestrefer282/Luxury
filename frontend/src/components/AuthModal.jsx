import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const navigate = useNavigate();
    const [mode, setMode] = useState(initialMode); // 'login' or 'register'
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nombre: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Sincronizar el modo cuando el modal se abre
    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setError(null);
            // Hacer scroll al principio en móviles
            const container = document.getElementById('auth-modal-container');
            if (container) container.scrollTop = 0;
        }
    }, [isOpen, initialMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let response;
            if (mode === 'login') {
                response = await authService.login({
                    email: formData.email,
                    password: formData.password
                });
            } else {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error('Las contraseñas no coinciden');
                }
                response = await authService.registro(formData);
            }

            const { user, token } = response.data;
            login(user, token);
            
            // Redirigir si es admin
            if (user.rol === 'Administrador') {
                navigate('/admin');
            }
            
            onClose();
        } catch (err) {
            console.error('Auth Error:', err);
            setError(err.response?.data || err.message || 'Ocurrió un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    const renderError = () => {
        if (!error) return null;

        if (typeof error === 'object') {
            return (
                <ul className="list-none space-y-1">
                    {Object.entries(error).map(([field, messages]) => (
                        <li key={field}>
                            <span className="opacity-60">{field}:</span> <span>{Array.isArray(messages) ? messages[0] : String(messages)}</span>
                        </li>
                    ))}
                </ul>
            );
        }

        return <span>{String(error)}</span>;
    };

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[10000] flex items-center justify-center px-6"
                >
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <motion.div
                        id="auth-modal-container"
                        key="auth-modal-content"
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-4xl max-h-[95vh] bg-white overflow-y-auto md:overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-[2rem] no-scrollbar"
                    >
                        {/* Left Side: Visual/Branding */}
                        <div className="hidden md:flex w-5/12 bg-black relative p-12 lg:p-16 flex-col justify-between overflow-hidden min-h-[500px]">
                            <div className="absolute top-0 left-0 w-full h-full opacity-30">
                               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
                               <img 
                                    src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80" 
                                    alt="Luxury Event" 
                                    className="w-full h-full object-cover grayscale"
                               />
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-3xl lg:text-4xl font-serif text-white tracking-tight uppercase mb-4 leading-none">
                                    {mode === 'login' ? (
                                        <>EXPERIENCIA <br/><span className="italic font-light opacity-60">DE LUJO</span></>
                                    ) : (
                                        <>UNIRSE A LA <br/><span className="italic font-light opacity-60">EXPERIENCIA</span></>
                                    )}
                                </h2>
                                <div className="h-1 w-12 bg-white/20 mb-8" />
                            </div>

                            <div className="relative z-10">
                                <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-bold leading-relaxed">
                                    {mode === 'login' 
                                        ? "Accede a un mundo de elegancia y distinción. Tu próximo gran evento comienza aquí."
                                        : "Crea tu perfil exclusivo para gestionar tus eventos con la máxima distinción."
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Right Side: Form */}
                        <div className="flex-1 p-8 sm:p-12 md:p-16 relative bg-white overflow-y-auto">
                            <button 
                                onClick={onClose}
                                className="absolute top-6 right-6 sm:top-10 sm:right-10 text-black/20 hover:text-black transition-colors z-20"
                            >
                                <X size={24} />
                            </button>

                            <div className="mb-8 sm:mb-12">
                                <span className="text-[10px] uppercase tracking-[0.6em] text-black/30 font-bold block mb-4 border-l-2 border-black px-4">
                                    Portal de Acceso
                                </span>
                                <h3 className="text-4xl sm:text-5xl font-serif uppercase tracking-tight text-black">
                                    {mode === 'login' ? (
                                        <>Iniciar <span className="italic font-light">Sesión</span></>
                                    ) : (
                                        <>Registrarse</>
                                    )}
                                </h3>
                            </div>

                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-[10px] uppercase tracking-widest font-bold"
                                >
                                    {renderError()}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className={mode === 'register' ? "space-y-8" : "space-y-12"}>
                                {mode === 'register' && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-widest font-black text-black/60 italic">Nombre Completo</label>
                                        <div className="relative border-b border-black/10 focus-within:border-black transition-all pb-3 flex items-center gap-4">
                                            <User size={16} className="text-black/20" />
                                            <input 
                                                type="text" 
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                placeholder="Tu nombre"
                                                className="w-full bg-transparent outline-none font-serif text-xl placeholder:text-black/10"
                                                required={mode === 'register'}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-black/60 italic">
                                        {mode === 'login' ? 'Usuario o Correo' : 'Dirección de Correo'}
                                    </label>
                                    <div className="relative border-b border-black/10 focus-within:border-black transition-all pb-3 flex items-center gap-4">
                                        {mode === 'login' ? <User size={16} className="text-black/20" /> : <Mail size={16} className="text-black/20" />}
                                        <input 
                                            type={mode === 'login' ? "text" : "email"} 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder={mode === 'login' ? "Usuario o correo" : "email@example.com"}
                                            className="w-full bg-transparent outline-none font-serif text-xl placeholder:text-black/10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10px] uppercase tracking-widest font-black text-black/60 italic">Contraseña</label>
                                        {mode === 'login' && (
                                            <button type="button" className="text-[9px] uppercase tracking-widest text-black/40 hover:text-black transition-colors">
                                                ¿Olvidó su clave?
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative border-b border-black/10 focus-within:border-black transition-all pb-3 flex items-center gap-4">
                                        <Lock size={16} className="text-black/20" />
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full bg-transparent outline-none font-serif text-xl placeholder:text-black/10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-black/20 hover:text-black transition-colors flex shrink-0"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {mode === 'register' && (
                                    <div className="space-y-3">
                                        <label className="text-[10px] uppercase tracking-widest font-black text-black/60 italic">Confirmar Contraseña</label>
                                        <div className="relative border-b border-black/10 focus-within:border-black transition-all pb-3 flex items-center gap-4">
                                            <Lock size={16} className="text-black/20" />
                                            <input 
                                                type={showConfirmPassword ? "text" : "password"} 
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                className="w-full bg-transparent outline-none font-serif text-xl placeholder:text-black/10"
                                                required={mode === 'register'}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="text-black/20 hover:text-black transition-colors flex shrink-0"
                                            >
                                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-8 bg-black text-white text-[11px] uppercase tracking-[0.5em] font-black shadow-2xl hover:bg-black/90 transition-all flex items-center justify-center gap-4 group rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <span>{mode === 'login' ? 'Entrar al Panel' : 'Registrarse'}</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    )}
                                </button>
                            </form>

                            <div className="mt-16 pt-8 border-t border-black/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                                <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">
                                    {mode === 'login' ? '¿No tiene una cuenta registrada?' : '¿Ya es parte de Luxury?'}
                                </p>
                                <button 
                                    onClick={() => {
                                        setMode(mode === 'login' ? 'register' : 'login');
                                        setError(null);
                                    }}
                                    className="text-[10px] uppercase tracking-[0.3em] font-black text-black border-b-2 border-black pb-1 hover:opacity-50 transition-all"
                                >
                                    {mode === 'login' ? 'Registrarse' : 'Iniciar Sesión Ahora'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
};

export default AuthModal;
