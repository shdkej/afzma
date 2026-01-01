import { ArrowRight } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  placeholder?: string;
  isFixed?: boolean;
}

import styles from './ChatInput.module.css';

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = "증상을 자세히 설명해주세요...",
  isFixed = false
}: ChatInputProps) {
  return (
    <div className={isFixed ? styles.inputContainerFixed : styles.inputContainerSticky}>
      <form onSubmit={onSubmit} className={styles.inputBox}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
        />
        <button type="submit" className={styles.sendButton} disabled={isLoading}>
          {isLoading ? (
            <div className={styles.loader} />
          ) : (
            <ArrowRight size={20} color="white" />
          )}
        </button>
      </form>
    </div>
  );
}
