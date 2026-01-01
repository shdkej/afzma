export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatHistory {
  id: string;
  title: string;
  department: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  department: string[];
  description: string;
  image?: string;
}

export interface MedicalAnalysis {
  department: string;
  summary: string;
  explanation: string;
  cautions: string;
  copingMethods: string;
}
