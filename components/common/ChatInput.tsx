import { ArrowRight } from 'lucide-react';
import styles from './ChatInput.module.css';

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  placeholder?: string;
  isFixed?: boolean;
  isStatic?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = "증상을 자세히 설명해주세요...",
  isFixed = false,
  isStatic = false,
  autoFocus = false,
  className
}: ChatInputProps) {
  const containerClass = isFixed
    ? styles.inputContainerFixed
    : (isStatic ? styles.inputContainerStatic : styles.inputContainerSticky);

  return (
    <div className={containerClass}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
        }}
        className={`${styles.inputBox} ${className || ''}`.trim()}
      >
        <textarea
          id="symptom-input"
          name="symptom"
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ width: '100%' }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e as any);
            }
          }}
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={isLoading}
          onClick={(e) => e.stopPropagation()}
        >
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
