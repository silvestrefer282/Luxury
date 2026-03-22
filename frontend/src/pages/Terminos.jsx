import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, ScrollText } from 'lucide-react';

const TerminosModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop / Fondo oscuro */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Ventana Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header del Modal */}
            <div className="p-8 border-b border-black/5 flex justify-between items-center bg-white">
              <div className="flex items-center gap-4">
                <div className="w-8 h-[1px] bg-black" />
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-black/40">Legal • SIRLUX</span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Contenido con Scroll */}
            <div className="overflow-y-auto p-8 md:p-12 space-y-12 font-sans selection:bg-black selection:text-white">
              <header>
                <h1 className="text-4xl md:text-6xl font-serif uppercase tracking-tighter leading-none mb-6">
                  Términos <br/>
                  <span className="italic font-light opacity-60">& Condiciones</span>
                </h1>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/60">
                  Última actualización: Marzo 2026
                </p>
              </header>

              <div className="space-y-12">
                {/* Sección 01 */}
                <section className="grid md:grid-cols-3 gap-6">
                  <div className="text-[10px] uppercase tracking-[0.4em] font-black opacity-20 italic">01. Aceptación</div>
                  <div className="md:col-span-2 text-sm leading-relaxed text-black/80">
                    <p>El presente documento establece los términos y condiciones de uso del sistema <strong>SIRLUX</strong>. Al acceder y utilizar este sistema, el usuario acepta cumplir con las disposiciones aquí establecidas.</p>
                  </div>
                </section>

                {/* Sección 02 */}
                <section className="grid md:grid-cols-3 gap-6 border-t border-black/5 pt-8">
                  <div className="text-[10px] uppercase tracking-[0.4em] font-black opacity-20 italic">02. Propósito</div>
                  <div className="md:col-span-2 text-sm leading-relaxed text-black/80">
                    <p>SIRLUX está destinado exclusivamente para la administración de eventos, registro de clientes, selección de menús y gestión de fechas. Los usuarios se comprometen a proporcionar información verídica y actualizada.</p>
                  </div>
                </section>

                {/* Sección 03 */}
                <section className="grid md:grid-cols-3 gap-6 border-t border-black/5 pt-8">
                  <div className="text-[10px] uppercase tracking-[0.4em] font-black opacity-20 italic">03. Roles y Acceso</div>
                  <div className="md:col-span-2 text-sm leading-relaxed text-black/80 space-y-3">
                    <p><strong>Administrador:</strong> Control total de registros y modificaciones.</p>
                    <p><strong>Encargada:</strong> Acceso de consulta, calendario y testimonios sin posibilidad de modificar datos.</p>
                  </div>
                </section>

                {/* Sección 04 */}
                <section className="grid md:grid-cols-3 gap-6 border-t border-black/5 pt-8">
                  <div className="text-[10px] uppercase tracking-[0.4em] font-black opacity-20 italic">04. Disponibilidad</div>
                  <div className="md:col-span-2 text-sm leading-relaxed text-black/80">
                    <p>El sistema bloqueará fechas ocupadas automáticamente. No se garantiza disponibilidad continua por posibles mantenimientos técnicos o fallas externas de conexión.</p>
                  </div>
                </section>

                {/* Sección Final Luxury */}
                <section className="bg-black text-white p-10 rounded-[1.5rem] space-y-6">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-white/40" size={20} />
                    <span className="text-[10px] uppercase tracking-[0.5em] font-black">Declaración Final</span>
                  </div>
                  <p className="font-serif text-lg leading-relaxed opacity-90 italic">
                    "Al utilizar el sistema SIRLUX, el usuario declara haber leído, entendido y aceptado en su totalidad los presentes términos y condiciones."
                  </p>
                </section>
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="p-6 border-t border-black/5 bg-gray-50 flex justify-between items-center">
              
              {/* 🔥 BOTÓN PDF */}
              <a
                href="/terminos.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-widest font-bold underline hover:opacity-70"
              >
                Ver en PDF
              </a>

              <button 
                onClick={onClose}
                className="bg-black text-white px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold hover:bg-black/80 transition-all"
              >
                Entendido
              </button>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TerminosModal;