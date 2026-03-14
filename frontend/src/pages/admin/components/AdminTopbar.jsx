import React from 'react';
import { Search, Plus, CalendarPlus, Settings } from 'lucide-react';

const AdminTopbar = ({ 
    activeTab, 
    searchTerm, 
    setSearchTerm, 
    userRole, 
    onAddClick 
}) => {
    const getTabTitle = () => {
        const item = {
            'dashboard': 'Dashboard Principal',
            'reservations': 'Registro de Reservas',
            'packages': 'Colección de Paquetes',
            'adicionales': 'Catálogo de Servicios',
            'menus': 'Curaduría Gastronómica',
            'gallery': 'Galería de Eventos',
            'contracts': 'Gestión de Contratos',
            'testimonios': 'Reseñas Editorial',
            'users': 'Gestión de Usuarios',
            'settings': 'Configuración'
        }[activeTab];
        return item || 'Panel';
    };

    const showSearch = ['reservations', 'packages', 'adicionales', 'menus', 'gallery'].includes(activeTab);

    return (
        <div className="flex justify-between items-center mb-16 relative">
            <div>
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-luxury-gray-mid block mb-4 italic">Sirlux Luxury Archive</span>
                <h2 className="text-6xl font-serif uppercase tracking-tight text-luxury-black">{getTabTitle()}</h2>
            </div>
            <div className="flex items-center gap-12">
                {showSearch && (
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-luxury-gray-mid group-hover:text-luxury-black transition-colors" size={16} />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar en el archivo..." 
                            className="bg-luxury-white/50 border-b-2 border-luxury-black/5 py-5 pl-16 pr-8 text-[11px] uppercase tracking-widest font-bold focus:border-luxury-black transition-all outline-none w-96 placeholder:text-luxury-gray-light" 
                        />
                    </div>
                )}
                
                {['packages', 'adicionales', 'menus', 'gallery', 'users'].includes(activeTab) && userRole === 'admin' && (
                    <button 
                        onClick={onAddClick}
                        className="p-5 bg-luxury-black text-luxury-white hover:bg-luxury-gray-dark transition-all duration-500 shadow-2xl flex items-center justify-center rounded-2xl group"
                    >
                        <Plus className="group-hover:rotate-90 transition-transform duration-500" size={24} />
                    </button>
                )}

                {activeTab === 'reservations' && userRole === 'admin' && (
                    <button 
                        onClick={onAddClick}
                        className="p-5 bg-luxury-black text-luxury-white hover:bg-luxury-gray-dark transition-all duration-500 shadow-2xl flex items-center justify-center rounded-2xl group gap-4 px-8"
                    >
                        <CalendarPlus size={20} />
                        <span className="text-[10px] uppercase tracking-widest font-bold">Nueva Reserva</span>
                    </button>
                )}

                <button className="p-5 bg-white border border-luxury-black/10 text-luxury-black hover:bg-luxury-black hover:text-white transition-all duration-500 shadow-xl rounded-2xl">
                    <Settings size={20} />
                </button>
            </div>
        </div>
    );
};

export default AdminTopbar;
