import React from 'react';
import { Wallet, Printer, Trash2 } from 'lucide-react';
import { generateContractPDF } from '../../../utils/pdfGenerator';
import { contratoService } from '../../../services/api';
import { logoB64 } from '../../../assets/logo_data';

const ContractsView = ({ 
    contracts, 
    reservas, 
    fetchData,
    setSelectedContractForPayments,
    searchTerm,
    normalizeText,
    contractFilter,
    setContractFilter
}) => {
    const states = ['Todos', 'Firmado', 'Pendiente'];

    const filteredContracts = contracts.filter(c => {
        const matchesSearch = !searchTerm || (
            normalizeText(String(c.folio)).includes(normalizeText(searchTerm)) || 
            normalizeText(c.cliente).includes(normalizeText(searchTerm))
        );
        const isFirmado = c.firmado ? 'Firmado' : 'Pendiente';
        const matchesState = contractFilter === 'Todos' || isFirmado === contractFilter;
        return matchesSearch && matchesState;
    });

    return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <div className="flex justify-start md:justify-end items-center mb-10 border-b border-luxury-black pb-8 overflow-x-auto">
            <div className="flex gap-4 min-w-max pb-2 md:pb-0">
                {states.map(state => (
                    <button
                        key={state}
                        onClick={() => setContractFilter(state)}
                        className={`text-[10px] uppercase tracking-[0.3em] font-bold px-8 py-3 border rounded-full transition-all duration-300 ${
                            contractFilter === state 
                                ? 'bg-luxury-black text-white border-luxury-black shadow-sm' 
                                : 'border-black/10 hover:border-black text-luxury-black/60 hover:text-luxury-black shadow-sm'
                        }`}
                    >
                        {state}
                    </button>
                ))}
            </div>
        </div>
        <div className="bg-white border border-luxury-black/5 shadow-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-luxury-black/10 bg-luxury-white/50">
                        <th className="py-10 px-4 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid">Folio</th>
                        <th className="py-10 px-4 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid">Cliente</th>
                        <th className="py-10 px-4 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid">Fecha Evento</th>
                        <th className="py-10 px-4 text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid text-center">Estado</th>
                        <th className="py-10 px-4 text-right text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid">Inversión</th>
                        <th className="py-10 px-4 text-right text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid">Saldo</th>
                        <th className="py-10 px-4 text-right text-[10px] uppercase tracking-[0.4em] font-bold text-luxury-gray-mid">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-luxury-black/5">
                    {filteredContracts.map((c) => (
                        <tr key={c.id} className="group hover:bg-luxury-black transition-all duration-700">
                            <td className="py-12 px-4 text-xl font-serif text-luxury-black group-hover:text-white whitespace-nowrap">{c.folio}</td>
                            <td className="py-12 px-4 min-w-[180px]">
                                <p className="text-[12px] uppercase tracking-[0.1em] font-bold text-luxury-black mb-1 font-serif group-hover:text-white">{c.cliente}</p>
                            </td>
                            <td className="py-12 px-4 text-sm font-light text-luxury-gray-mid group-hover:text-luxury-gray-light/60 whitespace-nowrap">{c.fecha}</td>
                            <td className="py-12 px-4 text-center whitespace-nowrap">
                                <span className={`text-[9px] uppercase tracking-[0.4em] font-black px-5 py-2 transition-all duration-500 ${
                                    c.firmado ? 'bg-luxury-black text-luxury-white group-hover:bg-white group-hover:text-luxury-black' : 'bg-luxury-white border border-black/10 text-black/40 group-hover:bg-white/10 group-hover:text-white'
                                }`}>
                                    {c.firmado ? 'Firmado' : 'Pendiente'}
                                </span>
                            </td>
                            <td className="py-12 px-4 text-right text-2xl font-serif font-light tracking-tighter text-luxury-black group-hover:text-white whitespace-nowrap">${Number(c.total).toLocaleString()}</td>
                            <td className="py-12 px-4 text-right text-2xl font-serif font-bold tracking-tighter text-red-600 group-hover:text-red-400 whitespace-nowrap">${Number(c.saldo_pendiente).toLocaleString()}</td>
                            <td className="py-12 px-4 text-right flex justify-end gap-3">
                                <button 
                                    onClick={() => setSelectedContractForPayments(c)}
                                    className="p-4 border border-luxury-black/5 text-luxury-black hover:bg-luxury-black hover:text-white transition-all group-hover:bg-white/10 group-hover:text-white group-hover:hover:bg-luxury-black rounded-xl"
                                    title="Gestionar Abonos"
                                >
                                    <Wallet size={16} />
                                </button>
                                <button 
                                    onClick={() => {
                                        const resData = reservas.find(r => r.id === c.reserva_id);
                                        generateContractPDF(c, resData, logoB64);
                                    }}
                                    className="p-4 border border-luxury-black/5 text-luxury-black hover:bg-luxury-black hover:text-white transition-all group-hover:bg-white/10 group-hover:text-white group-hover:hover:bg-luxury-black rounded-xl"
                                    title="Imprimir Contrato"
                                >
                                    <Printer size={16} />
                                </button>
                                <button onClick={async () => {
                                    if(window.confirm("¿Eliminar este contrato?")) {
                                        await contratoService.delete(c.id);
                                        fetchData();
                                    }
                                }} className="p-4 border border-luxury-black/5 text-luxury-black hover:bg-red-600 hover:text-white transition-all group-hover:bg-white/10 group-hover:text-white group-hover:hover:bg-red-600 rounded-xl"><Trash2 size={16} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    );
};

export default ContractsView;
