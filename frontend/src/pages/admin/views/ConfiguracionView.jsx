import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

const ConfiguracionView = ({ configForm, handleConfigChange, handleUpdateConfig }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto"
        >
            <div className="bg-white p-12 relative shadow-2xl border border-black/5">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-luxury-black text-white">
                        <Settings size={24} />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-black/40">
                        Ajustes Globales del Sistema
                    </span>
                </div>

                <h2 className="text-4xl font-serif uppercase tracking-tight mb-12">
                    Configuración <span className="italic font-light">Maestra</span>
                </h2>

                <form onSubmit={handleUpdateConfig} className="space-y-10">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Hora de Apertura</label>
                            <input 
                                name="hora_apertura" 
                                type="time"
                                required
                                value={configForm?.hora_apertura || ''} 
                                onChange={handleConfigChange}
                                className="w-full border-b border-black/10 py-3 px-2 focus:border-black outline-none font-serif text-xl transition-all" 
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Hora de Cierre</label>
                            <input 
                                name="hora_cierre" 
                                type="time"
                                required
                                value={configForm?.hora_cierre || ''} 
                                onChange={handleConfigChange}
                                className="w-full border-b border-black/10 py-3 px-2 focus:border-black outline-none font-serif text-xl transition-all" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Tiempo Limpieza (Horas)</label>
                            <input 
                                name="hora_limpieza" 
                                type="number"
                                min="0"
                                required
                                value={configForm?.hora_limpieza || ''} 
                                onChange={handleConfigChange}
                                className="w-full border-b border-black/10 py-3 px-2 focus:border-black outline-none font-serif text-xl transition-all" 
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Días Límite Cancelación</label>
                            <input 
                                name="dias_limite_cancelacion" 
                                type="number"
                                min="0"
                                required
                                value={configForm?.dias_limite_cancelacion || ''} 
                                onChange={handleConfigChange}
                                className="w-full border-b border-black/10 py-3 px-2 focus:border-black outline-none font-serif text-xl transition-all" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Anticipo Mínimo ($)</label>
                            <input 
                                name="anticipo_minimo" 
                                type="number"
                                min="0"
                                step="0.01"
                                required
                                value={configForm?.anticipo_minimo || ''} 
                                onChange={handleConfigChange}
                                className="w-full border-b border-black/10 py-3 px-2 focus:border-black outline-none font-serif text-xl transition-all" 
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-bold text-black/60">Precio Hora Extra ($)</label>
                            <input 
                                name="precio_hora_extra" 
                                type="number"
                                min="0"
                                step="0.01"
                                required
                                value={configForm?.precio_hora_extra || ''} 
                                onChange={handleConfigChange}
                                className="w-full border-b border-black/10 py-3 px-2 focus:border-black outline-none font-serif text-xl transition-all" 
                            />
                        </div>
                    </div>

                    <div className="pt-8">
                        <p className="text-[9px] text-black/40 italic mb-8">
                            * Estos valores afectan directamente el motor de reservas y los cálculos de contratos en tiempo real. 
                            Proceda con precaución.
                        </p>
                        <button type="submit" className="w-full bg-luxury-black text-white py-5 text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-luxury-gray-dark shadow-2xl transition-all">
                            Guardar Preferencias
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default ConfiguracionView;
