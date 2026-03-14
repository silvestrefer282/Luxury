import React from 'react';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, 
    CalendarCheck, 
    Package, 
    Plus, 
    Utensils, 
    Image as ImageIcon, 
    FileText, 
    Star, 
    Users, 
    Settings, 
    UserCircle, 
    LogOut 
} from 'lucide-react';

const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin'] },
    { id: 'reservations', label: 'Reservaciones', icon: CalendarCheck, roles: ['admin', 'encargado'] },
    { id: 'packages', label: 'Paquetes', icon: Package, roles: ['admin'] },
    { id: 'adicionales', label: 'Adicionales', icon: Plus, roles: ['admin'] },
    { id: 'menus', label: 'Menús', icon: Utensils, roles: ['admin'] },
    { id: 'gallery', label: 'Galería', icon: ImageIcon, roles: ['admin'] },
    { id: 'contracts', label: 'Contratos', icon: FileText, roles: ['admin'] },
    { id: 'testimonios', label: 'Testimonios', icon: Star, roles: ['admin', 'encargado'] },
    { id: 'users', label: 'Usuarios / Roles', icon: Users, roles: ['admin'] },
    { id: 'settings', label: 'Configuración', icon: Settings, roles: ['admin'] },
];

const AdminSidebar = ({ activeTab, setActiveTab, userRole, onLogout }) => {
    return (
        <div className="w-80 h-screen bg-luxury-black text-luxury-white p-10 flex flex-col fixed left-0 top-0 border-r border-white/10 shadow-2xl z-[100]">
            <div className="mb-20">
                <h1 className="font-serif text-3xl uppercase tracking-widest italic font-light text-white">Luxury</h1>
                <span className="text-[10px] uppercase tracking-[0.4em] text-luxury-gray-light font-bold block mt-2">Panel de Control</span>
            </div>

            <nav className="flex-1 space-y-10 overflow-y-auto overflow-x-hidden pr-4 -mr-4 luxury-scrollbar-dark">
                {menuItems.filter(item => item.roles.includes(userRole)).map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-6 group transition-all duration-300 ${activeTab === item.id ? 'text-luxury-white' : 'text-luxury-gray-mid hover:text-white'
                            }`}
                    >
                        <div className={`p-3 transition-all duration-500 shadow-xl rounded-xl ${activeTab === item.id ? 'bg-white text-luxury-black' : 'bg-luxury-gray-dark text-luxury-gray-light group-hover:bg-luxury-white group-hover:text-luxury-black'}`}>
                            <item.icon size={18} />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">{item.label}</span>
                        {activeTab === item.id && (
                            <motion.div layoutId="sidebarActive" className="ml-auto w-1 h-8 bg-white" />
                        )}
                    </button>
                ))}
            </nav>

            <div className="mt-auto pt-10 border-t border-white/10 flex items-center gap-6">
                <div className="w-12 h-12 bg-luxury-gray-dark flex items-center justify-center border border-white/10 rounded-xl">
                    <UserCircle size={24} className="text-white/60" />
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold">{userRole}</p>
                    <button 
                        onClick={onLogout}
                        className="text-[9px] uppercase tracking-widest font-bold text-luxury-gray-mid hover:text-luxury-white transition-colors flex items-center gap-2 mt-1"
                    >
                        <LogOut size={12} /> Salir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
