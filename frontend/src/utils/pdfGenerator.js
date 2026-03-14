import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateContractPDF = async (contractData, reservationData) => {
    // Crear un elemento temporal para el renderizado del contrato
    const element = document.createElement('div');
    element.style.width = '800px';
    element.style.padding = '40px';
    element.style.background = '#fff';
    element.style.fontFamily = 'serif';
    element.style.color = '#000';
    element.style.fontSize = '12px';
    element.style.lineHeight = '1.4';
    
    // Contenido del contrato (Simulando el diseño físico)
    element.innerHTML = `
        <div style="border: 2px solid #000; padding: 20px; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                <div style="width: 200px;">
                    <h1 style="font-size: 24px; margin: 0; font-style: italic;">LUXURY</h1>
                    <p style="font-size: 10px; margin: 0;">SALÓN SOCIAL</p>
                </div>
                <div style="text-align: center; font-size: 10px;">
                    2 de Abril 2503 Col. El Carmen, Apizaco, Tlax.<br/>
                    Tel. 241 411 3108 / 241 116 16 77
                </div>
                <div style="border: 2px solid #000; padding: 5px 15px; text-align: center;">
                    <p style="margin: 0; font-weight: bold; font-size: 10px;">FOLIO</p>
                    <p style="margin: 0; font-size: 14px; color: red;">No. ${contractData.folio}</p>
                </div>
            </div>

            <div style="text-align: center; font-weight: bold; margin-bottom: 15px; font-size: 9px;">
                CONTRATO DE PRESTACION DE SERVICIOS DE EVENTOS SOCIALES QUE CELEBRAN POR UNA PARTE "LUXURY SALÓN SOCIAL", REPRESENTADO EN ESTE ACTO POR GRACIELA HERRERA RAMÍREZ, A QUIEN EN LO SUCESIVO SE LE DENOMINARÁ "EL PRESTADOR DEL SERVICIO" Y POR OTRA PARTE <span style="text-decoration: underline;">${contractData.cliente}</span> A QUIEN EN LO SUCESIVO SE LE DENOMINARÁ "EL CONSUMIDOR" AL TENOR DE LAS SIGUIENTES DECLARACIONES Y CLAUSULAS.
            </div>

            <h3 style="text-align: center; border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 10px; letter-spacing: 2px;">DECLARACIONES</h3>
            <div style="font-size: 10px; margin-bottom: 15px;">
                <p>I.- Declara "EL PRESTADOR DEL SERVICIO": ... (Texto legal omitido por brevedad para el mockup) ...</p>
                <p>II.- Declara "EL CONSUMIDOR": ... (Texto legal omitido por brevedad para el mockup) ...</p>
            </div>

            <h3 style="text-align: center; border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 15px; letter-spacing: 2px;">CLAUSULAS</h3>
            <div style="font-size: 10px; margin-bottom: 15px;">
                <p><strong>PRIMERA.-</strong> El objeto del presente contrato es la prestación de servicios para la organización de un evento social para <span style="text-decoration: underline;">${contractData.cantidad_personas || '___'}</span> personas, el cual se llevará a cabo el día <span style="text-decoration: underline;">${contractData.fecha || '___'}</span>, el cual iniciará a las <span style="text-decoration: underline;">${reservationData?.hora_inicio || '___'}</span> horas y terminará a las <span style="text-decoration: underline;">${reservationData?.hora_fin || '___'}</span> horas.</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10px;">
                <thead>
                    <tr style="background: #f0f0f0;">
                        <th style="border: 1px solid #000; padding: 8px; text-align: left;">SERVICIO</th>
                        <th style="border: 1px solid #000; padding: 8px; text-align: right; width: 120px;">PRECIO</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px;">Alquiler de Salón para ${contractData.cantidad_personas} personas</td>
                        <td style="border: 1px solid #000; padding: 8px; text-align: right;">$${Number(contractData.total).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 8px; height: 100px; vertical-align: top;">
                            <strong>OTROS:</strong><br/>
                            ${contractData.notas_especiales || 'N/A'}
                        </td>
                        <td style="border: 1px solid #000; padding: 8px; text-align: right;">$0.00</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th style="border: 1px solid #000; padding: 8px; text-align: right;">TOTAL</th>
                        <td style="border: 1px solid #000; padding: 8px; text-align: right; font-weight: bold;">$${Number(contractData.total).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <th style="border: 1px solid #000; padding: 8px; text-align: right;">DEPOSITO DE GARANTÍA</th>
                        <td style="border: 1px solid #000; padding: 8px; text-align: right;">$${Number(contractData.deposito_garantia || 1000).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <th style="border: 1px solid #000; padding: 8px; text-align: right;">ANTICIPO</th>
                        <td style="border: 1px solid #000; padding: 8px; text-align: right;">$${Number(contractData.anticipo || 0).toLocaleString()}</td>
                    </tr>
                    <tr style="background: #f9f9f9;">
                        <th style="border: 1px solid #000; padding: 8px; text-align: right;">RESTO A LIQUIDAR</th>
                        <td style="border: 1px solid #000; padding: 8px; text-align: right; font-weight: bold; font-size: 14px;">$${(Number(contractData.total) + Number(contractData.deposito_garantia || 1000) - Number(contractData.anticipo || 0)).toLocaleString()}</td>
                    </tr>
                </tfoot>
            </table>

            <div style="margin-top: 40px; display: flex; justify-content: space-around; text-align: center; font-size: 10px;">
                <div style="width: 250px; border-top: 1px solid #000; padding-top: 10px;">
                    El Prestador del Servicio
                </div>
                <div style="width: 250px; border-top: 1px solid #000; padding-top: 10px;">
                    El Consumidor
                </div>
            </div>
            
            <div style="text-align: center; font-size: 8px; color: #666; margin-top: 300px;">
                <p>SEGUNDA - DECIMA QUINTA: CLÁUSULAS ADICIONALES EN REVERSO</p>
                <p>Leído que fue el presente documento y enteradas las partes de su alcance y contenido legal, lo suscriben en la ciudad de Apizaco, Tlaxcala.</p>
            </div>
        </div>
    `;

    document.body.appendChild(element);

    try {
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Contrato_${contractData.folio}.pdf`);
    } finally {
        document.body.removeChild(element);
    }
};
