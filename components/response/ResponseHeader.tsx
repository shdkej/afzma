import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ResponseHeaderProps {
    userSymptom: string;
}

export default function ResponseHeader({ userSymptom }: ResponseHeaderProps) {
    const router = useRouter();

    return (
        <header className="page-header">
            <button onClick={() => router.push('/')} className="back-button">
                <ChevronLeft size={24} />
            </button>
            <div className="header-info">
                <span className="label">입력한 증상</span>
                <h1 className="symptom-title">{userSymptom}</h1>
            </div>
            <div style={{ width: 44 }} />
            <style jsx>{`
        .page-header { 
          padding: 16px 20px; 
          display: flex; 
          align-items: center; 
          gap: 16px; 
          flex-shrink: 0;
          background: rgba(240, 239, 235, 0.9); 
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .header-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .header-info .label { font-size: 12px; color: var(--gray-500); font-weight: 500; }
        .symptom-title { font-size: 18px; font-weight: 700; color: var(--foreground); }
        .back-button { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 12px; background: var(--white); box-shadow: var(--shadow-sm); transition: transform 0.2s; }
        .back-button:active { transform: scale(0.95); }
      `}</style>
        </header>
    );
}
