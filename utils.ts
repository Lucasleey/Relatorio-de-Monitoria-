import { ReportFormState } from './types';

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
${data.pauses.map((p, i) => `Bloco ${i + 1}: Início ${p.startTime} | Intervalo ${p.interval} | Término ${p.endTime}`).join('\n')}

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
        .notes { background-color: #f9f9f9; padding: 15px; border-radius: 4px; border: 1px solid #eee; white-space: pre-wrap; }
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
            </tr>
          </thead>
          <tbody>
            ${data.pauses.map(p => `
              <tr>
                <td>${p.startTime || '-'}</td>
                <td>${p.interval || '-'}</td>
                <td>${p.endTime || '-'}</td>
              </tr>
            `).join('')}
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
