import React from 'react';
import { MonitoriaType, ReportFormState } from '../types';

interface Props {
  data: ReportFormState;
  onChange: (field: keyof ReportFormState, value: any) => void;
}

export const GeneralInfoSection: React.FC<Props> = ({ data, onChange }) => {
  return (
    <section className="px-4 pb-6 pt-5">
      <h2 className="mb-4 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
        Informações Gerais
      </h2>
      
      <div className="space-y-5">
        {/* Monitoria Type Radio Group */}
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

        {/* Operator Data */}
        <InputGroup label="Dados do operador">
          <input
            type="text"
            placeholder="Nome ou ID do operador"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:placeholder:text-gray-500"
            value={data.operatorData}
            onChange={(e) => onChange('operatorData', e.target.value)}
          />
        </InputGroup>

        {/* Date & Contract Row */}
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

        {/* Protocol */}
        <InputGroup label="Protocolo de atendimento">
          <input
            type="text"
            placeholder="Ex: 20240101-12345"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-900/50 dark:text-white dark:placeholder:text-gray-500"
            value={data.protocol}
            onChange={(e) => onChange('protocol', e.target.value)}
          />
        </InputGroup>

        {/* Communication Time */}
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