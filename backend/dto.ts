import { ChatHistory, Message, MedicalAnalysis } from './entity';

export interface ChatRequestDTO {
  message: string;
  chatId?: string;
  lat?: number;
  lon?: number;
}

export interface ChatResponseDTO {
  chatId: string;
  analysis: MedicalAnalysis;
  hospitals: any[]; // We'll refine this
}

export interface HistoryListDTO {
  histories: {
    id: string;
    title: string;
    department: string;
    createdAt: number;
  }[];
}

export interface ChatDetailDTO {
  history: ChatHistory;
}
