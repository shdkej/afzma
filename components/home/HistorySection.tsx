import { motion } from 'framer-motion';
import { History, ArrowRight } from 'lucide-react';

interface HistorySectionProps {
  histories: any[];
  onItemClick: (id: string) => void;
}

export default function HistorySection({ histories, onItemClick }: HistorySectionProps) {
  if (histories.length === 0) return null;

  return (
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
            onClick={() => onItemClick(h.id)}
          >
            <div className="history-info">
              <span className="history-title">{h.title}</span>
              <span className="history-dept">{h.department}</span>
            </div>
            <ArrowRight size={16} color="#CCCCCC" />
          </motion.div>
        ))}
      </div>
      <style jsx>{`
        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 700;
          color: var(--gray-800);
          margin-bottom: 20px;
          padding-left: 4px;
        }
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .history-item {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 20px;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: var(--shadow-card);
          border: var(--glass-border);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          position: relative;
          overflow: hidden;
        }
        .history-item::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: var(--glass-lighting);
          opacity: 0.5;
          pointer-events: none;
        }
        .history-item:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: var(--shadow-floating);
          background: rgba(255, 255, 255, 0.85);
        }
        .history-item:active {
          transform: scale(0.98);
        }
        .history-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          z-index: 1;
        }
        .history-title {
          font-weight: 700;
          font-size: 16px;
          color: var(--gray-800);
        }
        .history-dept {
          font-size: 12px;
          font-weight: 600;
          color: var(--primary);
          background: var(--primary-soft);
          padding: 4px 10px;
          border-radius: 8px;
          width: fit-content;
        }
      `}</style>
    </section>
  );
}
