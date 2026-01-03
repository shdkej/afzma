'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { MedicalAnalysis, Hospital } from '@/backend/entity';
import { fetchMedicalAnalysis, fetchChatHistory } from '@/lib/medical-api';

export function useMedicalResponse() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ analysis: MedicalAnalysis; hospitals: Hospital[] | null } | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [snap, setSnap] = useState<string | number | null>(0.12);
  const [followUpInput, setFollowUpInput] = useState('');
  const [showFollowUp, setShowFollowUp] = useState(false);

  const onAskAgain = () => {
    setShowFollowUp(true);
    // Scroll to bottom after state change
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      handleChat(message);
    } else {
      loadHistory();
    }
  }, [id, searchParams]);

  useEffect(() => {
    if (data?.hospitals && data.hospitals.length > 0) {
      setSnap(0.5);
    }
  }, [data]);

  const handleChat = async (message: string) => {
    setLoading(true);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    try {
      const result = await fetchMedicalAnalysis(
        message,
        id as string,
        lat ? parseFloat(lat) : undefined,
        lon ? parseFloat(lon) : undefined
      );
      setData({ analysis: result.analysis, hospitals: result.hospitals });
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const loadHistory = async () => {
    setLoading(true);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    try {
      const result = await fetchChatHistory(
        id as string,
        lat ? parseFloat(lat) : undefined,
        lon ? parseFloat(lon) : undefined
      );
      if (result) {
        setData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const handleFollowUpSubmit = async (messageOrEvent?: string | React.FormEvent, e?: React.FormEvent) => {
    const event = (messageOrEvent as React.FormEvent) ?? e;
    event?.preventDefault();

    const nextMessage = (typeof messageOrEvent === 'string' ? messageOrEvent : followUpInput).trim();
    if (!nextMessage || loading) return;

    setFollowUpInput('');
    setShowFollowUp(false);
    await handleChat(nextMessage);
  };

  const userSymptom = searchParams.get('message') || '내용 없음';

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case '응급': return { bg: '#FEE2E2', text: '#B91C1C' };
      case '높음': return { bg: '#FFEDD5', text: '#EA580C' };
      case '보통': return { bg: '#FEF3C7', text: '#D97706' };
      default: return { bg: '#F3F4F6', text: '#4B5563' };
    }
  };

  const urgencyStyle = getUrgencyColor(data?.analysis.urgency);

  return {
    id,
    loading,
    data,
    selectedHospital,
    setSelectedHospital,
    snap,
    setSnap,
    followUpInput,
    setFollowUpInput,
    handleFollowUpSubmit,
    userSymptom,
    urgencyStyle,
    showFollowUp,
    onAskAgain,
    router
  };
}
