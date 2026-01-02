
import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { GeneralInfoSection } from './components/GeneralInfoSection';
import { PauseSection } from './components/PauseSection';
import { ObservationSection } from './components/ObservationSection';
import { ReportFormState, MonitoriaType, PauseBlock } from './types';
import { downloadFile, generateReportHtml, generateReportText, generatePDF } from './utils';

// Função para gerar IDs únicos com fallback para ambientes sem crypto.randomUUID
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11);
};

const INITIAL_STATE = (): ReportFormState => ({
  monitoriaType: MonitoriaType.RETENCAO,
  operatorData: '', 
  date: '',
  contract: '',
  protocol: '',
  communicationTime: '',
  pauses: [
    { id: generateId(), startTime: '', interval: '', endTime: '', isNegative: false, useIntervalMode: false }, 
    { id: generateId(), startTime: '', interval: '', endTime: '', isNegative: false, useIntervalMode: false }
  ],
  monitorNotes: '',
  observationPoints: '',
  supervisorNote: '',
});

function App() {
  const [formData, setFormData] = useState<ReportFormState>(INITIAL_STATE());

  const handleFieldChange = (field: keyof ReportFormState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePausesChange = (pauses: PauseBlock[]) => {
    setFormData((prev) => ({ ...prev, pauses }));
  };

  const handleClear = () => {
    // Usando window.confirm explicitamente para evitar erros de escopo global
    const isConfirmed = window.confirm('Tem certeza que deseja limpar todo o relatório? Todas as informações digitadas serão perdidas.');
    if (isConfirmed) {
      setFormData(INITIAL_STATE());
    }
  };

  const handleDownload = (format: 'word' | 'pdf' | 'docs') => {
    if (format === 'pdf') {
      generatePDF(formData);
    } else if (format === 'word') {
      const filename = `relatorio_${formData.protocol || 'novo'}`;
      const content = generateReportHtml(formData);
      downloadFile(`${filename}.doc`, content, 'application/msword');
    } else if (format === 'docs') {
      const filename = `relatorio_${formData.protocol || 'novo'}`;
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
