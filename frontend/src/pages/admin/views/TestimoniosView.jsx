import React from 'react';
import { Star } from 'lucide-react';

const TestimoniosView = ({ 
    testimonios, 
    handleApproveTestimonio, 
    handleDeleteTestimonio,
    userRole
}) => (
    <div className="animate-in fade-in slide-in-from-right-5 duration-700">
        <div className="grid gap-8">
            {testimonios.map((testimonio) => (
                <div key={testimonio.id} className="bg-white border border-luxury-black/5 p-12 hover:shadow-2xl transition-all rounded-3xl group flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-6">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-black ${
                                testimonio.aprobado ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                                {testimonio.aprobado ? 'Publicado' : 'Pendiente de Aprobación'}
                            </span>
                            <div className="flex gap-1 text-[#D4AF37]">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} fill={i < testimonio.calificacion ? "#D4AF37" : "transparent"} />
                                ))}
                            </div>
                        </div>
                        <p className="text-xl font-serif italic text-luxury-black mb-6">"{testimonio.comentario}"</p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-luxury-black rounded-full flex items-center justify-center text-[10px] text-white font-bold uppercase">
                                {testimonio.cliente_nombre?.charAt(0)}
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest font-black text-luxury-black">{testimonio.cliente_nombre} {testimonio.cliente_apellido}</p>
                                <p className="text-[9px] uppercase tracking-widest text-luxury-gray-mid">Invitado Luxury</p>
                            </div>
                        </div>
                    </div>
                    {userRole !== 'encargado' && (
                        <div className="flex gap-4">
                            {!testimonio.aprobado && (
                                <button 
                                    onClick={() => handleApproveTestimonio(testimonio.id)}
                                    className="px-8 py-4 bg-luxury-black text-white text-[9px] uppercase tracking-[0.3em] font-black hover:bg-luxury-gray-dark transition-all rounded-xl shadow-lg"
                                >
                                    Aprobar
                                </button>
                            )}
                            <button 
                                onClick={() => handleDeleteTestimonio(testimonio.id)}
                                className="px-8 py-4 border border-red-100 text-red-600 text-[9px] uppercase tracking-[0.3em] font-black hover:bg-red-50 transition-all rounded-xl"
                            >
                                Eliminar
                            </button>
                        </div>
                    )}
                </div>
            ))}
            {testimonios.length === 0 && (
                <div className="py-40 text-center border-2 border-dashed border-black/5 rounded-3xl">
                    <p className="text-sm font-serif italic text-luxury-gray-mid">
                        {userRole === 'encargado' ? 'Aún no hay reseñas de eventos finalizados.' : 'Aún no hay reseñas de clientes para moderar.'}
                    </p>
                </div>
            )}
        </div>
    </div>
);

export default TestimoniosView;
