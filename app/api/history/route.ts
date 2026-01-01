import { NextRequest } from 'next/server';
import { medicalController } from '@/backend/controller';

export async function GET() {
  return medicalController.handleGetHistoryList();
}
