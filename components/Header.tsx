import React from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';

interface HeaderProps {
  onClear: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onClear }) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200/10 bg-background-light px-4 py-3 backdrop-blur-md dark:bg-background-dark/95 dark:border-gray-700/50">
      <button 
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-800 transition-colors hover:bg-gray-200/50 active:bg-gray-200 dark:text-white dark:hover:bg-gray-700/50 dark:active:bg-gray-700"
        aria-label="Go back"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>
      <h1 className="flex-1 text-center text-lg font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
        Novo Relatório de Monitoria
      </h1>
      <button 
        onClick={onClear}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-danger/10 hover:text-danger active:bg-danger/20 dark:text-gray-400 dark:hover:text-danger"
        aria-label="Limpar relatório"
        title="Limpar Relatório"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </header>
  );
};