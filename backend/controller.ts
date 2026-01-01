import { NextRequest, NextResponse } from 'next/server';
import { medicalService } from './service';
import { ChatRequestDTO } from './dto';

export class MedicalController {
  async handleChatRequest(req: NextRequest) {
    try {
      const body: ChatRequestDTO = await req.json();
      const { message, chatId, lat, lon } = body;

      if (!message) {
        return NextResponse.json({ error: 'Message is required' }, { status: 400 });
      }

      // Read like a book: Process symptoms -> Return result
      const result = await medicalService.processSymptom(message, chatId, lat, lon);

      return NextResponse.json(result);
    } catch (error: any) {
      console.error('Controller Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  async handleGetHistoryList() {
    try {
      const histories = await medicalService.getHistoryList();
      return NextResponse.json({
        histories: histories.map(h => ({
          id: h.id,
          title: h.title,
          department: h.department,
          createdAt: h.createdAt,
        }))
      });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  async handleGetChatDetail(id: string, lat?: number, lon?: number) {
    try {
      const result = await medicalService.getChatDetail(id, lat, lon);
      if (!result) {
        return NextResponse.json({ error: 'History not found' }, { status: 404 });
      }
      return NextResponse.json(result);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}

export const medicalController = new MedicalController();
