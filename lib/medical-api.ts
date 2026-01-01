import { MedicalAnalysis, Hospital } from '@/backend/entity';

export interface ChatResponse {
  analysis: MedicalAnalysis;
  hospitals: Hospital[];
  chat: any;
}

export async function fetchMedicalAnalysis(
  message: string, 
  chatId: string, 
  lat?: number, 
  lon?: number
): Promise<ChatResponse> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      chatId,
      lat,
      lon
    }),
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch medical analysis');
  }
  
  return res.json();
}

export async function fetchChatHistory(id: string, lat?: number, lon?: number): Promise<{ analysis: MedicalAnalysis; hospitals: Hospital[] } | null> {
  let url = `/api/history/${id}`;
  if (lat && lon) {
    url += `?lat=${lat}&lon=${lon}`;
  }
  
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error('Failed to fetch chat history');
  }
  
  const json = await res.json();
  if (!json.analysis) return null;

  return { 
    analysis: json.analysis, 
    hospitals: json.hospitals || []
  };
}

export async function fetchAllHistories(): Promise<any[]> {
  const res = await fetch('/api/history');
  
  if (!res.ok) {
    throw new Error('Failed to fetch histories');
  }
  
  const data = await res.json();
  return data.histories || [];
}
