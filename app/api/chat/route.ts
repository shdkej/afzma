import { NextRequest } from 'next/server';
import { medicalController } from '@/backend/controller';

export async function POST(req: NextRequest) {
  return medicalController.handleChatRequest(req);
}
