
import { ReportFormState, PauseBlock } from './types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Converts HH:MM string to total minutes
 */
export const timeToMinutes = (time: string): number => {
  if (!time) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
};

/**
 * Converts total minutes to HH:MM string
 */
export const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

/**
 * Calculates duration between two time strings. 
 * Handles crossing midnight if end < start (adds 24h).
 */
export const calculateDuration = (start: string, end: string): string => {
  if (!start || !end) return '';
  
  let startMins = timeToMinutes(start);
  let endMins = timeToMinutes(end);

  if (endMins < startMins) {
    endMins += 24 * 60; // Cross midnight
  }

  return minutesToTime(endMins - startMins);
};

/**
 * Adds duration to start time to get end time
 */
export const addTime = (start: string, duration: string): string => {
  if (!start || !duration) return '';
  const startMins = timeToMinutes(start);
  const durationMins = timeToMinutes(duration);
  const totalMins = (startMins + durationMins) % (24 * 60);
  return minutesToTime(totalMins);
};

/**
 * Sums two time strings (Time A + Time B)
 * Used for the "Interval Mode" calculation
 */
export const sumTime = (timeA: string, timeB: string): string => {
  if (!timeA) return timeB || '';
  if (!timeB) return timeA || '';
  
  const minsA = timeToMinutes(timeA);
  const minsB = timeToMinutes(timeB);
  
  // Simple sum without 24h modulo, assuming durations for reporting
  return minutesToTime(minsA + minsB);
};

/**
 * Calculates the sum of all pause intervals
 */
export const calculateTotalPauses = (pauses: PauseBlock[]): string => {
  const totalMinutes = pauses.reduce((acc, curr) => acc + timeToMinutes(curr.interval), 0);
  return minutesToTime(totalMinutes);
};

/**
 * Triggers a file download in the browser
 */
