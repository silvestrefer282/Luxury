import React from 'react';
import { Printer, FileCheck, X } from 'lucide-react';
import { generateContractPDF } from '../../../utils/pdfGenerator';

const ReservationsView = ({ 
    reservas, 
    reservaFilter, 
    setReservaFilter, 
    searchTerm, 
    normalizeText,
    contracts,
    setSelectedReservationForContract,
    handleCancelReservation,
    userRole
}) => (
    <div className="space-y-16 animate-in fade-in slide-in-from-right-5 duration-700">
        <div className="flex justify-end items-end mb-16 border-b-2 border-luxury-black pb-12">
            <div className="flex gap-4">
                {['Todas', 'Confirmadas', 'Pendientes', 'Canceladas']
                    .filter(f => userRole !== 'encargado' || f !== 'Canceladas')
                    .map(f => (
                    <button 
                        key={f} 
                        onClick={() => setReservaFilter(f)}
                        className={`text-[10px] uppercase tracking-[0.3em] font-bold px-8 py-3 border rounded-full transition-all duration-500 shadow-sm ${
                            reservaFilter === f 
                            ? 'bg-luxury-black text-luxury-white border-luxury-black' 
                            : 'border-luxury-black/5 hover:bg-luxury-black hover:text-luxury-white hover:border-luxury-black'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>

        <div className="bg-white border border-luxury-black/5 shadow-2xl overflow-hidden group/table">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-luxury-black/10 bg-luxury-white/50">
                        <th className="py-10 px-8 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid italic">ID</th>
                        <th className="py-10 px-8 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid">Cliente / Evento</th>
                        <th className="py-10 px-8 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid">Fecha</th>
                        <th className="py-10 px-8 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid">Paquete</th>
                        <th className="py-10 px-8 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid">Estado</th>
                        <th className="py-10 px-8 text-right text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid">Inversión</th>
                        <th className="py-10 px-8 text-right text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid">Ajustes</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-luxury-black/5">
                    {reservas
                        .filter(res => {
                            if (userRole === 'encargado' && res.estado === 'Cancelada') return false;
                            const matchesStatus = reservaFilter === 'Todas' || res.estado === reservaFilter.slice(0, -1) || res.estado === reservaFilter;
                            const s = normalizeText(searchTerm);
                            const matchesSearch = 
                                normalizeText(res.cliente).includes(s) ||
                                normalizeText(res.fecha).includes(s) ||
                                normalizeText(res.paquete).includes(s);
                            return matchesStatus && matchesSearch;
                        })
                        .map((res) => (
                        <tr key={res.id} className="group hover:bg-luxury-black transition-all duration-700">
                            <td className="py-12 px-8 text-2xl font-serif text-luxury-black opacity-10 group-hover:opacity-100 transition-opacity">#{res.id}</td>
                            <td className="py-12 px-8">
                                <p className="text-[12px] uppercase tracking-[0.1em] font-bold text-luxury-black mb-1 font-serif group-hover:text-white">{res.cliente}</p>
                                <span className="text-[9px] uppercase tracking-widest text-luxury-gray-mid font-bold group-hover:text-luxury-gray-light">{res.invitados} Invitados</span>
                            </td>
                            <td className="py-12 px-8 text-sm font-light text-luxury-gray-mid group-hover:text-luxury-gray-light/60">{res.fecha}</td>
                            <td className="py-12 px-8 text-[10px] uppercase tracking-[0.3em] font-bold text-luxury-gray-dark group-hover:text-white">{res.paquete}</td>
                            <td className="py-12 px-8">
                                <span className={`text-[9px] uppercase tracking-[0.4em] font-black px-5 py-2 transition-all duration-500 rounded-lg ${
                                    res.estado === 'Confirmada' ? 'bg-luxury-black text-luxury-white group-hover:bg-white group-hover:text-luxury-black' :
                                    res.estado === 'Pendiente' ? 'bg-luxury-white border border-luxury-black/10 text-luxury-gray-mid group-hover:bg-white/10 group-hover:text-white' :
                                    'bg-red-50 text-red-900/40 border border-red-100 group-hover:bg-red-900/20 group-hover:text-red-500'
                                }`}>
                                    {res.estado}
                                </span>
                            </td>
                            <td className="py-12 px-8 text-right text-3xl font-serif font-light tracking-tighter text-luxury-black group-hover:text-white">{res.total}</td>
                             <td className="py-12 px-8 text-right flex justify-end gap-4">
                                {userRole !== 'encargado' && (
                                    <>
                                        {contracts.find(c => c.reserva_id === res.id) ? (
                                            <button 
                                                onClick={() => {
                                                    const contract = contracts.find(c => c.reserva_id === res.id);
                                                    generateContractPDF(contract, res);
                                                }}
                                                className="p-4 border border-luxury-black/5 text-luxury-black hover:bg-luxury-black hover:text-white transition-all group-hover:bg-white/10 group-hover:text-white group-hover:hover:bg-luxury-black rounded-xl"
                                                title="Imprimir Contrato"
                                            >
                                                <Printer size={16} />
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => setSelectedReservationForContract(res)}
                                                className="p-4 border border-luxury-black/5 text-luxury-black hover:bg-luxury-black hover:text-white transition-all group-hover:bg-white/10 group-hover:text-white group-hover:hover:bg-luxury-black rounded-xl"
                                                title="Generar Contrato"
                                            >
                                                <FileCheck size={16} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleCancelReservation(res.id)}
                                            className="p-4 border border-luxury-black/5 text-luxury-black hover:bg-red-600 hover:text-white transition-all group-hover:bg-white/10 group-hover:text-white group-hover:hover:bg-red-600 rounded-xl"
                                            title="Anular Reserva"
                                        >
                                            <X size={16} />
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="bg-luxury-white/50 p-10 flex justify-center text-[10px] uppercase tracking-[0.6em] font-bold text-luxury-gray-light border-t border-luxury-black/5 group-hover/table:text-luxury-black transition-colors">
                Fin del registro editorial de reservas
            </div>
        </div>
    </div>
);

export default ReservationsView;
