
import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GeneralInfoSection } from './components/GeneralInfoSection';
import { PauseSection } from './components/PauseSection';
import { ObservationSection } from './components/ObservationSection';
import { ReportFormState, MonitoriaType, PauseBlock } from './types';
import { downloadFile, generateReportHtml, generateReportText, generatePDF } from './utils';

const INITIAL_STATE: ReportFormState = {
  monitoriaType: MonitoriaType.RETENCAO,
  operatorData: '',
  date: '',
  contract: '',
  protocol: '',
  communicationTime: '',
  pauses: [
    { id: '1', startTime: '09:00', interval: '', endTime: '10:45', isNegative: false, useIntervalMode: false }, 
    { id: '2', startTime: '', interval: '', endTime: '', isNegative: false, useIntervalMode: false }
  ],
  monitorNotes: '',
  observationPoints: '',
  supervisorNote: '',
};

function App() {
  const [formData, setFormData] = useState<ReportFormState>(INITIAL_STATE);

  const handleFieldChange = (field: keyof ReportFormState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePausesChange = (pauses: PauseBlock[]) => {
    setFormData((prev) => ({ ...prev, pauses }));
  };

  const handleClear = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o relatório? Todas as informações serão perdidas.')) {
      setFormData({
        monitoriaType: MonitoriaType.RETENCAO,
        operatorData: '',
        date: '',
        contract: '',
        protocol: '',
        communicationTime: '',
        pauses: [{ id: crypto.randomUUID(), startTime: '', interval: '', endTime: '', isNegative: false, useIntervalMode: false }],
        monitorNotes: '',
        observationPoints: '',
        supervisorNote: '',
      });
    }
  };

  const handleDownload = (format: 'word' | 'pdf' | 'docs') => {
    const filename = `relatorio_${formData.protocol || 'novo'}`;

    if (format === 'pdf') {
      // Use jsPDF to generate a true PDF file download
      generatePDF(formData);
    } else if (format === 'word') {
      // Generate an HTML file with .doc extension which Word can open
      const content = generateReportHtml(formData);
      downloadFile(`${filename}.doc`, content, 'application/msword');
    } else if (format === 'docs') {
      // Generate a plain text file
      const content = generateReportText(formData);
      downloadFile(`${filename}.txt`, content, 'text/plain');
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light font-sans dark:bg-background-dark">
      <Header onClear={handleClear} />
      
      <main className="flex-grow pb-32 print:pb-0">
        <GeneralInfoSection 
          data={formData} 
          onChange={handleFieldChange} 
        />
        
        <div className="my-2 h-px w-full bg-gray-200 dark:bg-gray-800 print:hidden" />
        
        <PauseSection 
          pauses={formData.pauses} 
          onChange={handlePausesChange} 
        />

        <div className="my-2 h-px w-full bg-gray-200 dark:bg-gray-800 print:hidden" />

        <ObservationSection 
          data={formData} 
          onChange={handleFieldChange} 
        />
      </main>

      <Footer onDownload={() => handleDownload('pdf')} />
    </div>
  );
}

export default App;