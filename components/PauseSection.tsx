import React from 'react';
import { PlusCircle, AlertCircle, Trash2, Clock } from 'lucide-react';
import { PauseBlock, DEFAULT_PAUSE_LIMIT_MINUTES } from '../types';
import { timeToMinutes, minutesToTime, calculateDuration, addTime, calculateTotalPauses } from '../utils';

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
    };
    onChange([...pauses, newBlock]);
  };

  const removePauseBlock = (id: string) => {
    onChange(pauses.filter(p => p.id !== id));
  };

  const updatePauseBlock = (id: string, field: keyof PauseBlock, value: string) => {
    const updatedPauses = pauses.map(p => {
      if (p.id !== id) return p;
      
      const newBlock = { ...p, [field]: value };

      // Auto-calculation logic
      if (field === 'startTime' && newBlock.endTime) {
        // Changed start, have end -> calc interval
        newBlock.interval = calculateDuration(value, newBlock.endTime);
      } else if (field === 'endTime' && newBlock.startTime) {
        // Changed end, have start -> calc interval
        newBlock.interval = calculateDuration(newBlock.startTime, value);
      } else if (field === 'interval' && newBlock.startTime) {
        // Changed interval, have start -> calc end
        newBlock.endTime = addTime(newBlock.startTime, value);
      }

      return newBlock;
    });
    onChange(updatedPauses);
  };

  const totalPauseTime = calculateTotalPauses(pauses);

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
  onUpdate: (id: string, field: keyof PauseBlock, value: string) => void;
  onRemove: (id: string) => void;
  showRemove: boolean;
}

const PauseBlockCard: React.FC<PauseCardProps> = ({ data, onUpdate, onRemove, showRemove }) => {
  const durationMinutes = timeToMinutes(data.interval);
  const limitExceeded = durationMinutes > DEFAULT_PAUSE_LIMIT_MINUTES;
  
  return (
    <div className="relative rounded-xl border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
      {showRemove && (
        <button 
          onClick={() => onRemove(data.id)}
          className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-500 shadow hover:bg-danger hover:text-white dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-danger"
          title="Remover bloco"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
      
      <div className="grid grid-cols-3 gap-3">
        <TimeInput 
          label="Início" 
          value={data.startTime} 
          onChange={(val) => onUpdate(data.id, 'startTime', val)} 
        />
        <TimeInput 
          label="Intervalo" 
          value={data.interval} 
          onChange={(val) => onUpdate(data.id, 'interval', val)} 
        />
        <TimeInput 
          label="Término" 
          value={data.endTime} 
          onChange={(val) => onUpdate(data.id, 'endTime', val)} 
        />
      </div>

      {/* Status Bar */}
      <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2.5 dark:bg-gray-800">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tempo do Bloco:
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${limitExceeded ? 'text-danger' : 'text-gray-900 dark:text-white'}`}>
            {data.interval || '00:00'}
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

const TimeInput: React.FC<{ label: string; value: string; onChange: (val: string) => void }> = ({ label, value, onChange }) => (
  <label className="flex flex-col">
    <span className="mb-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">{label}</span>
    <input
      type="time"
      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-2 py-2 text-center text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </label>
);