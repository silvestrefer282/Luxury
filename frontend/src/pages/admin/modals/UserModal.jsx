import React from 'react';
import { X, Save, UserPlus } from 'lucide-react';

const UserModal = ({
    isOpen,
    onClose,
    userForm,
    setUserForm,
    handleCreateUser
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-luxury-black/90 backdrop-blur-sm z-[110] overflow-y-auto flex p-4 sm:p-8 animate-in fade-in duration-500 custom-scrollbar">
            <div className="bg-luxury-white w-full max-w-2xl p-12 sm:p-16 h-fit shadow-2xl relative m-auto">
                <button 
                    onClick={onClose}
                    className="absolute top-8 right-8 text-luxury-black/50 hover:text-luxury-black transition-colors"
                >
                    <X size={24} />
                </button>
                
                <h2 className="text-4xl font-serif text-luxury-black mb-12 uppercase tracking-widest">
                    Añadir Usuario
                </h2>
                
                <form onSubmit={handleCreateUser} className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-black text-luxury-black mb-4">
                                Nombre
                            </label>
                            <input
                                required
                                value={userForm.first_name}
                                onChange={e => setUserForm({...userForm, first_name: e.target.value})}
                                className="w-full bg-transparent border-b-2 border-luxury-black/20 pb-4 text-sm font-sans placeholder:text-luxury-black/30 focus:border-luxury-black transition-colors outline-none"
                                placeholder="Ingresar nombre"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-black text-luxury-black mb-4">
                                Apellidos
                            </label>
                            <input
                                required
                                value={userForm.apellido_paterno}
                                onChange={e => setUserForm({...userForm, apellido_paterno: e.target.value})}
                                className="w-full bg-transparent border-b-2 border-luxury-black/20 pb-4 text-sm font-sans placeholder:text-luxury-black/30 focus:border-luxury-black transition-colors outline-none"
                                placeholder="Ingresar apellidos"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-black text-luxury-black mb-4">
                                Nombre de Usuario
                            </label>
                            <input
                                required
                                value={userForm.username}
                                onChange={e => setUserForm({...userForm, username: e.target.value})}
                                className="w-full bg-transparent border-b-2 border-luxury-black/20 pb-4 text-sm font-sans placeholder:text-luxury-black/30 focus:border-luxury-black transition-colors outline-none"
                                placeholder="Ej: admin_luxury"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-black text-luxury-black mb-4">
                                Correo Electrónico
                            </label>
                            <input
                                required
                                type="email"
                                value={userForm.email}
                                onChange={e => setUserForm({...userForm, email: e.target.value})}
                                className="w-full bg-transparent border-b-2 border-luxury-black/20 pb-4 text-sm font-sans placeholder:text-luxury-black/30 focus:border-luxury-black transition-colors outline-none"
                                placeholder="Ej: admin@sirlux.com"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-black text-luxury-black mb-4">
                                Contraseña
                            </label>
                            <input
                                required
                                type="password"
                                value={userForm.password}
                                onChange={e => setUserForm({...userForm, password: e.target.value})}
                                className="w-full bg-transparent border-b-2 border-luxury-black/20 pb-4 text-sm font-sans placeholder:text-luxury-black/30 focus:border-luxury-black transition-colors outline-none"
                                placeholder="Establecer contraseña"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-black text-luxury-black mb-4">
                                Privilegio / Rol
                            </label>
                            <select
                                required
                                value={userForm.rol}
                                onChange={e => setUserForm({...userForm, rol: e.target.value})}
                                className="w-full bg-transparent border-b-2 border-luxury-black/20 pb-4 text-sm font-sans focus:border-luxury-black transition-colors outline-none cursor-pointer"
                            >
                                <option value="Cliente">Cliente</option>
                                <option value="Encargado">Encargado</option>
                                <option value="Administrador">Administrador</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-12 flex justify-end gap-6">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-bold text-luxury-gray-mid hover:text-luxury-black transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            className="px-12 py-4 bg-luxury-black text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-luxury-gray-dark transition-all flex items-center gap-3 shadow-2xl"
                        >
                            <UserPlus size={16} /> Crear Usuario
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
