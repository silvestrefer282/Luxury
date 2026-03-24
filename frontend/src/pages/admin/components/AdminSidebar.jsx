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
    LogOut,
    X
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

const AdminSidebar = ({ activeTab, setActiveTab, userRole, onLogout, isOpen, setIsOpen }) => {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-[90] md:hidden backdrop-blur-sm" 
                    onClick={() => setIsOpen(false)}
                />
            )}
            
            <div className={`w-80 h-screen bg-luxury-black text-luxury-white p-10 flex flex-col fixed left-0 top-0 border-r border-white/10 shadow-2xl z-[100] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                
                {/* Mobile Close Button */}
                <button 
                    className="absolute top-10 right-10 text-white/50 hover:text-white md:hidden"
                    onClick={() => setIsOpen(false)}
                >
                    <X size={24} />
                </button>

                <div className="mb-20 flex items-center gap-4">
                    <img 
                        src="/images/logo.png" 
                        alt="LUXURY" 
                        className="h-10 w-auto object-contain brightness-0 invert" 
                    />
                    <div>
                        <h1 className="font-serif text-xl uppercase tracking-widest italic font-light text-white leading-none">Luxury</h1>
                        <span className="text-[8px] uppercase tracking-[0.4em] text-luxury-gray-light font-bold block mt-1">Panel de Control</span>
                    </div>
                </div>

            <nav className="flex-1 space-y-10 overflow-y-auto overflow-x-hidden pr-4 -mr-4 luxury-scrollbar-dark">
                {menuItems.filter(item => item.roles.includes(userRole)).map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            setActiveTab(item.id);
                            if (window.innerWidth < 768) setIsOpen(false);
                        }}
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
        </>
    );
};

export default AdminSidebar;
