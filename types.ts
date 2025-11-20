export enum MonitoriaType {
  RETENCAO = 'Retenção',
  SAC = 'SAC',
  SAC_WHATSAPP = 'SAC Whatsapp',
}

export interface PauseBlock {
  id: string;
  startTime: string;
  interval: string;
  endTime: string;
}

export interface ReportFormState {
  monitoriaType: MonitoriaType;
  operatorData: string;
  date: string;
  contract: string;
  protocol: string;
  communicationTime: string;
  pauses: PauseBlock[];
  monitorNotes: string;
  observationPoints: string;
  supervisorNote: string;
}

export const DEFAULT_PAUSE_LIMIT_MINUTES = 90; // 01:30