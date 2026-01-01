import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { MedicalAnalysis } from '@/backend/entity';

interface AnalysisSectionProps {
    loading: boolean;
    data: { analysis: MedicalAnalysis } | null;
    urgencyStyle: { bg: string; text: string };
    userSymptom: string;
}

const TIPS = [
    "심장이 두근거리는 건 사랑일까요? 아니면 카페인? 분석 중입니다...",
    "사과는 의사를 멀리하게 하지만, 지금은 AI가 가까이 있어요.",
    "물은 하루 8잔! 드셨나요? 잠시만 기다려주세요.",
    "스트레스는 만병의 근원, 잠시 심호흡 한번 하세요.",
    "AI가 의학 서적을 뒤적거리는 중입니다...",
    "건강한 신체에 건강한 정신이 깃듭니다. (분석이 거의 다 됐어요!)"
];

export default function AnalysisSection({ loading, data, urgencyStyle, userSymptom }: AnalysisSectionProps) {
    const [tipIndex, setTipIndex] = useState<number>(-1);

    useEffect(() => {
        if (!loading) return;
        setTipIndex(Math.floor(Math.random() * TIPS.length));

        const interval = setInterval(() => {
            setTipIndex((prev) => (prev + 1) % TIPS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [loading]);

    if (loading) {
        return (
            <div className="analysis-section">
                <div className="loading-container">
                    <div className="skeleton-container">
                        <div className="skeleton card pulse" style={{ height: 200, borderRadius: 30 }} />
                        <div className="skeleton card pulse" style={{ height: 50, borderRadius: 20, marginTop: 16 }} />
                        <div className="skeleton card pulse" style={{ height: 150, borderRadius: 24, marginTop: 16 }} />
                    </div>
                    <div className="loading-text">
                        <span className="pulse-dot"></span>
                        {tipIndex >= 0 && (
                            <p key={tipIndex} className="tip-message fade-in">{TIPS[tipIndex]}</p>
                        )}
                    </div>
                </div>
                <style jsx>{`
          .analysis-section { padding: 0 20px 20px; }
          .loading-container { 
              position: relative; 
              padding-top: 20px; 
              min-height: 500px;
              display: flex;
              flex-direction: column;
              background-image: url('/doctor-bg-2.png');
              background-size: auto 250px; /* 적절한 크기로 조정 */
              background-position: bottom center;
              background-repeat: no-repeat;
          }
          .skeleton-container {
              opacity: 0.25; /* 배경 이미지가 잘 보이도록 스켈레톤 투명도 조정 */
          }
          .loading-text { 
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 100%;
              padding: 0 20px;
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              justify-content: center; 
              text-align: center; 
              gap: 12px;
              z-index: 10;
          }
          .pulse-dot {
              width: 10px; 
              height: 10px; 
              background: var(--primary); 
              border-radius: 50%; 
              animation: pulse-scale 1s infinite;
              box-shadow: 0 0 10px rgba(45, 90, 39, 0.3);
          }
          .tip-message {
              font-size: 16px;
              color: var(--gray-900);
              font-weight: 600;
              margin: 0;
              line-height: 1.5;
              animation: fadeIn 0.5s ease;
              text-shadow: 0 2px 10px rgba(255,255,255,0.8);
              background: rgba(255,255,255,0.8);
              padding: 10px 16px;
              border-radius: 16px;
              backdrop-filter: blur(4px);
          }
          .skeleton.card { background: var(--gray-50); border-radius: 24px; width: 100%; }
          .pulse { animation: pulse 1.5s infinite; }
          
          @keyframes pulse { 0% { opacity: 1; } 50% { opacity: .5; } 100% { opacity: 1; } }
          @keyframes pulse-scale { 0% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(0.8); opacity: 0.5; } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
            </div>
        );
    }

    if (!data) return null;

    const getUrgencyMessage = (urgency: string) => {
        switch (urgency) {
            case '낮음': return '증상을 조금 더 지켜보셔도 괜찮아요';
            case '보통': return '가까운 시일 내에 병원 방문을 권장해요';
            case '높음': return '빠른 시일 내에 병원 진료가 필요해요';
            case '응급': return '지금 즉시 병원으로 가시는 것이 좋겠어요';
            default: return '전문의와 상담해보시는 게 좋아요';
        }
    };

    const getUrgencyBadgeStyle = (urgency: string) => {
        switch (urgency) {
            case '낮음': return { color: '#059669', bg: '#ecfdf5' };
            case '보통': return { color: '#0284c7', bg: '#f0f9ff' };
            case '높음': return { color: '#ea580c', bg: '#fff7ed' };
            case '응급': return { color: '#dc2626', bg: '#fef2f2' };
            default: return { color: '#6b7280', bg: '#f9fafb' };
        }
    };

    const badgeStyle = getUrgencyBadgeStyle(data.analysis.urgency);

    // Helper to process recommendations/coping methods into list
    const recommendations = data.analysis.copingMethods.split(/[\n,]/).filter(s => s.trim().length > 0);

    return (
        <div className="analysis-section">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="analysis-wrapper"
            >
                {/* 1. Input Symptom Section */}
                <section className="section-symptom">
                    <div className="symptom-box">
                        <span className="label">입력한 증상</span>
                        <p className="symptom-text">"{userSymptom}"</p>
                    </div>
                </section>

                <div className="divider" />

                {/* 2. Department & Urgency */}
                <section className="section-dept">
                    <span className="label">추천 진료과</span>
                    <div className="dept-row">
                        <h1 className="dept-name">{data.analysis.department}</h1>
                        <div className="urgency-badge">
                            <AlertTriangle size={14} className="urgency-icon" />
                            <span>{getUrgencyMessage(data.analysis.urgency)}</span>
                        </div>
                    </div>
                </section>

                {/* 3. Explanation */}
                <section className="section-explanation">
                    <p className="explanation-text">
                        {data.analysis.explanation}
                    </p>
                </section>

                {/* 4. Recommendations (List) */}
                <section className="section-recommendation">
                    <span className="label green-label">권장 사항</span>
                    <ul className="rec-list">
                        {recommendations.map((rec, idx) => (
                            <li key={idx} className="rec-item">
                                <div className="icon-wrapper">
                                    <CheckCircle2 size={18} className="rec-icon" />
                                </div>
                                <span>{rec.trim().replace(/^[-•]\s*/, '')}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </motion.div>
            <div style={{ height: 160 }} />
            <style jsx>{`
        .analysis-section { padding: 20px 24px 60px; }
        .analysis-wrapper { display: flex; flex-direction: column; gap: 40px; }
        
        .label { 
            font-size: 13px; 
            font-weight: 500; 
            color: var(--gray-500); 
            margin-bottom: 12px;
            display: block;
        }
        .green-label { color: #15803d; font-weight: 600; }
        
        /* Symptom */
        .section-symptom { display: flex; flex-direction: column; }
        .symptom-box {
            display: flex;
            flex-direction: column;
            gap: 10px;
            background: #EDEFE9;
            padding: 28px 24px;
            margin: 0 -24px;
            border-top: 1px solid rgba(0,0,0,0.05);
            border-bottom: 1px solid rgba(0,0,0,0.05);
            border-radius: 0;
        }
        .symptom-box .label { margin-bottom: 0; }
        .symptom-text {
            font-size: 18px;
            color: var(--gray-900);
            font-weight: 600;
            line-height: 1.4;
        }

        .divider { display: none; }

        /* Department */
        .section-dept { display: flex; flex-direction: column; margin-top: 10px }
        .dept-row { display: flex; align-items: center; gap: 20px;}
        .dept-name { 
            font-size: 38px; 
            font-weight: 900; 
            background: linear-gradient(135deg, #1a4731 0%, #34d399 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1.1;
            letter-spacing: -1px;
        }
        .urgency-badge {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            font-weight: 600;
            color: var(--gray-500);
        }
        .urgency-icon { color: var(--gray-400); }

        /* Explanation */
        .section-explanation { padding-top: 10px; }
        .explanation-text {
            font-size: 15px;
            line-height: 1.8;
            color: var(--gray-700);
            word-break: keep-all;
        }

        /* Recommendations */
        .section-recommendation { display: flex; flex-direction: column; gap: 8px; padding-top: 16px; }
        .rec-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
        .rec-item { 
            display: flex; 
            align-items: flex-start; 
            gap: 12px; 
            font-size: 15px; 
            color: var(--gray-800); 
            line-height: 1.6; 
        }
        .icon-wrapper {
            flex: 0 0 18px;
            width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 3px;
            flex-shrink: 0;
        }
        .rec-icon { 
            color: #1a4731; /* Dark Green */
            width: 18px;
            height: 18px;
        }
      `}</style>
        </div>
    );
}


