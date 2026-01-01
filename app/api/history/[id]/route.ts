import { NextRequest } from 'next/server';
import { medicalController } from '@/backend/controller';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Await params in Next.js 15+ 
  // In Next.js 14 it was synchronous, in 15 it's a promise.
  // I'll assume 15 since it's @latest.
  const { id } = await params; 
  return medicalController.handleGetChatDetail(id);
}
