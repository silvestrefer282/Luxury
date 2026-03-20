import React from 'react';
import { 
    Users, 
    CalendarCheck, 
    Clock, 
    TrendingUp 
} from 'lucide-react';

const DashboardView = ({ reservas, clients }) => {
    const totalClientes = clients ? clients.length : 0;
    const totalReservas = reservas ? reservas.length : 0;
    const reservasPendientes = reservas ? reservas.filter(r => r.estado === 'Pendiente').length : 0;
    
    // Calculates actual revenue from all reservations marked 'Confirmada' or 'Finalizada' or from total
    const ingresos = reservas ? reservas.reduce((acc, r) => {
        if (!r.total) return acc;
        // Parse "$157,000" or similar
        const num = parseFloat(r.total.replace(/[\$,]/g, ''));
        return acc + (!isNaN(num) ? num : 0);
    }, 0) : 0;
    
    const formattedIngresos = `$${ingresos.toLocaleString('en-US')}`;

    const handleExportCSV = () => {
        if (!reservas || reservas.length === 0) return;

        const headers = ['ID', 'Cliente', 'Email', 'Paquete', 'Invitados', 'Fecha Evento', 'Hora Inicio', 'Hora Fin', 'Estado', 'Total Estimado'];
        
        const rows = reservas.map(res => [
            res.id,
            `"${res.cliente || ''}"`,
            `"${res.email || ''}"`,
            `"${res.paquete || ''}"`,
            res.invitados || 0,
            res.fecha || '',
            res.hora_inicio || '',
            res.hora_fin || '',
            res.estado || '',
            `"${res.total || ''}"`
        ]);

        const csvContent = headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        // Añadir BOM (Byte Order Mark) para que Excel reconozca correctamente los acentos y caracteres especiales UTF-8
        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' }); 
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Reporte_Maestro_Reservas_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-24 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            {/* Stats Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {[
                    { label: 'Total Clientes', val: totalClientes, icon: Users, color: 'text-luxury-black' },
                    { label: 'Total Reservas', val: totalReservas, icon: CalendarCheck, color: 'text-luxury-black' },
                    { label: 'Reservas Pendientes', val: reservasPendientes, icon: Clock, color: 'text-luxury-black' },
                    { label: 'Ingresos Estimados', val: formattedIngresos, icon: TrendingUp, color: 'text-luxury-black' },
                ].map((stat, i) => (
                    <div key={i} className="p-10 border border-luxury-black/5 bg-white group hover:bg-luxury-black transition-all duration-700 shadow-sm hover:shadow-2xl rounded-3xl flex flex-col items-center">
                        <div className="flex justify-between items-start mb-6 w-full">
                            <stat.icon size={18} className="text-luxury-black opacity-30 group-hover:opacity-100 group-hover:text-white transition-all duration-500" />
                            <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-luxury-gray-light group-hover:text-luxury-gray-mid transition-colors">Luxury Metrics</span>
                        </div>
                        <p className="text-5xl font-serif mb-4 leading-none text-luxury-black group-hover:text-white transition-colors text-center w-full">{stat.val}</p>
                        <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid group-hover:text-white transition-all text-center max-w-[80%] mx-auto">{stat.label}</h4>
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
                <button 
                    onClick={handleExportCSV}
                    className="text-[10px] uppercase tracking-[0.4em] font-bold border-b-2 border-luxury-black pb-3 text-luxury-black hover:opacity-50 transition-all duration-300"
                >
                    Exportar Reporte Maestro
                </button>
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
};

export default DashboardView;
