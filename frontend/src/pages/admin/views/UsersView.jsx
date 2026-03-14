import React from 'react';
import { Trash2 } from 'lucide-react';

const UsersView = ({ 
    usersList, 
    handleUpdateUserRole, 
    handleToggleUserStatus, 
    handleDeleteUser 
}) => (
    <div className="animate-in fade-in slide-in-from-right-5 duration-700">
        <div className="grid gap-8">
            {usersList.map((usr) => (
                <div key={usr.id} className="bg-white border border-luxury-black/5 p-12 hover:shadow-2xl transition-all rounded-3xl group flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-6">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-black ${
                                usr.estatus ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                            }`}>
                                {usr.estatus ? 'Activo' : 'Inactivo'}
                            </span>
                            <span className="text-[9px] uppercase tracking-widest font-black bg-luxury-black text-white px-4 py-1.5 rounded-full">
                                {usr.rol}
                            </span>
                        </div>
                        <h3 className="text-3xl font-serif text-luxury-black mb-2">{usr.first_name} {usr.apellido_paterno}</h3>
                        <p className="text-sm text-luxury-gray-mid mb-4">{usr.email}</p>
                        <div className="flex gap-4 text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">
                            <span className="font-mono">ID: {usr.id}</span>
                            <span className="font-mono">User: {usr.username}</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <select 
                            value={usr.rol}
                            onChange={(e) => handleUpdateUserRole(usr.id, e.target.value)}
                            className="px-6 py-4 border border-luxury-black/10 text-[9px] uppercase tracking-widest font-black rounded-xl bg-transparent outline-none focus:border-luxury-black transition-all cursor-pointer"
                        >
                            <option value="Administrador">Administrador</option>
                            <option value="Encargado">Encargado</option>
                            <option value="Cliente">Cliente</option>
                        </select>
                        <button 
                            onClick={() => handleToggleUserStatus(usr.id, !usr.estatus)}
                            className={`px-8 py-4 text-[9px] uppercase tracking-[0.3em] font-black transition-all rounded-xl border ${
                                usr.estatus ? 'border-red-100 text-red-600 hover:bg-red-50' : 'border-green-100 text-green-600 hover:bg-green-50'
                            }`}
                        >
                            {usr.estatus ? 'Desactivar' : 'Activar'}
                        </button>
                        <button 
                            onClick={() => handleDeleteUser(usr.id)}
                            className="px-6 py-4 border border-red-50 text-red-600 hover:bg-red-50 transition-all rounded-xl"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default UsersView;
