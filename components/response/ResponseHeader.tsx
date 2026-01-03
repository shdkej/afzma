import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ResponseHeaderProps { }

export default function ResponseHeader({ }: ResponseHeaderProps) {
  const router = useRouter();

  return (
    <header className="page-header">
      <button onClick={() => router.push('/')} className="back-button">
        <ChevronLeft size={24} />
      </button>
      <div style={{ flex: 1 }} />
      <style jsx>{`
        .page-header { 
          padding: 12px 20px; 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          flex-shrink: 0;
          background: transparent;
          border-bottom: none;
          position: relative;
          z-index: 10001; /* 최상단 레벨 유지 */
        }
        .back-button { 
          width: 40px; 
          height: 40px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          border-radius: 50%; 
          background: transparent; 
          transition: background-color 0.2s; 
          margin-left: -8px; 
          color: var(--gray-800);
        }
        .back-button:active { background: var(--gray-100); }
      `}</style>
    </header>
  );
}
