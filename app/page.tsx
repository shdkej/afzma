'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, History, ArrowRight, Activity, Plus } from 'lucide-react';

export default function Home() {
  const [input, setInput] = useState('');
  const [histories, setHistories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchHistories();
  }, []);

  const fetchHistories = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      setHistories(data.histories || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      if (data.chat?.id) {
        router.push(`/response/${data.chat.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="header">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="brand"
        >
          <Activity size={32} color="#2D5A27" />
          <h1>아프지마</h1>
        </motion.div>
        <p className="subtitle">어디가 아프신가요? AI가 가야 할 병원을 알려드릴게요.</p>
      </div>

      <div className="content">
        {histories.length > 0 && (
          <section className="history-section">
            <div className="section-title">
              <History size={16} />
              <span>최근 대화 내역</span>
            </div>
            <div className="history-list">
              {histories.map((h, i) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="history-item"
                  onClick={() => router.push(`/response/${h.id}`)}
                >
                  <div className="history-info">
                    <span className="history-title">{h.title}</span>
                    <span className="history-dept">{h.department}</span>
                  </div>
                  <ArrowRight size={16} color="#CCCCCC" />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <section className="guide-section">
          <div className="guide-card">
            <h3>궁금한 증상을 자유롭게 입력하세요</h3>
            <ul>
              <li>"갑자기 머리가 어지럽고 구토 증상이 있어요"</li>
              <li>"아이 열이 39도까지 올라갔어요"</li>
              <li>"무릎이 쑤시고 계단 오르기 힘들어요"</li>
            </ul>
          </div>
        </section>
      </div>

      <div className="input-container">
        <form onSubmit={handleSubmit} className="input-box">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="증상을 자세히 설명해주세요..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <button type="submit" className="send-button" disabled={isLoading}>
            {isLoading ? (
              <div className="loader" />
            ) : (
              <ArrowRight size={20} color="white" />
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        .home-container {
          padding: 40px 20px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }
        .header {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .brand h1 {
          font-size: 28px;
          font-weight: 800;
          color: var(--primary);
        }
        .subtitle {
          font-size: 16px;
          color: var(--gray-500);
          line-height: 1.5;
        }
        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--gray-500);
          margin-bottom: 16px;
        }
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .history-item {
          background: var(--white);
          padding: 16px;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: var(--shadow-sm);
          cursor: pointer;
        }
        .history-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .history-title {
          font-weight: 600;
          font-size: 15px;
        }
        .history-dept {
          font-size: 12px;
          color: var(--primary);
          background: var(--primary-extra-light);
          padding: 2px 8px;
          border-radius: 4px;
          width: fit-content;
        }
        .guide-card {
          background: var(--primary-extra-light);
          padding: 24px;
          border-radius: var(--radius);
          color: var(--primary);
        }
        .guide-card h3 {
          font-size: 16px;
          margin-bottom: 12px;
        }
        .guide-card ul {
          list-style: none;
          font-size: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          opacity: 0.8;
        }
        .input-container {
          position: sticky;
          bottom: 20px;
          padding-bottom: 20px;
        }
        .input-box {
          background: var(--white);
          border-radius: var(--radius);
          padding: 12px 16px;
          display: flex;
          align-items: flex-end;
          gap: 12px;
          box-shadow: var(--shadow-lg);
          border: 1px solid rgba(0,0,0,0.05);
        }
        .input-box textarea {
          flex: 1;
          border: none;
          resize: none;
          outline: none;
          font-size: 15px;
          min-height: 24px;
          max-height: 120px;
          padding: 4px 0;
        }
        .send-button {
          background: var(--primary);
          width: 40px;
          height: 40px;
          border-radius: full;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s;
        }
        .send-button:active {
          transform: scale(0.95);
        }
        .loader {
          width: 20px;
          height: 20px;
          border: 2px solid white;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
