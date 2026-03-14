import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { reservacionService } from '../services/api';

// Mover hoy fuera para evitar re-creación constante
const today = new Date();
today.setHours(0, 0, 0, 0);

const Disponibilidad = () => {
    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [bookedDates, setBookedDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const fetchReservations = async () => {
            setLoading(true);
            try {
                const response = await reservacionService.getAll();
                const mapped = response.data
                    .filter(res => res.estado !== 'Cancelada')
                    .map(res => {
                        const [year, month, day] = res.fecha.split('-').map(Number);
                        return {
                            day: day,
                            month: month - 1,
                            year: year,
                            type: res.estado === 'Confirmada' ? 'booked' : 'pending',
                            label: res.nombre_evento || 'Evento Reservado'
                        };
                    });
                setBookedDates(mapped);
            } catch (error) {
                console.error("Error fetching availability:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReservations();
    }, []);

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const handlePrevMonth = () => {
        setDirection(-1);
        setCurrentDate(prev => {
            const next = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
            const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            return next >= currentMonthStart ? next : prev;
        });
    };

    const handleNextMonth = () => {
        setDirection(1);
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const isDateBooked = (day) => {
        return bookedDates.find(d =>
            d.day === day &&
            d.month === currentDate.getMonth() &&
            d.year === currentDate.getFullYear()
        );
    };

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 40 : -40,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            x: direction < 0 ? 40 : -40,
            opacity: 0
        })
    };

    const renderCalendar = () => {
        if (loading) {
            return (
                <div className="col-span-7 py-40 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm">
                    <div className="w-12 h-12 border-t-2 border-black rounded-full animate-spin mb-6"></div>
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-black/40">Sincronizando Agenda Luxury...</span>
                </div>
            );
        }

        const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
        const startDay = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
        const calendarDays = [];

        for (let i = 0; i < startDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="h-40 border-b border-r border-black/5 bg-gray-50/10"></div>);
        }

        for (let d = 1; d <= totalDays; d++) {
            const booking = isDateBooked(d);
            const dateInCalendar = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
            const isPast = dateInCalendar < today;

            calendarDays.push(
                <div 
                    key={d} 
                    className={`h-40 border-b border-r border-black/5 relative group p-6 transition-all ${
                        isPast ? 'bg-transparent opacity-40' : 'hover:bg-black/5 cursor-pointer'
                    }`}
                >
                    <span className={`text-xl font-serif ${booking ? 'opacity-20' : 'opacity-100'}`}>{d}</span>

                    {booking && (
                        <div className="absolute inset-x-2 inset-y-2 flex flex-col items-center justify-center">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`w-full h-full ${booking.type === 'pending' ? 'bg-black/5 border border-black/10' : 'bg-black'} flex flex-col items-center justify-center text-center p-4 shadow-xl overflow-hidden`}
                            >
                                <span className={`text-[8px] uppercase tracking-[0.3em] font-black mb-1 ${booking.type === 'pending' ? 'text-black/60' : 'text-white'}`}>
                                    {booking.type === 'pending' ? 'En Proceso' : 'Confirmado'}
                                </span>
                                <span className={`text-[9px] font-serif italic truncate w-full ${booking.type === 'pending' ? 'text-black/30' : 'text-white/40'}`}>
                                    {booking.label}
                                </span>
                            </motion.div>
                        </div>
                    )}

                    {!booking && !isPast && (
                        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <CheckCircle2 size={16} className="text-black/10" />
                        </div>
                    )}
                </div>
            );
        }

        return calendarDays;
    };

    return (
        <div className="bg-[#fcfcfc] min-h-screen pt-32">
            <Navbar />

            <div className="container mx-auto px-10 mb-32">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-20 border-b border-black pb-20">
                    <div className="max-w-2xl">
                        <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-black/40 block mb-6 px-4 border-l-2 border-black inline-block">Disponibilidad Luxury</span>
                        <h1 className="text-7xl md:text-8xl font-serif uppercase tracking-tighter">Event <br /><span className="italic font-light opacity-60">Calendar</span></h1>
                    </div>

                    <div className="flex flex-col items-end gap-6 text-right">
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 max-w-xs leading-loose">
                            Consulte las fechas disponibles para su próximo evento editorial en nuestro recinto exclusivo.
                        </p>
                        <div className="flex gap-10 text-[9px] uppercase tracking-widest font-black">
                            <div className="flex items-center gap-3"><div className="w-2 h-2 bg-black"></div> Reservado</div>
                            <div className="flex items-center gap-3"><div className="w-2 h-2 bg-black/5 border border-black/10"></div> En Proceso</div>
                            <div className="flex items-center gap-3"><div className="w-2 h-2 border border-black/10"></div> Disponible</div>
                        </div>
                    </div>
                </div>

                {/* Single Month View with Navigation */}
                <div className="bg-white border-t border-l border-black/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden">
                    {/* Navigation */}
                    <div className="flex justify-between items-center p-12 border-b border-black/5 bg-white relative z-20">
                        <button 
                            onClick={handlePrevMonth} 
                            className={`w-14 h-14 flex items-center justify-center transition-all border border-black/5 rounded-full ${
                                currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()
                                ? 'opacity-0 pointer-events-none' 
                                : 'hover:bg-black hover:text-white cursor-pointer'
                            }`}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.h2 
                                key={currentDate.getMonth()}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: 'spring', damping: 80, stiffness: 1000 }}
                                className="text-5xl font-serif uppercase tracking-widest italic"
                            >
                                {monthNames[currentDate.getMonth()]} <span className="not-italic font-light opacity-30">{currentDate.getFullYear()}</span>
                            </motion.h2>
                        </AnimatePresence>
                        <button onClick={handleNextMonth} className="w-14 h-14 flex items-center justify-center hover:bg-black hover:text-white transition-all border border-black/5 rounded-full">
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentDate.getMonth() + '-' + currentDate.getFullYear()}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: 'spring', damping: 80, stiffness: 1000 }}
                        >
                            {/* Weekdays */}
                            <div className="grid grid-cols-7 text-center border-b border-black/5 bg-gray-50/30">
                                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
                                    <div key={d} className="py-8 text-[11px] uppercase tracking-[0.6em] font-black text-black/30 border-r border-black/5 last:border-r-0">
                                        {d}
                                    </div>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 border-r border-black/5">
                                {renderCalendar()}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Reservation Call to Action */}
                <div className="mt-40 max-w-4xl mx-auto text-center border border-black/5 p-20 bg-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
                    <div className="relative z-10 transition-colors duration-500 group-hover:text-white">
                        <span className="text-[10px] uppercase tracking-[0.5em] font-bold opacity-40 block mb-6">Planifique hoy</span>
                        <h3 className="text-5xl font-serif italic mb-10">¿Encontró su fecha ideal?</h3>
                        <p className="text-[11px] uppercase tracking-[0.3em] font-medium mb-12 opacity-60">Inicie su proceso de reserva exclusiva para asegurar el recinto bajo los estándares LUXURY.</p>
                        <button className="px-16 py-6 border border-black/10 group-hover:border-white/20 text-[10px] uppercase tracking-[0.5em] font-black transition-all hover:bg-white hover:text-black">
                            Iniciar Reserva
                        </button>
                    </div>
                    {/* Background visual element */}
                    <CalendarIcon size={300} className="absolute -bottom-20 -right-20 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" />
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Disponibilidad;
