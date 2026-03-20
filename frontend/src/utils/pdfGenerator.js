import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateContractPDF = async (contractData, reservationData, logoUrl) => {
    // Crear un elemento temporal para el renderizado del contrato
    const element = document.createElement('div');
    element.style.width = '850px';
    element.style.padding = '0';
    element.style.margin = '0';
    element.style.background = '#fff';
    element.style.fontFamily = '"Times New Roman", Times, serif';
    element.style.color = '#000';
    element.style.fontSize = '12px';
    element.style.lineHeight = '1.3';
    const totalVal = Number(contractData.total || contractData.total_operacion || 0);
    const anticipoVal = Number(contractData.anticipo || contractData.anticipo_monto || 0);
    const resto = totalVal - anticipoVal;

    const parseFecha = (str) => {
        if (!str) return new Date();
        return new Date(str + 'T00:00:00');
    };
    const dateObj = parseFecha(reservationData.fecha);
    const months = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
    const monthStr = months[dateObj.getMonth()];

    // Contenido del contrato (REPLICA DEL FISICO)
    element.innerHTML = `
        <!-- PAGINA 1 -->
        <div style="padding: 60px; min-height: 1100px; border-bottom: 2px dashed #ccc; position: relative;">
            <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse;">
                <tr>
                    <td style="width: 450px; vertical-align: middle;">
                        <img src="${logoUrl}" style="height: 120px; width: auto; display: block; border: 0;" />
                    </td>
                    <td style="text-align: center; vertical-align: middle; font-size: 11px; font-family: serif; color: #000; padding: 0 10px;">
                        <p style="margin: 0; line-height: 1.4;">2 de Abril 2503 Col. El Carmen, Apizaco, Tlax.</p>
                        <p style="margin: 0; line-height: 1.4;">Tel. 241 411 3108 / 241 116 16 77</p>
                    </td>
                    <td style="width: 200px; text-align: right; vertical-align: middle; padding-bottom: 5px;">
                        <div style="border: 2px solid #000; padding: 12px 20px; display: inline-block; text-align: center; min-width: 160px; background: #fff;">
                           <span style="font-size: 8px; font-weight: bold; display: block; border-bottom: 1px solid #eee; margin-bottom: 4px; text-transform: uppercase;">FOLIO</span>
                           <span style="font-size: 22px; font-weight: bold; color: #d00; font-family: serif;">No. ${contractData.folio}</span>
                        </div>
                    </td>
                </tr>
            </table>
            <div style="height: 2px; background: #000; width: 100%; margin-bottom: 30px;"></div>

            <p style="font-weight: bold; font-size: 10px; text-align: justify; margin-bottom: 20px;">
                CONTRATO DE PRESTACIÓN DE SERVICIOS DE EVENTOS SOCIALES QUE CELEBRAN POR UNA PARTE "LUXURY SALÓN SOCIAL", 
                REPRESENTADO EN ESTE ACTO POR GRACIELA HERRERA RAMÍREZ, A QUIEN EN LO SUCESIVO SE LE DENOMINARÁ "EL PRESTADOR DEL SERVICIO" 
                Y POR OTRA PARTE <span style="text-decoration: underline; font-weight: bold;">${contractData.cliente}</span> A QUIEN EN LO SUCESIVO 
                SE LE DENOMINARA "EL CONSUMIDOR" AL TENOR DE LAS SIGUIENTES DECLARACIONES Y CLAUSULAS.
            </p>

            <h2 style="text-align: center; font-size: 20px; font-weight: bold; letter-spacing: 10px; margin: 40px 0; border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 12px 0; text-transform: uppercase;">DECLARACIONES</h2>
            
            <div style="font-size: 11px; space-y-10;">
                <p><strong>I.- Declara "EL PRESTADOR DEL SERVICIO":</strong></p>
                <p style="margin-left: 20px;">A) Ser una persona física con capacidad para celebrar el presente contrato, con nombre comercial "LUXURY SALÓN SOCIAL"</p>
                <p style="margin-left: 20px;">B) Quien para los efectos legales nombra como su representante a Graciela Herrera Ramírez que a su vez señala como domicilio fiscal la calle 2 de Abril 2503 Col. El Carmen, Apizaco, Tlax.</p>
                <p style="margin-left: 20px;">C) Que cuenta con la capacidad, infraestructura, servicios y recursos necesarios para dar cabal cumplimiento a las obligaciones que por virtud del presente contrato adquiere.</p>
                
                <p style="margin-top: 15px;"><strong>II.- Declara "EL CONSUMIDOR":</strong></p>
                <p style="margin-left: 20px;">a) Llamarse como ha quedado plasmado en el presente contrato.</p>
                <p style="margin-left: 20px;">b) Que es su deseo obligarse en los términos y condiciones del presente contrato, manifestando que cuenta con la capacidad legal de la celebración de este acto.</p>
                <p style="margin-left: 20px;">c) Que para los efectos legales del presente contrato señala como su domicilio el ubicado en: <span style="text-decoration: underline; font-weight: bold;">${contractData.domicilio_consumidor || '_____________________________________________________________'}</span></p>
                <p style="margin-top: 10px;">d) Que su número telefónico es el <span style="text-decoration: underline; font-weight: bold;">${contractData.telefono_consumidor || '____________________________'}</span></p>
            </div>

            <h2 style="text-align: center; font-size: 20px; font-weight: bold; letter-spacing: 10px; margin: 50px 0; border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 12px 0; text-transform: uppercase;">CLAUSULAS</h2>
            
            <p style="font-size: 11px;">
                <strong style="border-bottom: 2px solid #000; padding-bottom: 2px;">PRIMERA.-</strong> El objeto del presente contrato es la prestación de servicios para la organización de un evento social para 
                <span style="border-bottom: 2px solid #000; font-weight: bold; padding: 0 10px 2px 10px; min-width: 40px; display: inline-block; text-align: center;">${contractData.cantidad_personas || '______'}</span> 
                personas, el cual se llevará a cabo el día <span style="border-bottom: 2px solid #000; font-weight: bold; padding: 0 5px 2px 5px; display: inline-block; text-align: center;">${dateObj.getDate()}</span> del mes de 
                <span style="border-bottom: 2px solid #000; font-weight: bold; padding: 0 10px 2px 10px; display: inline-block; text-align: center;">${monthStr}</span> de 
                <span style="border-bottom: 2px solid #000; font-weight: bold; padding: 0 10px 2px 10px; display: inline-block; text-align: center;">${dateObj.getFullYear()}</span>, el cual iniciará a las 
                <span style="border-bottom: 2px solid #000; font-weight: bold; padding: 0 10px 2px 10px; display: inline-block; text-align: center;">${reservationData.hora_inicio}</span> horas y terminará a las 
                <span style="border-bottom: 2px solid #000; font-weight: bold; padding: 0 10px 2px 10px; display: inline-block; text-align: center;">${reservationData.hora_fin}</span> horas. Dentro de la duración del evento no se cuenta el tiempo necesario que "El Prestador del Servicio" requiera para la organización del mismo.
            </p>

            <p style="font-size: 10px; margin: 15px 0;">"El Prestador del Servicio" podrá cobrar una cantidad adicional, debidamente prevista en el presupuesto, en el caso de que el evento prolongue su duración y/o el número de invitados exceda del estipulado.</p>
            <p style="font-size: 10px; margin-bottom: 15px;">"El prestador del Servicio" por virtud del presente contrato ofrece a "el consumidor" los siguientes servicios:</p>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 11px; font-family: sans-serif; border: 1.5px solid #000;">
                <tr style="background-color: #f2f2f2; border-bottom: 1.5px solid #000; text-align: center; font-weight: bold; letter-spacing: 1.5px;">
                    <td style="border-right: 1.5px solid #000; padding: 10px; width: 80%;">SERVICIO</td>
                    <td style="padding: 10px;">PRECIO</td>
                </tr>
                <tr style="border-bottom: 1px solid #000;">
                    <td style="border-right: 1.5px solid #000; padding: 12px 10px;">
                        1.- El alquiler del Salón propiedad de "El Prestador del Servicio" ubicado en 2 de Abril #2503, para <span style="font-weight: bold;">${contractData.cantidad_personas}</span> personas, durante <span style="font-weight: bold;">${contractData.duracion_horas}</span> hrs.
                    </td>
                    <td style="padding: 12px 10px; text-align: right; white-space: nowrap;">$${(totalVal - reservationData.servicios_adicionales.reduce((acc, s) => acc + Number(s.precio_unitario || 0), 0)).toLocaleString()}</td>
                </tr>
                <tr style="border-bottom: 1px solid #000;">
                    <td style="border-right: 1.5px solid #000; padding: 12px 10px;">2.- Alquiler de Mesas, Sillas, Manteles</td>
                    <td style="padding: 12px 10px; text-align: right;">INCLUIDO</td>
                </tr>
                <tr style="border-bottom: 1px solid #000;">
                    <td style="border-right: 1.5px solid #000; padding: 12px 10px;">3.- Vajilla (____ Platos, ____ Vaso, ____ Copa, ____ Cubiertos) para <span style="font-weight: bold;">${contractData.cantidad_personas}</span> personas.</td>
                    <td style="padding: 12px 10px; text-align: right;">INCLUIDO</td>
                </tr>
                ${reservationData.servicios_adicionales.map((s, idx) => `
                    <tr style="border-bottom: 1px solid #000;">
                        <td style="border-right: 1.5px solid #000; padding: 12px 10px;">${idx + 4}.- ${s.nombre || s.name}</td>
                        <td style="padding: 12px 10px; text-align: right;">$${Number(s.precio_unitario || 0).toLocaleString()}</td>
                    </tr>
                `).join('')}
                <tr style="border-bottom: 1.5px solid #000;">
                    <td style="border-right: 1.5px solid #000; padding: 12px 10px;"><strong>6.- TIPO DE EVENTO:</strong> <span style="font-weight: bold; text-decoration: underline;">${contractData.tipo_evento}</span></td>
                    <td style="padding: 12px 10px;"></td>
                </tr>
                <tr>
                    <td style="border-right: 1.5px solid #000; padding: 12px 10px; vertical-align: top;">
                        <p style="margin-top: 0; font-weight: bold; text-transform: uppercase; font-size: 10px; letter-spacing: 1px;">OTROS (Especificar):</p>
                        <p style="font-style: italic; margin-bottom: 0;">${contractData.notas_especiales || 'Ninguno'}</p>
                    </td>
                    <td style="padding: 0; vertical-align: top;">
                        <table style="width: 100%; border-collapse: collapse; font-weight: bold;">
                            <tr>
                                <td style="padding: 8px 10px; border-bottom: 1px solid #ccc; font-size: 10px;">TOTAL $</td>
                                <td style="padding: 8px 10px; border-bottom: 1px solid #ccc; text-align: right;">${totalVal.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 10px; border-bottom: 1px solid #ccc; font-size: 10px;">DEPÓSITO $</td>
                                <td style="padding: 8px 10px; border-bottom: 1px solid #ccc; text-align: right;">${Number(contractData.deposito_garantia || 1000).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 10px; border-bottom: 1.5px solid #000; font-size: 10px;">ANTICIPO $</td>
                                <td style="padding: 8px 10px; border-bottom: 1.5px solid #000; text-align: right;">${anticipoVal.toLocaleString()}</td>
                            </tr>
                            <tr style="background-color: #f2f2f2;">
                                <td style="padding: 12px 10px; font-size: 11px; text-transform: uppercase;">RESTO $</td>
                                <td style="padding: 12px 10px; text-align: right; font-size: 14px; color: #000;">${resto.toLocaleString()}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <p style="font-weight: bold; font-size: 11px; margin-top: 30px;">FECHA DE PAGO FINAL: <span style="text-decoration: underline;">${contractData.fecha_limite_pago || '_____________________'}</span></p>
        </div>

        <!-- PAGINA 2 -->
        <div style="padding: 60px; min-height: 1100px;">
            <div style="column-count: 2; column-gap: 40px; font-size: 9px; text-align: justify; line-height: 1.2;">
                <p><strong>SEGUNDA.-</strong> El costo total que "El Consumidor" debe solventar por la prestación del servicio es el estipulado en la cláusula primera del presente contrato no importando si el número de asistentes al evento es inferior al estipulado. Dicho costo será cubierto por "el consumidor" de contado, en moneda nacional y en la forma siguiente:</p>
                <p style="margin-left: 20px;">a) El <span style="font-weight: bold;">${reservationData.paquete ? '50' : '___'}</span> % a la firma del presente contrato, por concepto de anticipo.</p>
                <p style="margin-left: 20px;">b) El restante <span style="font-weight: bold;">${reservationData.paquete ? '50' : '___'}</span> % un día antes de la celebración del evento.</p>
                <p>El consumidor se obliga a depositar la cantidad de $1,000 para garantizar el pago de servicios excedentes, imprevistos, o daños o perjuicios en su caso. Dicho depósito será devuelto al consumidor si al finalizar el evento no se verificó ninguno de esos supuestos.</p>

                <p style="margin-top: 10px;"><strong>TERCERA.-</strong> El consumidor cuenta con un plazo de cinco días hábiles posteriores a la firma del presente contrato para cancelar la operación sin responsabilidad alguna de su parte, en cuyo caso el prestador del servicio se obliga a reintegrar todas las cantidades que el consumidor le haya entregado, exceptuando el depósito, lo anterior no será aplicable si la fecha de la prestación el servicio se encuentra a quince días hábiles o menos de la celebración.</p>

                <p style="margin-top: 10px;"><strong>CUARTA.-</strong> En caso de que el consumidor contrate de manera externa sonido, grupo, mariachi o cualquier evento musical deberá tomar en cuenta el rango de sonido permitido dentro del salón.</p>

                <p style="margin-top: 10px;"><strong>QUINTA.-</strong> En su caso el consumidor se obliga a cumplir con las disposiciones reglamentarias que rijan el inmueble y a procurar que los asistentes al evento observen la misma conducta. Para tal efecto el prestador del servicio deberá entregar a el consumidor una copia del reglamento respectivo o bien fijar en un lugar visible sus disposiciones.</p>
                <p style="margin-left: 20px; font-style: italic;">a) No se permitirá el uso de fuegos artificiales ó pirotecnia dentro del salón.</p>

                <p style="margin-top: 10px;"><strong>SEXTA.-</strong> En caso de que el prestador del servicio incurra en incumplimiento del presente contrato por causas imputables a él se obliga a elección de el consumidor:</p>
                <p style="margin-left: 20px;">a) A contratar por su cuenta a otra empresa que este en posibilidades de realizar la prestación del servicio en las condiciones estipuladas por el consumidor. El costo adicional, que en su caso, se genere será absorbido por el prestador del servicio, o bien</p>
                <p style="margin-left: 20px;">b) A reintegrar las cantidades que se le hubieran entregado y a pagar una pena convencional del 20 % del costo total del servicio.</p>

                <p style="margin-top: 10px;"><strong>SÉPTIMA.-</strong> Si los bienes destinados a la prestación del servicio sufrieren un menoscabo por culpa o negligencia debidamente comprobada de el consumidor d de sus invitados, éste se obliga a cubrir los gastos de reparación de los mismos.</p>

                <p style="margin-top: 10px;"><strong>OCTAVA.-</strong> Las partes podrán acordar que el consumidor contrate libremente servicios específicos relacionados con el evento social con otros prestadores de servicios por así convenir a sus intereses, por lo que en caso de actualizarse dicho supuesto el consumidor exime de toda responsabilidad a el prestador del servicio en lo que respecta a dichos servicios en específico.</p>

                <p style="margin-top: 10px;"><strong>NOVENA.-</strong> En caso de que el prestador del servicio se encuentre imposibilitado para prestar el servicio por caso fortuito o fuerza mayor, como incendio, temblor u otros acontecimientos de la naturaleza o hechos del hombre ajenos a la voluntad del prestador del servicio, no se incurrirá en incumplimiento, por lo que no habrá pena convencional en dichos supuestos, debiendo únicamente el prestador del servicio reintegrar al consumidor el anticipo que le hubiera entregado.</p>

                <p style="margin-top: 10px;"><strong>DÉCIMA.-</strong> En caso de alterarse gravemente el orden durante la celebración del evento, el "Prestador del Servicio" se reserva el total derecho de suspenderlo para salvaguardar la seguridad de los invitados.</p>

                <p style="margin-top: 10px;"><strong>DÉCIMA PRIMERA.-</strong> "El prestador del servicio" no se hace responsable del robo parcial o total de los vehículos automotores, ni de los daños que puedan sufrir.</p>

                <p style="margin-top: 10px;"><strong>DÉCIMA SEGUNDA.-</strong> "El prestador del servicio" no es responsable por accidentes provocados en el interior por riñas o diferencias entre los invitados.</p>

                <p style="margin-top: 10px;"><strong>DÉCIMA TERCERA.-</strong> Los accidentes provocados en el área de juegos infantiles exime de toda responsabilidad al "Prestador del Servicio".</p>

                <p style="margin-top: 10px;"><strong>DÉCIMA CUARTA.-</strong> Si el consumidor cancela el presente contrato después de los cinco días hábiles que prevé la cláusula tercera el consumidor deberá indemnizar a el prestador del servicio por los gastos comprobables hasta por un 20% del costo total de la operación que hubiese realizado en ejecución de la prestación del servicio.</p>

                <p style="margin-top: 10px;"><strong>DÉCIMA QUINTA.-</strong> Para la interpretación y cumplimiento del presente contrato las partes se someten a la competencia de la Procuraduría Federal del Consumidor y a las leyes y jurisdicción de los tribunales competentes del fuera común.</p>
            </div>

            <div style="margin-top: 50px; text-align: justify; font-size: 10px;">
                <p>Leído que fue el presente documento y enteradas las partes de su alcance y contenido legal, lo suscriben en la ciudad de Apizaco, Tlaxcala, a los <span style="border-bottom: 1px solid #000; width: 40px; display: inline-block; text-align: center;">${new Date().getDate()}</span> días del mes de <span style="border-bottom: 1px solid #000; width: 100px; display: inline-block; text-align: center; text-transform: uppercase;">${new Date().toLocaleDateString('es-ES', {month: 'long'})}</span> de <span style="border-bottom: 1px solid #000; width: 60px; display: inline-block; text-align: center;">${new Date().getFullYear()}</span>.</p>
            </div>

            <div style="margin-top: 100px; display: flex; justify-content: space-around; text-align: center; font-size: 11px;">
                <div style="width: 280px;">
                    <div style="border-top: 2px solid #000; padding-top: 12px;">
                        <span style="font-weight: bold; font-size: 12px;">GRACIELA HERRERA RAMÍREZ</span><br/>
                        <span style="font-size: 9px; uppercase tracking-widest;">EL PRESTADOR DEL SERVICIO</span>
                    </div>
                </div>
                <div style="width: 280px;">
                    <div style="border-top: 2px solid #000; padding-top: 12px;">
                        <span style="font-weight: bold; font-size: 12px;">${contractData.cliente}</span><br/>
                        <span style="font-size: 9px; uppercase tracking-widest;">EL CONSUMIDOR</span>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 100px; opacity: 0.1;">
                <h1 style="font-size: 80px; margin: 0; font-family: serif; letter-spacing: -5px;">LUXURY</h1>
            </div>
        </div>
    `;

    document.body.appendChild(element);

    // Esperar a que las imágenes se carguen
    const images = element.getElementsByTagName('img');
    const imagePromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve; // Continuar aunque falle una
        });
    });

    await Promise.all(imagePromises);

    try {
        const canvas = await html2canvas(element, { 
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        // El PDF es A4 (297mm de alto). Si la proporción es mayor, jsPDF lo acomodará.
        // Aquí ajustamos para que ocupe las dos páginas si es necesario.
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Contrato_${contractData.folio}.pdf`);
    } finally {
        document.body.removeChild(element);
    }
};
