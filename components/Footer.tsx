import React from 'react';
import { FileText, FileType2, FileUp } from 'lucide-react';

interface FooterProps {
  onDownload: (format: 'word' | 'pdf' | 'docs') => void;
}

export const Footer: React.FC<FooterProps> = ({ onDownload }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-background-light/90 px-4 py-3 backdrop-blur-sm dark:border-gray-700 dark:bg-background-dark/90">
      <div className="mx-auto flex max-w-screen-md items-center justify-center gap-3">
        <ActionButton 
          icon={<FileText className="h-5 w-5" />} 
          label="Word" 
          onClick={() => onDownload('word')}
        />
        <ActionButton 
          icon={<FileType2 className="h-5 w-5" />} 
          label="PDF" 
          onClick={() => onDownload('pdf')}
        />
        <ActionButton 
          icon={<FileUp className="h-5 w-5" />} 
          label="Docs" 
          onClick={() => onDownload('docs')}
        />
      </div>
    </footer>
  );
};

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="group flex h-12 flex-1 flex-col items-center justify-center gap-1 rounded-xl bg-primary/10 text-primary transition-all hover:bg-primary/20 active:scale-95 dark:bg-primary/20 dark:hover:bg-primary/30"
  >
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
  </button>
);