export const downloadFile = (filename: string, content: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Generates a plain text report
 */
export const generateReportText = (data: ReportFormState): string => {
  const totalPauseTime = calculateTotalPauses(data.pauses);
  
  return `RELATÓRIO DE MONITORIA
    
INFORMAÇÕES GERAIS
------------------
Tipo: ${data.monitoriaType}
Operador: ${data.operatorData}
Data: ${data.date}
Contrato: ${data.contract}
Protocolo: ${data.protocol}
Momento: ${data.communicationTime}

PAUSAS
------
${data.pauses.map((p, i) => `Bloco ${i + 1}: Início ${p.startTime} | Intervalo ${p.interval} | Término ${p.endTime} ${p.isNegative ? '(Negativo)' : ''}`).join('\n')}

Tempo Total de Pausas: ${totalPauseTime}

OBSERVAÇÕES
-----------
Notas do Monitor: 
${data.monitorNotes}

Pontos a Observar:
${data.observationPoints}

Nota para Supervisor:
${data.supervisorNote}
`;
};

/**
 * Generates an HTML report for Word/Print
 */
export const generateReportHtml = (data: ReportFormState): string => {
  const totalPauseTime = calculateTotalPauses(data.pauses);

  return `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <title>Relatório de Monitoria</title>
    <style>
        body { font-family: 'Arial', sans-serif; padding: 40px; line-height: 1.5; color: #333; }
        h1 { color: #005A9C; font-size: 24px; border-bottom: 2px solid #005A9C; padding-bottom: 10px; margin-bottom: 20px; }
        h2 { color: #444; font-size: 18px; margin-top: 30px; margin-bottom: 15px; border-left: 4px solid #005A9C; padding-left: 10px; }
        .field-row { margin-bottom: 10px; }
        .label { font-weight: bold; color: #555; display: inline-block; width: 200px; }
        .value { color: #000; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total-row td { font-weight: bold; background-color: #e6f3ff; }
        .notes { background-color: #f9f9f9; padding: 15px; border-radius: 4px; border: 1px solid #eee; white-space: pre-wrap; }
        .negative { color: #D32F2F; font-weight: bold; }
    </style>
    </head>
    <body>
        <h1>Relatório de Monitoria</h1>
        
        <h2>Informações Gerais</h2>
        <div class="field-row"><span class="label">Tipo de Monitoria:</span> <span class="value">${data.monitoriaType}</span></div>
        <div class="field-row"><span class="label">Operador:</span> <span class="value">${data.operatorData}</span></div>
        <div class="field-row"><span class="label">Data:</span> <span class="value">${data.date}</span></div>
        <div class="field-row"><span class="label">Contrato:</span> <span class="value">${data.contract}</span></div>
        <div class="field-row"><span class="label">Protocolo:</span> <span class="value">${data.protocol}</span></div>
        <div class="field-row"><span class="label">Momento da comunicação:</span> <span class="value">${data.communicationTime}</span></div>

        <h2>Gestão de Pausas</h2>
        <table>
          <thead>
            <tr>
              <th>Início</th>
              <th>Intervalo</th>
              <th>Término</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            ${data.pauses.map(p => `
              <tr class="${p.isNegative ? 'negative' : ''}">
                <td>${p.startTime || '-'}</td>
                <td>${p.interval || '-'}</td>
                <td>${p.endTime || '-'}</td>
                <td>${p.isNegative ? 'Negativo' : 'Normal'}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="3" style="text-align: right;">Tempo Total de Pausas:</td>
              <td>${totalPauseTime}</td>
            </tr>
          </tbody>
        </table>

        <h2>Observações</h2>
        
        <h3>Notas do Monitor</h3>
        <div class="notes">${data.monitorNotes || 'Sem notas.'}</div>

        <h3>Pontos a Observar</h3>
        <div class="notes">${data.observationPoints || 'Sem observações.'}</div>

        <h3>Nota para Supervisor</h3>
        <div class="notes">${data.supervisorNote || 'Sem notas para o supervisor.'}</div>
    </body>
    </html>
    `;
};

/**
 * Generates a PDF file using jsPDF
 */
export const generatePDF = (data: ReportFormState) => {
  const doc = new jsPDF();
  
  // Colors
  const primaryColor: [number, number, number] = [0, 90, 156]; // #005A9C
  const grayColor: [number, number, number] = [80, 80, 80];
  const dangerColor: [number, number, number] = [211, 47, 47]; // #D32F2F

  // Header
  doc.setFontSize(20);
  doc.setTextColor(...primaryColor);
  doc.text("Relatório de Monitoria", 14, 20);
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(14, 25, 196, 25);

  let y = 35;

  // General Info
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Informações Gerais", 14, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(...grayColor);
  
  const addField = (label: string, value: string, x: number, currentY: number) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, x, currentY);
    doc.setFont('helvetica', 'normal');
    doc.text(value || '-', x + 45, currentY);
  };

  addField("Tipo de Monitoria", data.monitoriaType, 14, y);
  y += 7;
  addField("Operador", data.operatorData, 14, y);
  y += 7;
  addField("Data", data.date, 14, y);
  addField("Contrato", data.contract, 110, y);
  y += 7;
  addField("Protocolo", data.protocol, 14, y);
  y += 7;
  addField("Momento", data.communicationTime, 14, y);
  
  y += 15;

  // Pauses Table
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Gestão de Pausas", 14, y);
  y += 5;

  const totalPauseTime = calculateTotalPauses(data.pauses);
  
  const tableBody = data.pauses.map(p => [
    p.startTime || '-',
    p.interval || '-',
    p.endTime || '-',
    p.isNegative ? 'Negativo' : 'Normal'
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Início', 'Intervalo', 'Término', 'Tipo']],
    body: tableBody,
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    foot: [['', '', 'Total de Pausas:', totalPauseTime]],
    footStyles: { fillColor: [240, 242, 245], textColor: [0, 0, 0], fontStyle: 'bold' },
    margin: { top: 10 },
    didParseCell: function (data) {
      // Check if the row corresponds to a negative pause
      // data.row.index matches the index in tableBody
      const rowIndex = data.row.index;
      if (data.section === 'body' && rowIndex >= 0 && rowIndex < tableBody.length) {
        const isNegative = tableBody[rowIndex][3] === 'Negativo';
        if (isNegative) {
          data.cell.styles.textColor = dangerColor;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    }
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  // Observations
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > 280) {
      doc.addPage();
      y = 20;
    }
  };

  checkPageBreak(20);
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Observações", 14, y);
  y += 10;

  const addNoteSection = (title: string, content: string) => {
    checkPageBreak(30);
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, y);
    y += 6;
    
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'normal');
    
    const splitText = doc.splitTextToSize(content || 'Nenhuma observação.', 180);
    checkPageBreak(splitText.length * 5 + 10);
    doc.text(splitText, 14, y);
    y += (splitText.length * 5) + 8;
  };

  addNoteSection("Notas do Monitor", data.monitorNotes);
  addNoteSection("Pontos a Observar", data.observationPoints);
  addNoteSection("Nota para Supervisor", data.supervisorNote);

  // Save
  const cleanProtocol = (data.protocol || 'novo').replace(/[^a-z0-9]/gi, '_');
  doc.save(`relatorio_monitoria_${cleanProtocol}.pdf`);
};
