import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import { chatRepository } from './repository';
import { ChatHistory, Message, MedicalAnalysis, Hospital } from './entity';

import { DEPARTMENT_CODES } from './constants';
import { parseStringPromise } from 'xml2js';

export class MedicalService {
  private openai: OpenAI | null = null;
  private gemini: GoogleGenerativeAI | null = null;
  private hiraApiKey: string | undefined;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    if (process.env.GEMINI_API_KEY) {
      this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    this.hiraApiKey = process.env.HIRA_API_KEY;
  }

  async processSymptom(message: string, chatId?: string, lat?: number, lon?: number): Promise<{ chat: ChatHistory; analysis: MedicalAnalysis; hospitals: Hospital[] }> {
    let chat: ChatHistory;
    
    if (chatId) {
      const existingChat = await chatRepository.getChatById(chatId);
      if (existingChat) {
        chat = existingChat;
      } else {
        chat = {
          id: chatId,
          title: message.slice(0, 20),
          department: '',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
      }
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

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };
    chat.messages.push(userMessage);

    const analysis = await this.getAIAnalysis(chat.messages);
    chat.department = analysis.department;
    
    const assistantMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: JSON.stringify(analysis),
      timestamp: Date.now(),
    };
    chat.messages.push(assistantMessage);

    await chatRepository.saveChat(chat);

    // Get recommended hospitals from HIRA API
    const hospitals = await this.getRecommendedHospitals(analysis.department, lat, lon);

    return { chat, analysis, hospitals };
  }

  private async getAIAnalysis(messages: Message[]): Promise<MedicalAnalysis> {
    const systemPrompt = `
      You are a medical guidance AI. Based on the user's symptoms, provide guidance on which medical department to visit and details about the condition.
      
      IMPORTANT: You MUST answer in KOREAN. (모든 응답은 반드시 한국어로 작성하세요.)

      Response Format (JSON):
      {
        "department": "진료과목명 (예: 내과, 정형외과 등)",
        "departmentReason": "해당 과를 추천하는 이유 (이미지의 예시처럼 '~증상은 주로 ~과에서 진료받으실 수 있습니다. ...' 형태)",
        "urgency": "낮음, 보통, 높음, 응급 중 하나",
        "summary": "증상에 대한 짧은 요약",
        "explanation": "해당 증상이 나타날 수 있는 원인과 대처법을 포함한 상세 설명",
        "cautions": "환자가 주의해야 할 사항",
        "copingMethods": "즉시 취할 수 있는 조치"
      }
    `;

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
        
        return JSON.parse(result.response.text());
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
        return JSON.parse(content || '{}');
      } else {
        return {
          department: "내과",
          departmentReason: "발열과 호흡기 증상은 주로 내과에서 진료받으실 수 있습니다.",
          urgency: "보통",
          summary: "API 키 미설정 모의 결과",
          explanation: "API 키가 없어 모의 데이터를 반환합니다.",
          cautions: "주의하세요.",
          copingMethods: "쉬세요."
        };
      }
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw error;
    }
  }

  private async getRecommendedHospitals(department: string, lat?: number, lon?: number): Promise<Hospital[]> {
    if (!this.hiraApiKey) {
      console.warn('HIRA_API_KEY is missing. Returning mock data.');
      return this.getMockHospitals();
    }

    try {
      // Find department code
      const deptKey = Object.keys(DEPARTMENT_CODES).find(k => department.includes(k)) || "내과";
      const deptCode = DEPARTMENT_CODES[deptKey];

      const baseUrl = 'https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList';
      // serviceKey must not be double encoded. URLSearchParams encodes it.
      // So we append it manually.
      const queryParams = new URLSearchParams({
        pageNo: '1',
        numOfRows: '10',
        dgsbjtCd: deptCode,
      });

      if (lat && lon) {
        queryParams.append('xPos', lon.toString());
        queryParams.append('yPos', lat.toString());
        queryParams.append('radius', '5000'); // Increase to 5km
      }

      const url = `${baseUrl}?serviceKey=${this.hiraApiKey}&${queryParams.toString()}`;
      console.log('Fetching hospitals from:', url.replace(this.hiraApiKey || '', 'HIDDEN'));
      
      const response = await fetch(url);
      const xml = await response.text();
      const result = await parseStringPromise(xml);

      // Robust check for items
      const body = result?.response?.body?.[0];
      const itemsContainer = body?.items?.[0];
      const items = itemsContainer?.item || [];
      
      if (items.length === 0) {
        console.warn('No hospitals found from HIRA API. Returning mocks.');
        return this.getMockHospitals();
      }

      return items.map((item: any) => {
        try {
          return {
            id: item.ykiho?.[0] || uuidv4(),
            name: item.yadmNm?.[0] || '병원 이름 정보 없음',
            address: item.addr?.[0] || '주소 정보 없음',
            phone: item.telno?.[0] || '전화번호 정보 없음',
            department: [deptKey],
            description: `${item.clCdNm?.[0] || '일반'} | ${item.emuberNm?.[0] || '응급실 미운영'}`,
            image: `https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop`
          };
        } catch (e) {
          console.error('Item mapping error:', e);
          return null;
        }
      }).filter((h: any) => h !== null) as Hospital[];

    } catch (error) {
      console.error('HIRA API Error:', error);
      return this.getMockHospitals();
    }
  }

  private getMockHospitals(): Hospital[] {
    return [
      {
        id: '1',
        name: '서울아산병원',
        address: '서울특별시 송파구 올림픽로43길 88',
        phone: '1688-7575',
        department: ['내과'],
        description: '국내 최대 규모의 종합병원',
        image: 'https://images.unsplash.com/photo-1587350859743-b15272ce100a?q=80&w=1000&auto=format&fit=crop'
      }
    ];
  }

  async getHistoryList() {
    return chatRepository.getAllChats();
  }

  async getChatDetail(id: string, lat?: number, lon?: number) {
    const chat = await chatRepository.getChatById(id);
    if (!chat) return null;

    const lastAssistant = [...chat.messages].reverse().find(m => m.role === 'assistant');
    let analysis: MedicalAnalysis | null = null;
    let hospitals: Hospital[] = [];

    if (lastAssistant) {
      try {
        analysis = JSON.parse(lastAssistant.content);
        if (analysis) {
          hospitals = await this.getRecommendedHospitals(analysis.department, lat, lon);
        }
      } catch (e) {
        console.error('Failed to parse analysis from history:', e);
      }
    }

    return { chat, analysis, hospitals };
  }
}

export const medicalService = new MedicalService();
