import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { generateContractPDF } from '../../../utils/pdfGenerator';
import { logoB64, companyAddress, companyPhones } from '../../../assets/logo_data';

const ContractModal = ({
    isOpen,
    onClose,
    selectedReservation,
    contractForm,
    setContractForm,
    handleCreateContract,
    triggerAlert
}) => {
    if (!isOpen) return null;

    const handlePrint = async () => {
        try {
            await generateContractPDF(contractForm, selectedReservation, logoB64);
        } catch (error) {
            console.error("Error generating PDF:", error);
            if (triggerAlert) {
                triggerAlert("Error de Generación", "Hubo un problema al materializar el documento PDF. Intente de nuevo.");
            }
        }
    };

    const adicionales = selectedReservation?.servicios_adicionales || [];
    const resto = Number(contractForm.total_operacion) - Number(contractForm.anticipo_monto);

    const getFechaDetalle = (fechaStr) => {
        if (!fechaStr) return { d: '__', m: '_________', a: '____' };
        const d = new Date(fechaStr + 'T00:00:00');
        const months = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
        return { d: d.getUTCDate(), m: months[d.getUTCMonth()], a: d.getUTCFullYear() };
    };
    const fd = getFechaDetalle(selectedReservation?.fecha);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[5000] bg-black/95 overflow-y-auto"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 50 }} animate={{ scale: 1, y: 0 }}
                    className="mx-auto my-6 bg-white max-w-5xl w-full p-6 md:p-8 shadow-2xl relative rounded-sm border border-black"
                    id="printable-contract"
                >
                    <button onClick={onClose} className="absolute top-10 right-10 text-gray-400 hover:text-black print:hidden">
                        <X size={32} />
                    </button>

                    <div className="grid grid-cols-[1fr,1.5fr,1fr] items-center mb-2 gap-4">
                        <div className="flex justify-start">
                            <img src={logoB64} alt="Luxury Logo" className="h-24 object-contain" />
                        </div>
                        
                        <div className="text-center text-[11px] text-gray-800 leading-relaxed font-serif pt-2">
                            <p>{companyAddress}</p>
                            <p>Tel. {companyPhones}</p>
                        </div>

                        <div className="flex justify-end pt-2">
                            <div className="border border-black p-4 text-center min-w-[170px] bg-white">
                                <p className="text-[9px] font-black uppercase tracking-widest text-black border-b border-gray-100 pb-1 mb-1">FOLIO</p>
                                <div className="flex items-center justify-center gap-1 text-red-600 font-serif font-bold text-3xl">
                                    <span>No.</span>
                                    <input 
                                        value={contractForm.folio}
                                        onChange={(e) => setContractForm({...contractForm, folio: e.target.value})}
                                        className="bg-transparent outline-none w-28 text-center text-red-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Línea Separadora Independiente */}
                    <div className="h-[1px] bg-black w-full mb-4"></div>

                    <div className="space-y-6 text-[12px] text-justify leading-relaxed text-gray-800">
                        {/* Introducción Legal */}
                        <p className="font-bold uppercase text-[10px] tracking-tight">
                            CONTRATO DE PRESTACIÓN DE SERVICIOS DE EVENTOS SOCIALES QUE CELEBRAN POR UNA PARTE "LUXURY SALÓN SOCIAL", 
                            REPRESENTADO EN ESTE ACTO POR GRACIELA HERRERA RAMÍREZ, A QUIEN EN LO SUCESIVO SE LE DENOMINARÁ "EL PRESTADOR DEL SERVICIO" 
                            Y POR OTRA PARTE <span className="border-b-2 border-black font-black px-4 pb-1 inline-block min-w-[200px] text-center align-baseline">{selectedReservation?.cliente}</span> A QUIEN EN LO SUCESIVO 
                            SE LE DENOMINARA "EL CONSUMIDOR" AL TENOR DE LAS SIGUIENTES DECLARACIONES Y CLAUSULAS.
                        </p>

                        {/* Sección Declaraciones */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-serif text-center font-bold tracking-[0.4em] mb-4 italic uppercase">DECLARACIONES</h2>
                            <div className="space-y-2">
                                <div>
                                    <p className="font-black italic underline">I.- Declara "EL PRESTADOR DEL SERVICIO":</p>
                                    <p>A) Ser una persona física con capacidad para celebrar el presente contrato, con nombre comercial "LUXURY SALÓN SOCIAL".</p>
                                    <p>B) Quien para los efectos legales nombra como su representante a Graciela Herrera Ramírez que a su vez señala como domicilio fiscal la calle {companyAddress}</p>
                                    <p>C) Que cuenta con la capacidad, infraestructura, servicios y recursos necesarios para dar cabal cumplimiento a las obligaciones que por virtud del presente contrato adquiere.</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="font-black italic underline">II.- Declara "EL CONSUMIDOR":</p>
                                    <p>a) Llamarse como ha quedado plasmado en el presente contrato.</p>
                                    <p>b) Que es su deseo obligarse en los términos y condiciones del presente contrato, manifestando que cuenta con la capacidad legal de la celebración de este acto.</p>
                                    <div className="space-y-4 leading-loose">
                                        <div className="flex gap-4 items-center">
                                            <p>c) Que para los efectos legales del presente contrato señala como su domicilio el ubicado en:</p>
                                            <input 
                                                value={contractForm.domicilio_consumidor}
                                                onChange={(e) => setContractForm({...contractForm, domicilio_consumidor: e.target.value})}
                                                className="flex-1 font-bold border-b-2 border-black px-2 bg-transparent outline-none italic"
                                                placeholder="Dirección Completa..."
                                            />
                                        </div>
                                        <div className="flex gap-4 items-center">
                                            <p>d) Que su número telefónico es el:</p>
                                            <input 
                                                value={contractForm.telefono_consumidor}
                                                onChange={(e) => setContractForm({...contractForm, telefono_consumidor: e.target.value})}
                                                className="w-1/3 font-bold border-b-2 border-black px-2 bg-transparent outline-none italic"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sección Cláusulas */}
                        <div className="space-y-8">
                            <h2 className="text-xl font-serif text-center font-bold tracking-[0.4em] mb-4 italic uppercase">Clausulas</h2>
                            
                            <p className="leading-loose">
                                <span className="font-black border-b-2 border-black pb-1 px-2 italic inline-block align-baseline">PRIMERA.-</span> El objeto del presente contrato es la prestación de servicios para la organización de un evento social para 
                                <span className="font-black px-6 text-base border-b-2 border-black mx-1 pb-1 inline-block min-w-[60px] text-center align-baseline">{contractForm.cantidad_personas}</span> personas, el cual se llevará a cabo el día 
                                <span className="font-black px-4 text-base border-b-2 border-black mx-1 pb-1 inline-block min-w-[30px] text-center align-baseline">{fd.d}</span> del mes 
                                <span className="font-black px-6 text-base border-b-2 border-black mx-1 pb-1 inline-block min-w-[120px] text-center align-baseline">{fd.m}</span> de 
                                <span className="font-black px-4 text-base border-b-2 border-black mx-1 pb-1 inline-block min-w-[60px] text-center align-baseline">{fd.a}</span>, el cual iniciará a las 
                                <span className="font-black px-4 text-base border-b-2 border-black mx-1 pb-1 inline-block min-w-[80px] text-center align-baseline">{contractForm.hora_inicio}</span> horas y terminará a las 
                                <span className="font-black px-4 text-base border-b-2 border-black mx-1 pb-1 inline-block min-w-[80px] text-center align-baseline">{contractForm.hora_fin}</span> horas. Dentro de la duración del evento no se cuenta el tiempo necesario que "El Prestador del Servicio" requiera para la organización del mismo.
                            </p>

                            <p className="italic text-[11px] text-gray-600">
                                "El Prestador del Servicio" podrá cobrar una cantidad adicional, debidamente prevista en el presupuesto, en el caso de que el evento prolongue su duración y/o el número de invitados exceda del estipulado.
                            </p>

                            <p className="font-bold underline italic text-center uppercase tracking-widest text-gray-400 py-2">"El prestador del Servicio" por virtud del presente contrato ofrece a "el consumidor" los siguientes servicios:</p>

                            {/* Tabla de Servicios Estilo Físico */}
                            <div className="border-2 border-black rounded-xl overflow-hidden shadow-2xl">
                                <div className="grid grid-cols-[4fr,1fr] bg-gray-50 border-b-2 border-black font-black uppercase tracking-widest text-[10px] text-center">
                                    <div className="p-1 border-r-2 border-black">SERVICIO</div>
                                    <div className="p-1">PRECIO</div>
                                </div>

                                <div className="grid grid-cols-[4fr,1fr] border-b border-gray-200">
                                    <div className="p-1 border-r border-gray-200 flex items-center">
                                        1.- El alquiler del Salón propiedad de "El Prestador del Servicio" ubicado en {companyAddress}, para <span className="font-bold border-b-2 border-black px-2 inline-block mx-1">{contractForm.cantidad_personas}</span> personas, durante <span className="font-bold border-b-2 border-black px-2 inline-block mx-1">{contractForm.duracion_horas}</span> hrs.
                                    </div>
                                    <div className="p-1 text-center font-serif text-base flex items-center justify-center font-bold">
                                        $ {(Number(contractForm.total_operacion) - adicionales.reduce((acc, a) => acc + Number(a.precio_unitario || 0), 0)).toLocaleString()}
                                    </div>
                                </div>

                                <div className="grid grid-cols-[4fr,1fr] border-b border-gray-200">
                                    <div className="p-2 border-r border-gray-200 uppercase flex items-center">
                                        2.- Alquiler de Mesas, Sillas, Manteles
                                    </div>
                                    <div className="p-2 text-center font-serif text-base flex items-center justify-center font-bold text-gray-400">
                                        INCLUIDO
                                    </div>
                                </div>

                                <div className="grid grid-cols-[4fr,1fr] border-b border-gray-200">
                                    <div className="p-2 border-r border-gray-200 uppercase flex items-center">
                                        3.- Vajilla (____ Platos, ____ Vaso, ____ Copa, ____ Cubiertos) para <span className="font-bold ml-1">{contractForm.cantidad_personas}</span> personas.
                                    </div>
                                    <div className="p-2 text-center font-serif text-base flex items-center justify-center font-bold text-gray-400">
                                        INCLUIDO
                                    </div>
                                </div>

                                {adicionales.map((ad, idx) => (
                                    <div key={idx} className="grid grid-cols-[4fr,1fr] border-b border-gray-200">
                                        <div className="p-2 border-r border-gray-200 uppercase font-medium flex items-center">
                                            {idx + 4}.- {ad.nombre || ad.name}
                                        </div>
                                        <div className="p-2 text-center font-serif text-base flex items-center justify-center font-bold">
                                            $ {Number(ad.precio_unitario || 0).toLocaleString()}
                                        </div>
                                    </div>
                                ))}

                                <div className="grid grid-cols-[4fr,1fr] border-b border-gray-200">
                                    <div className="p-2 border-r border-gray-200 flex items-center gap-4">
                                        <span className="font-bold">6.- TIPO DE EVENTO:</span>
                                        <input 
                                            value={contractForm.tipo_evento}
                                            onChange={(e) => setContractForm({...contractForm, tipo_evento: e.target.value})}
                                            className="flex-1 bg-transparent border-b border-gray-300 font-serif italic text-lg outline-none"
                                        />
                                    </div>
                                    <div className="p-2 bg-gray-50/50"></div>
                                </div>

                                <div className="grid grid-cols-[4fr,1fr] min-h-[100px]">
                                    <div className="p-4 border-r border-gray-200 italic text-gray-400">
                                        OTROS (Especificar):
                                        <textarea 
                                            value={contractForm.notas_especiales}
                                            onChange={(e) => setContractForm({...contractForm, notas_especiales: e.target.value})}
                                            className="w-full mt-2 bg-transparent border-none outline-none resize-none font-serif text-black"
                                            rows={2}
                                        />
                                    </div>
                                    <div className="p-0 flex flex-col justify-end bg-gray-50/30">
                                        <div className="flex justify-between w-full px-4 py-1 border-b border-gray-200">
                                            <span className="text-[10px] font-black uppercase text-gray-400">TOTAL $</span>
                                            <span className="font-serif font-black flex-1 text-center">{Number(contractForm.total_operacion).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between w-full px-4 py-1 border-b border-gray-200">
                                            <span className="text-[10px] font-black uppercase text-gray-400">DEPÓSITO $</span>
                                            <input type="number" value={contractForm.deposito_garantia} onChange={(e) => setContractForm({...contractForm, deposito_garantia: e.target.value})} className="flex-1 bg-transparent text-center outline-none font-serif" />
                                        </div>
                                        <div className="flex justify-between w-full px-4 py-1 border-b border-gray-400">
                                            <span className="text-[10px] font-black uppercase text-gray-400">ANTICIPO $</span>
                                            <input type="number" value={contractForm.anticipo_monto} onChange={(e) => setContractForm({...contractForm, anticipo_monto: Number(e.target.value)})} className="flex-1 bg-transparent text-center outline-none font-serif font-black" />
                                        </div>
                                        <div className="flex justify-between w-full px-4 py-2 bg-gray-100">
                                            <span className="text-[11px] font-black uppercase text-black tracking-tighter">RESTO $</span>
                                            <span className="font-serif font-black text-xl text-black flex-1 text-center">{(Number(contractForm.total_operacion) - Number(contractForm.anticipo_monto || 0)).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 items-center font-black italic uppercase text-gray-500 py-2 border-b border-gray-100">
                                <span>FECHA DE PAGO FINAL:</span>
                                <span className="border-b-2 border-black px-6 py-1 text-black bg-red-50/10 min-w-[150px] text-center inline-block">{contractForm.fecha_limite_pago || '_____________________'}</span>
                            </div>

                            {/* Hoja 2 - Cláusulas y Firmas */}
                            <div className="relative mt-20 pt-16 border-t-4 border-double border-gray-400">
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-100 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest text-gray-500 border border-gray-300 shadow-sm">Hoja 2 - Cláusulas y Firmas</span>
                                
                                <div className="space-y-6 mb-12">
                                    <p><span className="font-black italic underline">SEGUNDA.-</span> El costo total que "El Consumidor" debe solventar por la prestación del servicio es el estipulado en la cláusula primera del presente contrato no importando si el número de asistentes al evento es inferior al estipulado...</p>
                                    <div className="pl-10 space-y-2 italic text-gray-600">
                                        <p>a) El _____ % a la firma del presente contrato, por concepto de anticipo.</p>
                                        <p>b) El restante _____ % un día antes de la celebración del evento.</p>
                                    </div>
                                    <p><span className="font-black italic underline">TERCERA.-</span> El consumidor cuenta con un plazo de cinco días hábiles posteriores a la firma del presente contrato para cancelar...</p>
                                    <p><span className="font-black italic underline">CUARTA.-</span> En caso de que el consumidor contrate de manera externa sonido...</p>
                                    <p><span className="font-black italic underline">QUINTA.-</span> En su caso el consumidor se obliga a cumplir con las disposiciones reglamentarias...</p>
                                    
                                    <div className="space-y-4 pt-10">
                                        <p>Leído que fue el presente documento y enteradas las partes de su alcance y contenido legal, lo suscriben en la ciudad de Apizaco, Tlaxcala, a los <span className="font-black underline mx-2"> {new Date().getDate()} </span> días del mes de <span className="font-black underline mx-2 uppercase"> {new Date().toLocaleDateString('es-ES', { month: 'long' })} </span> de <span className="font-black underline mx-2 underline"> {new Date().getFullYear()} </span>.</p>
                                    </div>
                                </div>

                                {/* Firmas Area */}
                                <div className="grid grid-cols-2 gap-20 pt-10 text-center">
                                    <div className="space-y-6">
                                        <div className="border-b-2 border-black h-20 flex items-end justify-center pb-4 italic text-gray-300 font-serif">Sello y Firma Autógrafa</div>
                                        <div className="space-y-1">
                                            <p className="font-black uppercase tracking-widest text-[10px]">El Prestador del Servicio</p>
                                            <p className="text-[11px] font-bold">GRACIELA HERRERA RAMÍREZ</p>
                                            <p className="text-[9px] text-gray-400 italic">Luxury Salón Social</p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="border-b-2 border-black h-20 flex items-end justify-center pb-4 italic text-gray-300 font-serif">Aceptación Digital</div>
                                        <div className="space-y-1">
                                            <p className="font-black uppercase tracking-widest text-[10px]">El Consumidor</p>
                                            <p className="text-[11px] font-bold">{selectedReservation?.cliente}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        <div className="flex flex-col md:flex-row justify-center gap-8 mt-16 pb-10 print:hidden">
                            <button 
                                onClick={handlePrint}
                                className="px-16 py-8 border-2 border-black text-[11px] uppercase tracking-[0.6em] font-black hover:bg-black hover:text-white transition-all rounded-full shadow-lg"
                            >
                                Imprimir Acuerdo Físico
                            </button>
                            <form onSubmit={handleCreateContract} className="contents">
                                <button 
                                    type="submit"
                                    className="px-16 py-8 bg-black text-white text-[11px] uppercase tracking-[0.6em] font-black hover:scale-105 shadow-[0_45px_90px_-20px_rgba(0,0,0,0.4)] transition-all rounded-full"
                                >
                                    Guardar Acuerdo Digital
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    </AnimatePresence>
    );
};

export default ContractModal;