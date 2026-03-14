import React from 'react';
import { 
    Users, 
    CalendarCheck, 
    Clock, 
    TrendingUp 
} from 'lucide-react';

const DashboardView = ({ reservas }) => (
    <div className="space-y-24 animate-in fade-in slide-in-from-bottom-5 duration-1000">
        {/* Stats Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
                { label: 'Total Clientes', val: '24', icon: Users, color: 'text-luxury-black' },
                { label: 'Total Reservas', val: '12', icon: CalendarCheck, color: 'text-luxury-black' },
                { label: 'Reservas Pendientes', val: '0', icon: Clock, color: 'text-luxury-black' },
                { label: 'Ingresos Estimados', val: '$157,000', icon: TrendingUp, color: 'text-luxury-black' },
            ].map((stat, i) => (
                <div key={i} className="p-10 border border-luxury-black/5 bg-white group hover:bg-luxury-black transition-all duration-700 shadow-sm hover:shadow-2xl rounded-3xl">
                    <div className="flex justify-between items-start mb-10">
                        <stat.icon size={18} className="text-luxury-black opacity-30 group-hover:opacity-100 group-hover:text-white transition-all duration-500" />
                        <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-luxury-gray-light group-hover:text-luxury-gray-mid transition-colors">Luxury Metrics</span>
                    </div>
                    <p className="text-5xl font-serif mb-4 leading-none text-luxury-black group-hover:text-white transition-colors">{stat.val}</p>
                    <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid group-hover:text-white transition-all">{stat.label}</h4>
                </div>
            ))}
        </div>

        {/* Recent Reservations Table */}
        <div className="p-20 border border-luxury-black/5 bg-white shadow-xl overflow-hidden relative group/table rounded-3xl">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover/table:opacity-[0.07] transition-opacity duration-1000">
                <TrendingUp size={200} className="text-luxury-black" />
            </div>
            
            <div className="flex justify-between items-end mb-20 px-2 relative z-10">
                <div>
                    <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-luxury-gray-mid block mb-4 italic">Bitácora Editorial</span>
                    <h2 className="text-6xl font-serif uppercase tracking-tight text-luxury-black">Reservas <span className="italic font-light text-luxury-gray-mid">Recientes</span></h2>
                </div>
                <button className="text-[10px] uppercase tracking-[0.4em] font-bold border-b-2 border-luxury-black pb-3 text-luxury-black hover:opacity-50 transition-all duration-300">Exportar Reporte Maestro</button>
            </div>
            
            <div className="overflow-x-auto relative z-10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-luxury-black/10">
                            <th className="pb-10 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid px-6 italic">Cliente / Identificación</th>
                            <th className="pb-10 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid px-6">Tipo de Evento</th>
                            <th className="pb-10 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid px-6">Fecha Evento</th>
                            <th className="pb-10 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid px-6 text-center">Estado</th>
                            <th className="pb-10 text-right text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid px-6">Inversión</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-luxury-black/5">
                        {reservas.slice(0, 5).map((res) => (
                            <tr key={res.id} className="group hover:bg-luxury-black transition-all duration-700">
                                <td className="py-12 px-6">
                                    <p className="text-[12px] uppercase tracking-[0.1em] font-bold mb-1 font-serif text-luxury-black group-hover:text-white">{res.cliente}</p>
                                    <span className="text-[9px] uppercase tracking-widest text-luxury-gray-mid font-bold group-hover:text-luxury-gray-light">{res.email}</span>
                                </td>
                                <td className="py-12 px-6">
                                    <span className="text-[11px] uppercase tracking-widest text-luxury-gray-dark font-medium group-hover:text-luxury-gray-light">{res.paquete}</span>
                                </td>
                                <td className="py-12 px-6 text-xs font-light text-luxury-gray-mid group-hover:text-luxury-gray-light/50">{res.fecha}</td>
                                <td className="py-12 px-6 text-center">
                                    <span className={`text-[9px] uppercase tracking-[0.4em] font-black px-5 py-2.5 border-2 transition-all duration-500 ${
                                        res.estado === 'Cancelada' 
                                        ? 'bg-transparent border-red-900/10 text-red-900/40 group-hover:border-red-900 group-hover:text-red-500' 
                                        : 'bg-luxury-black border-luxury-black text-luxury-white group-hover:bg-white group-hover:border-white group-hover:text-black'
                                    }`}>
                                        {res.estado}
                                    </span>
                                </td>
                                <td className="py-12 px-6 text-right">
                                    <span className="text-3xl font-serif font-light tracking-tighter text-luxury-black group-hover:text-white">{res.total}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-16 flex justify-center border-t border-luxury-black/5 pt-12">
                <button className="text-[10px] uppercase tracking-[0.8em] font-bold text-luxury-gray-light hover:text-luxury-black transition-all duration-[1000ms] cursor-pointer">Ver historial completo de operaciones</button>
            </div>
        </div>
    </div>
);

export default DashboardView;
