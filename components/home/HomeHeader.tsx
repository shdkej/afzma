import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

import styles from './HomeHeader.module.css';

export default function HomeHeader() {
  return (
    <div className={styles.header}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.brand}
      >
        <Activity size={32} color="#2D5A27" />
        <h1>아프지마</h1>
      </motion.div>
      <p className={styles.subtitle}>
        어디가 아프신가요?
        <br />
        AI가 가야 할 병원을 알려드릴게요.
      </p>
    </div>
  );
}
