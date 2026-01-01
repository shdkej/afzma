import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import { chatRepository } from './repository';
import { ChatHistory, Message, MedicalAnalysis, Hospital } from './entity';

export class MedicalService {
  private openai: OpenAI | null = null;
  private gemini: GoogleGenerativeAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    if (process.env.GEMINI_API_KEY) {
      this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
  }

  async processSymptom(message: string, chatId?: string): Promise<{ chat: ChatHistory; analysis: MedicalAnalysis; hospitals: Hospital[] }> {
    let chat: ChatHistory;
    
    if (chatId) {
      const existingChat = await chatRepository.getChatById(chatId);
      if (!existingChat) throw new Error('Chat not found');
      chat = existingChat;
    } else {
      chat = {
        id: uuidv4(),
        title: message.slice(0, 20),
        department: '',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    }

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };
    chat.messages.push(userMessage);

    // Call AI
    const analysis = await this.getAIAnalysis(chat.messages);
    
    // Update chat info
    chat.department = analysis.department;
    
    // Add assistant message (store the raw JSON or formatted string)
    const assistantMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: JSON.stringify(analysis),
      timestamp: Date.now(),
    };
    chat.messages.push(assistantMessage);

    await chatRepository.saveChat(chat);

    // Get recommended hospitals (mocking for now)
    const hospitals = this.getRecommendedHospitals(analysis.department);

    return { chat, analysis, hospitals };
  }

  private async getAIAnalysis(messages: Message[]): Promise<MedicalAnalysis> {
    const systemPrompt = `
      You are a medical guidance AI. Based on the user's symptoms, provide guidance on which medical department to visit and details about the condition.
      
      Response Format (JSON):
      {
        "department": "Department Name (e.g., Internal Medicine, Orthopedics)",
        "summary": "Short summary of the symptoms",
        "explanation": "Detailed explanation of possible causes",
        "cautions": "Things to be careful about",
        "copingMethods": "Immediate steps or coping methods"
      }
      
      Requirements:
      - department must be clear and concise.
      - explanation should be friendly and calming.
      - ALWAYS include a disclaimer that this is not a medical diagnosis.
    `;

    // Try Gemini first, then OpenAI as fallback (or vice versa based on user preference)
    // For this implementation, I'll attempt whichever is available.
    try {
      if (this.gemini) {
        const model = this.gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
        const history = messages.slice(0, -1).map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        }));
        
        const result = await model.generateContent({
          contents: [
            { role: 'user', parts: [{ text: systemPrompt }] },
            ...history as any,
            { role: 'user', parts: [{ text: messages[messages.length - 1].content }] }
          ],
          generationConfig: { responseMimeType: "application/json" }
        });
        
        const response = result.response.text();
        return JSON.parse(response);
      } else if (this.openai) {
        const response = await this.openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map(m => ({ role: m.role, content: m.content }))
          ],
          response_format: { type: "json_object" }
        });
        
        const content = response.choices[0].message.content;
        if (!content) throw new Error('Empty response from OpenAI');
        return JSON.parse(content);
      } else {
        // Mock response if no API keys (for development/demo)
        return {
          department: "내과 (가정의학과)",
          summary: "증상에 대한 모의 분석 결과입니다.",
          explanation: "API 키가 설정되지 않아 모의 데이터를 반환합니다. 실제 운영 시 API 키를 등록해주세요.",
          cautions: "증상이 심해지면 즉시 병원을 방문하세요.",
          copingMethods: "충분한 휴식을 취하고 수분을 섭취하세요."
        };
      }
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw error;
    }
  }

  private getRecommendedHospitals(department: string): Hospital[] {
    // Mock data for hospitals
    return [
      {
        id: '1',
        name: '서울아산병원',
        address: '서울특별시 송파구 올림픽로43길 88',
        phone: '1688-7575',
        department: ['내과', '외과', '소아과'],
        description: '국내 최대 규모의 종합병원으로 최첨단 의료 시설을 갖추고 있습니다.',
        image: 'https://images.unsplash.com/photo-1587350859743-b15272ce100a?q=80&w=1000&auto=format&fit=crop'
      },
      {
        id: '2',
        name: '삼성서울병원',
        address: '서울특별시 강남구 일원로 81',
        phone: '1599-3114',
        department: ['내과', '정형외과', '이비인후과'],
        description: '환자 중심의 의료 서비스를 제공하며 암 치료에 특화되어 있습니다.',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop'
      },
      {
        id: '3',
        name: '강남세브란스병원',
        address: '서울특별시 강남구 언주로 211',
        phone: '1599-6114',
        department: ['내과', '안과', '피부과'],
        description: '강남 지역의 대표적인 대학병원으로 전문적인 진료를 제공합니다.',
        image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1000&auto=format&fit=crop'
      }
    ];
  }

  async getHistoryList() {
    return chatRepository.getAllChats();
  }

  async getChatDetail(id: string) {
    return chatRepository.getChatById(id);
  }
}

export const medicalService = new MedicalService();
