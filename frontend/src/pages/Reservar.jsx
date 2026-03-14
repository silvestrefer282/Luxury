import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { paqueteService, reservacionService, servicioService } from '../services/api';
import { Calendar, Users, Info, Star, Shield, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Reservar = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [paquetes, setPaquetes] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        paquete: '',
        tipo_evento: '',
        fecha_evento: '',
        num_personas: '',
        nombre_festejado: '',
        servicios_adicionales: [],
        notas: '',
        hora_inicio: '18:00', // Campo interno requerido por el backend
        hora_fin: '22:00'     // Campo interno requerido por el backend
    });

    useEffect(() => {
        paqueteService.getAll().then(res => setPaquetes(res.data));
        servicioService.getAll().then(res => setServicios(res.data));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceToggle = (id) => {
        setFormData(prev => {
            const current = prev.servicios_adicionales;
            const updated = current.includes(id)
                ? current.filter(sId => sId !== id)
                : [...current, id];
            return { ...prev, servicios_adicionales: updated };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user || !user.cliente_id) {
            alert("Debes iniciar sesión como cliente para reservar.");
            return;
        }

        setLoading(true);
        try {
            // Adaptar datos para el backend
            const payload = {
                ...formData,
                cliente: user.cliente_id,
                observaciones: `Evento: ${formData.tipo_evento}. Festejado: ${formData.nombre_festejado}. Notas: ${formData.notas}`
            };
            await reservacionService.create(payload);
            alert("¡Reservación realizada con éxito!");
            navigate('/');
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || "Error al procesar la reserva. Verifica disponibilidad.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <Navbar />

            <div className="container" style={{ padding: '8rem 0 6rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-luxury"
                    style={{ maxWidth: '1000px', margin: '0 auto', background: '#fff', padding: '4rem' }}
                >
                    <h1 style={{ marginBottom: '3rem', fontSize: '2.5rem' }}>Reservar ahora</h1>

                    <form onSubmit={handleSubmit}>
                        {/* 1. Selecciona Paquete */}
                        <div style={{ marginBottom: '4rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <Star color="var(--accent)" /> Selecciona un Paquete *
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                                {paquetes.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => setFormData({ ...formData, paquete: p.id })}
                                        style={{
                                            position: 'relative',
                                            padding: '2rem',
                                            borderRadius: '12px',
                                            border: formData.paquete === p.id ? '2px solid var(--accent)' : '1px solid var(--border)',
                                            background: formData.paquete === p.id ? '#fff9f0' : '#fff',
                                            cursor: 'pointer',
                                            transition: 'var(--transition)'
                                        }}
                                    >
                                        <div style={{
                                            position: 'absolute', top: '1rem', right: '1rem',
                                            width: '20px', height: '20px', borderRadius: '50%',
                                            border: '2px solid var(--accent)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {formData.paquete === p.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)' }} />}
                                        </div>
                                        <h4 style={{ fontSize: '1.2rem', color: formData.paquete === p.id ? 'var(--accent)' : 'inherit' }}>{p.nombre}</h4>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '700', margin: '0.5rem 0' }}>${p.precio_base}</div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.descripcion}</p>
                                        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Clock size={12} /> {p.duracion_horas}h</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Users size={12} /> {p.capacidad_personas}p</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Datos generales */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                            <div>
                                <label>Tipo de evento *</label>
                                <select name="tipo_evento" value={formData.tipo_evento} onChange={handleChange} required>
                                    <option value="">Selecciona un tipo</option>
                                    <option value="Boda">Boda</option>
                                    <option value="XV Años">XV Años</option>
                                    <option value="Bautizo">Bautizo</option>
                                    <option value="Corporativo">Corporativo</option>
                                    <option value="Social">Social</option>
                                </select>
                            </div>
                            <div>
                                <label>Fecha del Evento *</label>
                                <input type="date" name="fecha_evento" value={formData.fecha_evento} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Número de invitados *</label>
                                <input type="number" name="num_personas" min="0" value={formData.num_personas} onChange={handleChange} placeholder="Ej: 100" required />
                            </div>
                            <div>
                                <label>Nombre del Festejado *</label>
                                <input type="text" name="nombre_festejado" value={formData.nombre_festejado} onChange={handleChange} placeholder="Nombre de quien celebra" required />
                            </div>
                        </div>

                        {/* 3. Servicios Adicionales */}
                        <div style={{ marginBottom: '4rem' }}>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Servicios Adicionales (Opcional)</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                {servicios.map(s => (
                                    <div
                                        key={s.id}
                                        onClick={() => handleServiceToggle(s.id)}
                                        style={{
                                            padding: '1.2rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            cursor: 'pointer',
                                            background: formData.servicios_adicionales.includes(s.id) ? '#f8fafc' : '#fff',
                                            transition: 'var(--transition)'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.servicios_adicionales.includes(s.id)}
                                            onChange={() => { }} // Handle on parent div
                                            style={{ width: '18px', cursor: 'pointer' }}
                                        />
                                        <span style={{ fontSize: '0.95rem' }}>{s.nombre}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 4. Notas */}
                        <div style={{ marginBottom: '3rem' }}>
                            <label>Notas adicionales</label>
                            <textarea
                                name="notas"
                                value={formData.notas}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Cuéntanos más sobre tu evento, preferencias especiales, etc. (máximo 500 caracteres)"
                                maxLength="500"
                            ></textarea>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{formData.notas.length}/500 caracteres</span>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-luxury"
                            style={{
                                width: '100%',
                                padding: '1.2rem',
                                fontSize: '1.1rem',
                                justifyContent: 'center',
                                background: loading ? '#94a3b8' : 'var(--accent)'
                            }}
                        >
                            {loading ? 'Procesando...' : 'Confirmar reserva'}
                        </button>
                    </form>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
};

export default Reservar;