import React from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo_luxury_contract.jpg';

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-24 pb-14 px-6 border-t border-white/10">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    
                    {/* LOGO */}
                    <div>
                        <img 
                            src={logo} 
                            alt="Luxury Logo" 
                            className="w-32 mb-4 opacity-90"
                        />

                        <p className="text-white/40 text-xs leading-relaxed max-w-xs">
                            Redefiniendo el arte de celebrar con exclusividad y refinamiento.
                        </p>
                    </div>

                    {/* EXPLORAR */}
                    <div>
                        <h4 className="text-[9px] uppercase tracking-[0.4em] font-bold mb-6 text-white/60">Explorar</h4>
                        <ul className="space-y-3 text-[10px] tracking-widest uppercase opacity-80">
                            <li><Link to="/bodas" className="hover:text-white transition">Bodas</Link></li>
                            <li><Link to="/banquetes" className="hover:text-white transition">Banquetes</Link></li>
                            <li><Link to="/menus" className="hover:text-white transition">Menús</Link></li>
                            <li><Link to="/disponibilidad" className="hover:text-white transition">Disponibilidad</Link></li>
                            <li><Link to="/ubicacion" className="hover:text-white transition">Ubicación</Link></li>
                        </ul>
                    </div>

                    {/* SERVICIOS */}
                    <div>
                        <h4 className="text-[9px] uppercase tracking-[0.4em] font-bold mb-6 text-white/60">Servicios</h4>
                        <ul className="space-y-3 text-[10px] tracking-widest uppercase opacity-80">
                            <li><Link to="/graduaciones" className="hover:text-white transition">Graduaciones</Link></li>
                            <li><Link to="/corporativos" className="hover:text-white transition">Corporativos</Link></li>
                            <li><Link to="/xv" className="hover:text-white transition">XV Años</Link></li>
                        </ul>
                    </div>

                    {/* CONTACTO */}
                    <div>
                        <h4 className="text-[9px] uppercase tracking-[0.4em] font-bold mb-6 text-white/60">Contacto</h4>

                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4">
                            
                            {/* MAPA */}
                            <div className="w-full h-32 rounded-lg overflow-hidden mb-4">
                                <iframe
                                    title="Mapa"
                                    src="https://www.google.com/maps?q=Calle+2+de+Abril+2503,+Colonia+El+Carmen,+Apizaco,+Tlaxcala&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                ></iframe>
                            </div>

                            {/* INFO */}
                            <div className="space-y-3 text-xs">

                                <div className="flex items-center gap-3">
                                    <MapPin size={14} />
                                    <span className="text-white/70">Apizaco, Tlaxcala</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Phone size={14} />
                                    <a href="tel:+522345678900" className="text-white/70 hover:text-white transition">
                                        +52 234 567 8900
                                    </a>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Mail size={14} />
                                    <a href="mailto:luxurysalonsocial@hotmail.com" className="text-white/70 hover:text-white transition">
                                        luxurysalonsocial@hotmail.com
                                    </a>
                                </div>

                            </div>

                            {/* REDES */}
                            <div className="flex gap-4 mt-4 pt-3 border-t border-white/10">
                                <a href="https://www.facebook.com/share/1CS5ZGyfQd/" target="_blank" rel="noopener noreferrer">
                                    <Facebook size={16} className="hover:opacity-70 transition" />
                                </a>
                                <a href="https://www.instagram.com/salon_luxury_apizaco" target="_blank" rel="noopener noreferrer">
                                    <Instagram size={16} className="hover:opacity-70 transition" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🔥 FOOTER FINAL MEJORADO */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/10 text-[10px] tracking-[0.3em] text-white/40">
                    
                    <span className="mb-4 md:mb-0 hover:text-white transition">
                        © 2024 Luxury
                    </span>

                    <div className="flex gap-8">
                        <Link to="/legal" className="hover:text-white transition">Legal</Link>
                        <Link to="/privacy" className="hover:text-white transition">Privacy</Link>
                        <Link to="/cookies" className="hover:text-white transition">Cookies</Link>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;