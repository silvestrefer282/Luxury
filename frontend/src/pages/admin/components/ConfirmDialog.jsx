import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText, type = 'confirm' }) => {
    const [promptValue, setPromptValue] = useState('');

    useEffect(() => {
        if (isOpen) setPromptValue('');
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[10000] bg-luxury-black/95 backdrop-blur-xl flex items-center justify-center p-10"
                >
                    <motion.div 
                        initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}
                        className="bg-white max-w-md w-full p-16 shadow-[0_0_100px_rgba(0,0,0,0.4)] relative border border-luxury-black/5 rounded-3xl"
                    >
                        <span className="text-[10px] uppercase tracking-[0.6em] font-bold text-black/30 block mb-6 px-1 border-l-2 border-luxury-black font-sans">Aviso Editorial</span>
                        <h2 className="text-4xl font-serif uppercase tracking-tight mb-8 text-luxury-black leading-tight">{title}</h2>
                        <p className="text-[13px] font-light text-luxury-gray-mid leading-relaxed mb-10 italic font-serif opacity-80">"{message}"</p>
                        
                        {type === 'prompt' && (
                            <input 
                                autoFocus
                                value={promptValue} 
                                onChange={(e) => setPromptValue(e.target.value)} 
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onConfirm(promptValue);
                                    }
                                }}
                                className="w-full bg-transparent border-b-2 border-luxury-black/10 py-4 mb-12 text-[14px] uppercase tracking-widest font-bold focus:border-luxury-black transition-all outline-none text-center" 
                                placeholder="Escribe aquí..."
                            />
                        )}

                        <div className="flex gap-4">
                            {(type === 'confirm' || type === 'prompt') && (
                                <button 
                                    onClick={onCancel}
                                    className="flex-1 py-5 border border-luxury-black text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-black hover:bg-luxury-white/50 transition-all rounded-2xl"
                                >
                                    Cancelar
                                </button>
                            )}
                            <button 
                                onClick={() => {
                                    if (type === 'prompt') onConfirm(promptValue);
                                    else onConfirm();
                                }}
                                className={`flex-1 py-5 text-luxury-white text-[10px] uppercase tracking-[0.4em] font-bold shadow-2xl transition-all border rounded-2xl ${
                                    confirmText === 'Eliminar' || confirmText === 'Anular'
                                    ? 'bg-red-700 border-red-700 hover:bg-red-800' 
                                    : 'bg-luxury-black border-luxury-black hover:bg-luxury-gray-dark'
                                }`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmDialog;
