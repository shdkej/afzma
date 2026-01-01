import { motion } from 'framer-motion';
import { History, ArrowRight } from 'lucide-react';

interface HistorySectionProps {
  histories: any[];
  onItemClick: (id: string) => void;
}

import styles from './HistorySection.module.css';

export default function HistorySection({ histories, onItemClick }: HistorySectionProps) {
  if (histories.length === 0) return null;

  return (
    <section className={styles.historySection}>
      <div className={styles.sectionTitle}>
        <History size={16} />
        <span>최근 대화 내역</span>
      </div>
      <div className={styles.historyList}>
        {histories.map((h, i) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={styles.historyItem}
            onClick={() => onItemClick(h.id)}
          >
            <div className={styles.historyInfo}>
              <span className={styles.historyTitle}>{h.title}</span>
              <span className={styles.historyDept}>{h.department}</span>
            </div>
            <ArrowRight size={16} color="#CCCCCC" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
