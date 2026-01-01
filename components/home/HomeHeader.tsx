import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function HomeHeader() {
  return (
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
      <style jsx>{`
        .header {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex-shrink: 0;
          padding: 12px 0 20px;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .brand h1 {
          font-size: 24px;
          font-weight: 800;
          color: var(--gray-800);
          letter-spacing: -0.5px;
        }
        .subtitle {
          font-size: 16px;
          color: var(--gray-500);
          line-height: 1.5;
          font-weight: 500;
          padding-left: 4px;
        }
      `}</style>
    </div>
  );
}
