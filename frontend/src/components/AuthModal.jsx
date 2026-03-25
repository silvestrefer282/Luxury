import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import TerminosModal from '../pages/Terminos';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const navigate = useNavigate();
    const [mode, setMode] = useState(initialMode); // 'login' or 'register'
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    
    // Estado para el checkbox de términos y el modal
    const [aceptaTerminos, setAceptaTerminos] = useState(false);
    const [showTerminos, setShowTerminos] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nombre: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Sincronizar el modo cuando el modal se abre
    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setError(null);
            setSuccessMsg(null);
            setFormErrors({});
            setAceptaTerminos(false); // Reiniciar checkbox al abrir
            // Hacer scroll al principio en móviles
            const container = document.getElementById('auth-modal-container');
            if (container) container.scrollTop = 0;
        }
    }, [isOpen, initialMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
        setFormErrors({ ...formErrors, [e.target.name]: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (mode === 'register' && !formData.nombre.trim()) newErrors.nombre = 'Requerido';

        if (!formData.email.trim()) {
            newErrors.email = 'Requerido';
        } else if (mode === 'register' && !emailRegex.test(formData.email)) {
            newErrors.email = 'El correo electrónico no es válido';
        }

        if (!formData.password) newErrors.password = 'Requerido';
        if (mode === 'register' && !formData.confirmPassword) newErrors.confirmPassword = 'Requerido';
        
        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors);
            return;
        }

        // Validación extra para los términos antes de disparar el loading
        if (mode === 'register' && !aceptaTerminos) {
            alert("Debes aceptar los Términos y Condiciones para crear tu cuenta en SIRLUX.");
            setError("Debes aceptar los términos y condiciones para continuar.");
            return;
        }

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
                
                // Enviamos los datos incluyendo la confirmación de términos
                response = await authService.registro({
                    ...formData,
                    acepta_terminos: aceptaTerminos
                });
            }

            if (mode === 'login') {
                const { user, token } = response.data;
                login(user, token);
                if (user.rol === 'Administrador') {
                    navigate('/admin');
                }
                onClose();
            } else {
                setSuccessMsg('Tu usuario fue creado exitosamente. Preparando tu espacio exclusivo...');
                setTimeout(() => {
                    const { user, token } = response.data;
                    login(user, token);
                    if (user.rol === 'Administrador') {
                        navigate('/admin');
                    }
                    onClose();
                }, 2500);
            }
        } catch (err) {
            console.error('Auth Error:', err);
            setError(err.response?.data || err.message || 'Ocurrió un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    const renderError = () => {
        if (!error) return null;

        if (error.error) return <span>{String(error.error)}</span>;

        if (typeof error === 'object') {
            return (
                <ul className="list-none space-y-3">
                    {Object.entries(error).map(([field, messages]) => (
                        <li key={field} className="flex flex-col gap-1">
                            <span className="opacity-40 text-[8px] tracking-[0.5em] italic uppercase">{field}</span> 
                            <span>{Array.isArray(messages) ? messages[0] : String(messages)}</span>
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

                            {successMsg ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-8"
                                >
                                    <div className="w-24 h-24 bg-luxury-black text-luxury-white rounded-full flex items-center justify-center mb-4 shadow-2xl">
                                        <CheckCircle size={48} />
                                    </div>
                                    <h3 className="text-4xl font-serif text-luxury-black">¡Bienvenido!</h3>
                                    <p className="text-[11px] uppercase tracking-[0.3em] font-bold text-luxury-gray-mid leading-relaxed max-w-xs mx-auto">
                                        {successMsg}
                                    </p>
                                    <Loader2 className="animate-spin text-luxury-gray-light mt-8" size={24} />
                                </motion.div>
                            ) : (
                                <>
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
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mb-10 border border-luxury-black/10 bg-white p-6 md:p-8 flex flex-col gap-3 rounded-2xl shadow-sm"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 bg-red-700 rotate-45" />
                                                <span className="text-[9px] uppercase tracking-[0.5em] font-bold text-luxury-gray-mid italic block">
                                                    Aviso de Acceso
                                                </span>
                                            </div>
                                            <div className="text-[10px] uppercase tracking-widest font-black text-luxury-black/80 pl-4 border-l border-luxury-black/10">
                                                {renderError()}
                                            </div>
                                        </motion.div>
                                    )}

                                    <form onSubmit={handleSubmit} noValidate className={mode === 'register' ? "space-y-8" : "space-y-12"}>
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
                                                    />
                                                </div>
                                                {formErrors.nombre && (
                                                    <p className="text-[9px] uppercase tracking-[0.3em] font-black text-red-700 mt-2">
                                                        * {formErrors.nombre}
                                                    </p>
                                                )}
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
                                                    autoComplete={mode === 'login' ? "username" : "off"}
                                                />
                                            </div>
                                            {formErrors.email && (
                                                <p className="text-[9px] uppercase tracking-[0.3em] font-black text-red-700 mt-2">
                                                    * {formErrors.email}
                                                </p>
                                            )}
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
                                                    placeholder="Luxury24"
                                                    maxLength="8"
                                                    className="w-full bg-transparent outline-none font-serif text-xl placeholder:text-black/10"
                                                    autoComplete={mode === 'login' ? "current-password" : "new-password"}
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
                                            {formErrors.password && (
                                                <p className="text-[9px] uppercase tracking-[0.3em] font-black text-red-700 mt-2">
                                                    * {formErrors.password}
                                                </p>
                                            )}
                                        </div>

                                        {mode === 'register' && (
                                            <>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] uppercase tracking-widest font-black text-black/60 italic">Confirmar Contraseña</label>
                                                    <div className="relative border-b border-black/10 focus-within:border-black transition-all pb-3 flex items-center gap-4">
                                                        <Lock size={16} className="text-black/20" />
                                                        <input 
                                                            type={showConfirmPassword ? "text" : "password"} 
                                                            name="confirmPassword"
                                                            value={formData.confirmPassword}
                                                            onChange={handleChange}
                                                            placeholder="Luxury24"
                                                            maxLength="8"
                                                            className="w-full bg-transparent outline-none font-serif text-xl placeholder:text-black/10"
                                                            autoComplete="new-password"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="text-black/20 hover:text-black transition-colors flex shrink-0"
                                                        >
                                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                    </div>
                                                    {formErrors.confirmPassword && (
                                                        <p className="text-[9px] uppercase tracking-[0.3em] font-black text-red-700 mt-2">
                                                            * {formErrors.confirmPassword}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Sección de Términos y Condiciones */}
                                                <div className="pt-2">
                                                    <label className="flex items-center gap-3 cursor-pointer group">
                                                        <div className="relative flex items-center justify-center">
                                                            <input 
                                                                type="checkbox"
                                                                checked={aceptaTerminos}
                                                                onChange={(e) => setAceptaTerminos(e.target.checked)}
                                                                className="peer appearance-none w-4 h-4 border border-black/20 rounded-sm checked:bg-black transition-all"
                                                            />
                                                            <div className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none">
                                                                <svg size={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-2.5 h-2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] uppercase tracking-widest font-bold text-black/40 group-hover:text-black transition-colors italic">
                                                            Acepto los <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTerminos(true); }} className="underline decoration-black/20 underline-offset-4 hover:decoration-black">Términos y Condiciones</button>
                                                        </span>
                                                    </label>
                                                </div>
                                            </>
                                        )}

                                        <button 
                                            type="submit"
                                            disabled={loading || (mode === 'register' && !aceptaTerminos) || successMsg}
                                            className="w-full py-8 bg-black text-white text-[11px] uppercase tracking-[0.5em] font-black shadow-2xl hover:bg-black/90 transition-all flex items-center justify-center gap-4 group rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <Loader2 className="animate-spin" size={20} />
                                            ) : (
                                                <div className="flex items-center gap-4">
                                                    <span>{mode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}</span>
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
                                </>
                            )}
                        </div>
                    </motion.div>
                    
                    {/* Renderizar el Modal de Términos dentro de este contexto */}
                    <TerminosModal 
                        isOpen={showTerminos} 
                        onClose={() => setShowTerminos(false)} 
                        onAccept={() => {
                            setAceptaTerminos(true);
                            setShowTerminos(false);
                            setError(null);
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
};

export default AuthModal;