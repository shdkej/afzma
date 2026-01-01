'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocation } from '@/hooks/useLocation';
import { fetchAllHistories } from '@/lib/medical-api';
import styles from './page.module.css';

// Sub-components
import HomeHeader from '@/components/home/HomeHeader';
import HistorySection from '@/components/home/HistorySection';
import GuideSection from '@/components/home/GuideSection';
import ChatInput from '@/components/common/ChatInput';

export default function Home() {
  const [input, setInput] = useState('');
  const [histories, setHistories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { location } = useLocation();
  const router = useRouter();

  useEffect(() => {
    loadHistories();
  }, []);

  const loadHistories = async () => {
    try {
      const data = await fetchAllHistories();
      setHistories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    // Immediately navigate with the message and location
    const tempId = crypto.randomUUID();
    let url = `/response/${tempId}?message=${encodeURIComponent(input)}`;
    if (location) {
      url += `&lat=${location.lat}&lon=${location.lon}`;
    }
    router.push(url);
  };

  const handleHistoryItemClick = (id: string) => {
    router.push(`/response/${id}`);
  };

  return (
    <div className={styles.homeContainer}>
      <HomeHeader />

      <div className={styles.content}>
        <GuideSection />
        <HistorySection histories={histories} onItemClick={handleHistoryItemClick} />
      </div>

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
