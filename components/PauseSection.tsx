
import React from 'react';
import { PlusCircle, AlertCircle, Trash2, Clock, AlertTriangle, Timer } from 'lucide-react';
import { PauseBlock, DEFAULT_PAUSE_LIMIT_MINUTES } from '../types';
import { timeToMinutes, minutesToTime, calculateDuration, calculateTotalPauses, sumTime } from '../utils';

interface Props {
  pauses: PauseBlock[];
  onChange: (pauses: PauseBlock[]) => void;
}

export const PauseSection: React.FC<Props> = ({ pauses, onChange }) => {
  
  const addPauseBlock = () => {
    const newBlock: PauseBlock = {
      id: crypto.randomUUID(),
      startTime: '',
      interval: '', 
      endTime: '',
      isNegative: false,
      useIntervalMode: false,
    };
    onChange([...pauses, newBlock]);
  };

  const removePauseBlock = (id: string) => {
    onChange(pauses.filter(p => p.id !== id));
  };

  const updatePauseBlock = (id: string, field: keyof PauseBlock, value: any) => {
    const updatedPauses = pauses.map(p => {
      if (p.id !== id) return p;
      return { ...p, [field]: value };
    });
    onChange(updatedPauses);
  };

  // Helper to get the effective duration of a block for the TOTAL calculation
  // We need to replicate the logic used in the card display
  const getBlockDuration = (block: PauseBlock) => {
    if (block.useIntervalMode) {
      // Logic: Difference between Interval and End (Subtraction)
      // Previously this was sumTime, now changed to calculateDuration as requested
      return calculateDuration(block.interval, block.endTime);
    } else {
      // Logic: End - Start
      return calculateDuration(block.startTime, block.endTime);
    }
  };

  // Calculate total based on the specific logic of each block
  const totalMinutes = pauses.reduce((acc, curr) => acc + timeToMinutes(getBlockDuration(curr)), 0);
  const totalPauseTime = minutesToTime(totalMinutes);

  return (
    <section className="px-4 pb-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          Gestão de Pausas
        </h2>
      </div>
      
      <div className="space-y-4">
        {pauses.map((pause) => (
          <PauseBlockCard 
            key={pause.id} 
            data={pause} 
            onUpdate={updatePauseBlock} 
            onRemove={removePauseBlock} 
            showRemove={pauses.length > 1}
            calculatedDuration={getBlockDuration(pause)}
          />
        ))}

        <div className="flex items-center justify-between rounded-xl bg-primary/5 p-3 px-4 dark:bg-primary/10">
          <div className="flex items-center gap-2 text-primary">
            <Clock className="h-5 w-5" />
            <span className="font-semibold">Tempo Total Acumulado:</span>
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {totalPauseTime}
          </span>
        </div>

        <button
          onClick={addPauseBlock}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 py-3.5 text-sm font-semibold text-primary transition-all hover:border-primary/60 hover:bg-primary/10 active:scale-[0.99] dark:border-primary/50 dark:bg-primary/10 dark:hover:bg-primary/20"
        >
          <PlusCircle className="h-5 w-5" />
          Adicionar Bloco de Pausa
        </button>
      </div>
    </section>
  );
};

interface PauseCardProps {
  data: PauseBlock;
  onUpdate: (id: string, field: keyof PauseBlock, value: any) => void;
  onRemove: (id: string) => void;
  showRemove: boolean;
  calculatedDuration: string;
}

const PauseBlockCard: React.FC<PauseCardProps> = ({ data, onUpdate, onRemove, showRemove, calculatedDuration }) => {
  const durationMinutes = timeToMinutes(calculatedDuration);
  const limitExceeded = durationMinutes > DEFAULT_PAUSE_LIMIT_MINUTES;
  
  // Styles for Negative Interval
  const inputColorClass = data.isNegative 
    ? 'text-danger font-bold bg-danger/5 border-danger/30' 
    : 'text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700';

  return (
    <div className={`relative rounded-xl border p-4 shadow-sm transition-colors ${data.isNegative ? 'border-danger/50 bg-danger/5' : 'border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900/50'}`}>
      
      {/* Header Actions */}
      <div className="absolute -right-2 -top-2 flex items-center gap-2">
        
        {/* Interval Mode Toggle */}
        <button 
          onClick={() => onUpdate(data.id, 'useIntervalMode', !data.useIntervalMode)}
          className={`flex h-7 w-7 items-center justify-center rounded-full border shadow transition-colors ${data.useIntervalMode ? 'bg-primary text-white border-primary' : 'bg-gray-200 text-gray-500 border-transparent hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400'}`}
          title={data.useIntervalMode ? "Modo Intervalo Ativado (Subtração)" : "Modo Padrão (Subtração)"}
        >
          <Timer className="h-3.5 w-3.5" />
        </button>

        {/* Negative Toggle */}
        <button 
          onClick={() => onUpdate(data.id, 'isNegative', !data.isNegative)}
          className={`flex h-7 w-7 items-center justify-center rounded-full border shadow transition-colors ${data.isNegative ? 'bg-danger text-white border-danger' : 'bg-gray-200 text-gray-500 border-transparent hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-400'}`}
          title="Intervalo Negativo"
        >
          <AlertTriangle className="h-3.5 w-3.5" />
        </button>

        {showRemove && (
          <button 
            onClick={() => onRemove(data.id)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-500 shadow hover:bg-danger hover:text-white dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-danger"
            title="Remover bloco"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <TimeInput 
          label="Início" 
          value={data.startTime} 
          onChange={(val) => onUpdate(data.id, 'startTime', val)}
          className={inputColorClass}
        />
        
        {/* Interval Input: VISIBLE only if useIntervalMode is TRUE */}
        <div className={data.useIntervalMode ? 'block' : 'invisible'}>
          <TimeInput 
            label="Intervalo" 
            value={data.interval} 
            onChange={(val) => onUpdate(data.id, 'interval', val)}
            className={inputColorClass}
          />
        </div>

        <TimeInput 
          label="Término" 
          value={data.endTime} 
          onChange={(val) => onUpdate(data.id, 'endTime', val)}
          className={inputColorClass}
        />
      </div>

      {/* Status Bar (Result) */}
      <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2.5 dark:bg-gray-800">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tempo do Bloco:
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${limitExceeded ? 'text-danger' : 'text-gray-900 dark:text-white'}`}>
            {calculatedDuration || '00:00'}
          </span>
          {limitExceeded && (
            <>
              <AlertCircle className="h-4 w-4 text-danger" />
              <span className="text-xs font-medium text-danger">
                (Max {minutesToTime(DEFAULT_PAUSE_LIMIT_MINUTES)})
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const TimeInput: React.FC<{ label: string; value: string; onChange: (val: string) => void; className?: string }> = ({ label, value, onChange, className }) => (
  <label className="flex flex-col">
    <span className={`mb-1.5 text-xs font-medium ${className?.includes('text-danger') ? 'text-danger' : 'text-gray-700 dark:text-gray-300'}`}>{label}</span>
    <input
      type="time"
      className={`w-full rounded-lg border px-2 py-2 text-center text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:placeholder:text-gray-500 ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </label>
);
