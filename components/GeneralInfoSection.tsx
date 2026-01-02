
import React, { useState, useEffect, useRef } from 'react';
import { MonitoriaType, ReportFormState } from '../types';
import { Save, Check, Users, Trash2 } from 'lucide-react';
import { saveOperatorName, getSavedOperatorNames, deleteSavedOperatorName } from '../utils';

interface Props {
  data: ReportFormState;
  onChange: (field: keyof ReportFormState, value: any) => void;
}

export const GeneralInfoSection: React.FC<Props> = ({ data, onChange }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [showOperatorList, setShowOperatorList] = useState(false);
  const [savedOperators, setSavedOperators] = useState<string[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSavedOperators(getSavedOperatorNames());
    
    const handleClickOutside = (event: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setShowOperatorList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveOperator = () => {
    if (data.operatorData.trim()) {
      saveOperatorName(data.operatorData.trim());
      setSavedOperators(getSavedOperatorNames());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleSelectOperator = (name: string) => {
    onChange('operatorData', name);
    setShowOperatorList(false);
  };

  const handleDeleteOperator = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    deleteSavedOperatorName(name);
    setSavedOperators(getSavedOperatorNames());
  };

  return (
    <section className="px-4 pb-6 pt-5">
      <h2 className="mb-4 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        Informações Gerais
      </h2>
      
      <div className="space-y-5">
        <div>
          <p className="pb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Tipo de Monitoria
          </p>
          <div className="flex h-10 w-full rounded-lg bg-gray-200 p-1 dark:bg-gray-800">
            {Object.values(MonitoriaType).map((type) => {
              const isSelected = data.monitoriaType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onChange('monitoriaType', type)}
                  className={`flex flex-1 items-center justify-center rounded-md text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  <span className="truncate px-1">{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        <InputGroup label="Dados do operador">
          <div className="relative flex items-center" ref={listRef}>
            <input
              type="text"
              placeholder="Nome ou ID do operador"
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-4 pr-24 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:placeholder:text-gray-500"
              value={data.operatorData}
              onChange={(e) => onChange('operatorData', e.target.value)}
            />
            
            <div className="absolute right-2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowOperatorList(!showOperatorList)}
                title="Ver lista de operadores salvos"
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-all ${showOperatorList ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-primary/10 hover:text-primary dark:bg-gray-800 dark:text-gray-400'}`}
              >
                <Users className="h-4 w-4" />
              </button>
              
              <button
                type="button"
                onClick={handleSaveOperator}
                title="Salvar este operador na lista"
                className={`flex h-8 w-8 items-center justify-center rounded-md transition-all ${
                  isSaved 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-500 hover:bg-primary hover:text-white dark:bg-gray-800 dark:text-gray-400'
                }`}
              >
                {isSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              </button>
            </div>

            {showOperatorList && (
              <div className="absolute top-full left-0 z-[100] mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
                <div className="max-h-60 overflow-y-auto">
                  {savedOperators.length === 0 ? (
                    <div className="p-5 text-center text-sm text-gray-500 dark:text-gray-400">
                      Nenhum operador salvo. Digite um nome e clique em salvar para começar.
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                      {savedOperators.map((name) => (
                        <li 
                          key={name}
                          onClick={() => handleSelectOperator(name)}
                          className="flex cursor-pointer items-center justify-between p-3.5 transition-colors hover:bg-primary/5 dark:hover:bg-primary/10"
                        >
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {name}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteOperator(e, name)}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-danger/10 hover:text-danger transition-all"
                            title="Remover da lista"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex justify-end border-t border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-800/50">
                   <button 
                    type="button"
                    onClick={() => setShowOperatorList(false)}
                    className="text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-primary transition-colors"
                   >
                    Fechar Lista
                   </button>
                </div>
              </div>
            )}
          </div>
        </InputGroup>

        <div className="flex flex-wrap gap-4">
          <InputGroup label="Data" className="min-w-[160px] flex-1">
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:placeholder:text-gray-500"
              value={data.date}
              onChange={(e) => onChange('date', e.target.value)}
            />
          </InputGroup>
          <InputGroup label="Contrato" className="min-w-[160px] flex-1">
            <input
              type="text"
              placeholder="Número do contrato"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:placeholder:text-gray-500"
              value={data.contract}
              onChange={(e) => onChange('contract', e.target.value)}
            />
          </InputGroup>
        </div>

        <InputGroup label="Protocolo de atendimento">
          <input
            type="text"
            placeholder="Ex: 20240101-12345"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:placeholder:text-gray-500"
            value={data.protocol}
            onChange={(e) => onChange('protocol', e.target.value)}
          />
        </InputGroup>

        <InputGroup label="Momento da comunicação">
          <input
            type="time"
            step="1"
            placeholder="HH:MM:SS"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:placeholder:text-gray-500"
            value={data.communicationTime}
            onChange={(e) => onChange('communicationTime', e.target.value)}
          />
        </InputGroup>
      </div>
    </section>
  );
};

const InputGroup: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({
  label,
  children,
  className = '',
}) => (
  <label className={`flex flex-col ${className}`}>
    <span className="pb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
    {children}
  </label>
);
