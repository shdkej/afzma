import { motion } from 'framer-motion';
import { Stethoscope, AlertTriangle } from 'lucide-react';
import { MedicalAnalysis } from '@/backend/entity';

interface AnalysisSectionProps {
    loading: boolean;
    data: { analysis: MedicalAnalysis } | null;
    urgencyStyle: { bg: string; text: string };
}

export default function AnalysisSection({ loading, data, urgencyStyle }: AnalysisSectionProps) {
    if (loading) {
        return (
            <div className="analysis-section">
                <div className="skeleton-container">
                    <div className="skeleton card pulse" style={{ height: 200, borderRadius: 30 }} />
                    <div className="skeleton card pulse" style={{ height: 50, borderRadius: 20, marginTop: 16 }} />
                    <div className="skeleton card pulse" style={{ height: 150, borderRadius: 24, marginTop: 16 }} />
                </div>
                <style jsx>{`
          .analysis-section { padding: 20px; }
          .skeleton.card { background: var(--white); border-radius: 24px; width: 100%; box-shadow: var(--shadow-sm); }
          .pulse { animation: pulse 1.5s infinite; }
          @keyframes pulse { 0% { opacity: 1; } 50% { opacity: .5; } 100% { opacity: 1; } }
        `}</style>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="analysis-section">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="analysis-wrapper"
            >
                <section className="highlight-card">
                    <div className="dept-header">
                        <div className="icon-circle">
                            <Stethoscope size={32} color="white" />
                        </div>
                        <div className="dept-info">
                            <span className="dept-label">추천 진료과</span>
                            <h2 className="dept-name">{data.analysis.department}</h2>
                        </div>
                    </div>
                    <p className="dept-reason">{data.analysis.departmentReason}</p>
                </section>

                <section className="urgency-card" style={{ backgroundColor: urgencyStyle.bg, color: urgencyStyle.text }}>
                    <AlertTriangle size={20} />
                    <span>긴급도: {data.analysis.urgency || '보통'}</span>
                </section>

                <section className="detail-card">
                    <p className="detail-text">{data.analysis.explanation}</p>
                    <div className="detail-footer">
                        <div className="caution-box">
                            <label>⚠️ 주의사항</label>
                            <p>{data.analysis.cautions}</p>
                        </div>
                    </div>
                </section>
            </motion.div>
            <div style={{ height: 160 }} />
            <style jsx>{`
        .analysis-section { padding: 20px; }
        .analysis-wrapper { display: flex; flex-direction: column; gap: 20px; }
        .highlight-card { 
          background: linear-gradient(135deg, #FFFFFF 0%, #FAFBFC 100%); 
          padding: 28px; 
          border-radius: 32px; 
          border: var(--glass-border);
          box-shadow: var(--shadow-card);
          position: relative;
          overflow: hidden;
        }
        .highlight-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: var(--primary-gradient);
          opacity: 0.8;
        }
        .dept-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .icon-circle { 
          width: 72px; 
          height: 72px; 
          background: var(--primary-gradient); 
          border-radius: 20px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          box-shadow: 0 12px 24px rgba(45, 90, 39, 0.15);
        }
        .dept-info { display: flex; flex-direction: column; gap: 4px; }
        .dept-label { font-size: 14px; font-weight: 700; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.5px; }
        .dept-name { font-size: 30px; font-weight: 800; color: var(--gray-800); }
        .dept-reason { font-size: 16px; line-height: 1.6; color: var(--gray-600); }
        .urgency-card { 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          padding: 16px 24px; 
          border-radius: 20px; 
          font-weight: 700;
          font-size: 15px;
          box-shadow: var(--shadow-sm);
        }
        .detail-card { 
          background: var(--white); 
          padding: 28px; 
          border-radius: 28px; 
          box-shadow: var(--shadow-card);
          border: 1px solid rgba(0,0,0,0.02);
        }
        .detail-text { font-size: 16px; line-height: 1.7; color: var(--gray-800); margin-bottom: 24px; }
        .caution-box { 
          padding: 20px; 
          background: rgba(234, 88, 12, 0.05);
          border-radius: 20px;
          border: 1px solid rgba(234, 88, 12, 0.1);
        }
        .caution-box label { font-size: 14px; font-weight: 800; color: #EA580C; display: flex; align-items: center; gap: 4px; margin-bottom: 8px; }
        .caution-box p { font-size: 15px; color: #854D0E; line-height: 1.6; }
      `}</style>
        </div>
    );
}
