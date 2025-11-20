import React from 'react';
import { ReportFormState } from '../types';

interface Props {
  data: ReportFormState;
  onChange: (field: keyof ReportFormState, value: string) => void;
}

export const ObservationSection: React.FC<Props> = ({ data, onChange }) => {
  return (
    <section className="px-4 pb-6">
      <h2 className="mb-4 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        Observações
      </h2>
      
      <div className="space-y-5">
        <TextArea 
          label="Notas do Monitor" 
          placeholder="Digite as notas aqui..." 
          value={data.monitorNotes}
          onChange={(v) => onChange('monitorNotes', v)}
          rows={4}
        />
        <TextArea 
          label="Pontos a Observar" 
          placeholder="Liste os pontos de melhoria..." 
          value={data.observationPoints}
          onChange={(v) => onChange('observationPoints', v)}
          rows={4}
        />
        <TextArea 
          label="Nota para Supervisor" 
          placeholder="Deixe uma nota para o supervisor..." 
          value={data.supervisorNote}
          onChange={(v) => onChange('supervisorNote', v)}
          rows={3}
        />
      </div>
    </section>
  );
};

const TextArea: React.FC<{ 
  label: string; 
  placeholder: string; 
  value: string; 
  onChange: (val: string) => void;
  rows?: number;
}> = ({ label, placeholder, value, onChange, rows = 3 }) => (
  <label className="flex flex-col">
    <span className="pb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
    <textarea
      rows={rows}
      placeholder={placeholder}
      className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:placeholder:text-gray-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </label>
);