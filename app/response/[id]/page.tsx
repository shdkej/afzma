'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, MapPin, Phone, Info, X, Activity } from 'lucide-react';
import { MedicalAnalysis, Hospital } from '@/backend/entity';

export default function ResponsePage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{ analysis: MedicalAnalysis; hospitals: Hospital[] | null } | null>(null);
    const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
    const [isListExpanded, setIsListExpanded] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/history/${id}`);
            const json = await res.json();
            if (json.history) {
                // Parse the last assistant message
                const messages = json.history.messages;
                const lastAssistant = [...messages].reverse().find((m: any) => m.role === 'assistant');
                const analysis = lastAssistant ? JSON.parse(lastAssistant.content) : null;

                // Mock hospitals for now as they are not stored in entity
                const hospitals = [
                    {
                        id: '1',
                        name: '서울아산병원',
                        address: '서울특별시 송파구 올림픽로43길 88',
                        phone: '1688-7575',
                        department: ['내과', '외과', '소아과'],
                        description: '국내 최대 규모의 종합병원으로 최첨단 의료 시설을 갖추고 있습니다.',
                        image: 'https://images.unsplash.com/photo-1587350859743-b15272ce100a?q=80&w=1000&auto=format&fit=crop'
                    },
                    {
                        id: '2',
                        name: '삼성서울병원',
                        address: '서울특별시 강남구 일원로 81',
                        phone: '1599-3114',
                        department: ['내과', '정형외과', '이비인후과'],
                        description: '환자 중심의 의료 서비스를 제공하며 암 치료에 특화되어 있습니다.',
                        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop'
                    },
                    {
                        id: '3',
                        name: '강남세브란스병원',
                        address: '서울특별시 강남구 언주로 211',
                        phone: '1599-6114',
                        department: ['내과', '안과', '피부과'],
                        description: '강남 지역의 대표적인 대학병원으로 전문적인 진료를 제공합니다.',
                        image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1000&auto=format&fit=crop'
                    }
                ];

                setData({ analysis, hospitals });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setTimeout(() => setLoading(false), 1500); // Artificial delay to show skeleton
        }
    };

    return (
        <div className="response-container">
            <header className="page-header">
                <button onClick={() => router.push('/')} className="back-button">
                    <ChevronLeft size={24} />
                </button>
                <Activity size={24} color="#2D5A27" />
                <div style={{ width: 24 }} />
            </header>

            <main className="main-content">
                <div className="analysis-section">
                    {loading ? (
                        <div className="skeleton-container">
                            <div className="skeleton title pulse" />
                            <div className="skeleton text pulse" />
                            <div className="skeleton text pulse" style={{ width: '80%' }} />
                            <div className="skeleton text pulse" style={{ width: '60%' }} />
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="analysis-card"
                        >
                            <span className="dept-tag">{data?.analysis.department}</span>
                            <h2>권장 진료과목</h2>

                            <div className="analysis-details">
                                <section>
                                    <h3>📋 증상 요약</h3>
                                    <p>{data?.analysis.summary}</p>
                                </section>
                                <section>
                                    <h3>💡 상세 설명</h3>
                                    <p>{data?.analysis.explanation}</p>
                                </section>
                                <section>
                                    <h3>⚠️ 주의사항</h3>
                                    <p>{data?.analysis.cautions}</p>
                                </section>
                                <section>
                                    <h3>✅ 대처방법</h3>
                                    <p>{data?.analysis.copingMethods}</p>
                                </section>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Bottom Sheet - Hospital List */}
                <motion.div
                    className="hospital-sheet"
                    initial={{ y: '50vh' }}
                    animate={{ y: isListExpanded ? '10vh' : '50vh' }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                >
                    <div
                        className="sheet-handle"
                        onClick={() => setIsListExpanded(!isListExpanded)}
                    >
                        <div className="handle-bar" />
                        <h3>추천 병원 목록</h3>
                    </div>

                    <div className="hospital-list">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="skeleton-hospital pulse" />
                            ))
                        ) : (
                            data?.hospitals?.map((h) => (
                                <div
                                    key={h.id}
                                    className="hospital-item"
                                    onClick={() => setSelectedHospital(h)}
                                >
                                    <div className="hospital-img" style={{ backgroundImage: `url(${h.image})` }} />
                                    <div className="hospital-info">
                                        <h4>{h.name}</h4>
                                        <p className="hospital-addr"><MapPin size={12} /> {h.address}</p>
                                        <div className="hospital-depts">
                                            {h.department.slice(0, 2).map(d => <span key={d}>{d}</span>)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </main>

            {/* Hospital Detail Modal */}
            <AnimatePresence>
                {selectedHospital && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedHospital(null)}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className="close-button" onClick={() => setSelectedHospital(null)}>
                                <X size={24} />
                            </button>

                            <div className="modal-img" style={{ backgroundImage: `url(${selectedHospital.image})` }} />

                            <div className="modal-body">
                                <span className="modal-dept">병원 상세 정보</span>
                                <h2>{selectedHospital.name}</h2>

                                <div className="modal-info-grid">
                                    <div className="info-item">
                                        <MapPin size={18} color="#2D5A27" />
                                        <div>
                                            <label>주소</label>
                                            <p>{selectedHospital.address}</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <Phone size={18} color="#2D5A27" />
                                        <div>
                                            <label>전화번호</label>
                                            <p>{selectedHospital.phone}</p>
                                        </div>
                                    </div>
                                    <div className="info-item">
                                        <Info size={18} color="#2D5A27" />
                                        <div>
                                            <label>진료 과목</label>
                                            <p>{selectedHospital.department.join(', ')}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-desc">
                                    <label>소개</label>
                                    <p>{selectedHospital.description}</p>
                                </div>

                                <button className="call-button">
                                    <Phone size={18} /> 전화 문의하기
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
        .response-container {
          min-height: 100vh;
          background: var(--background);
          position: relative;
          overflow: hidden;
        }
        .page-header {
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(240, 239, 235, 0.8);
          backdrop-filter: blur(10px);
        }
        .back-button {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: var(--white);
          box-shadow: var(--shadow-sm);
        }
        .main-content {
          height: calc(100vh - 64px);
          position: relative;
        }
        .analysis-section {
          padding: 20px;
          height: 45vh;
          overflow-y: auto;
        }
        .analysis-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .dept-tag {
          font-size: 24px;
          font-weight: 800;
          color: var(--primary);
          display: block;
        }
        .analysis-card h2 {
          font-size: 16px;
          color: var(--gray-500);
          font-weight: 500;
        }
        .analysis-details {
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: var(--white);
          padding: 24px;
          border-radius: var(--radius);
          box-shadow: var(--shadow-md);
        }
        .analysis-details h3 {
          font-size: 14px;
          color: var(--primary);
          margin-bottom: 6px;
        }
        .analysis-details p {
          font-size: 15px;
          line-height: 1.6;
          color: var(--foreground);
        }
        
        /* Skeleton */
        .skeleton-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .skeleton {
          background: #E5E7EB;
          border-radius: 8px;
        }
        .skeleton.title { height: 32px; width: 40%; }
        .skeleton.text { height: 16px; width: 100%; }
        .pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }

        /* Hospital Sheet */
        .hospital-sheet {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          height: 90vh;
          background: var(--white);
          border-radius: 30px 30px 0 0;
          box-shadow: 0 -10px 25px rgba(0,0,0,0.1);
          z-index: 200;
          display: flex;
          flex-direction: column;
        }
        .sheet-handle {
          padding: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .handle-bar {
          width: 40px;
          height: 4px;
          background: #E5E7EB;
          border-radius: 2px;
        }
        .sheet-handle h3 {
          font-size: 16px;
          font-weight: 700;
        }
        .hospital-list {
          flex: 1;
          padding: 0 20px 100px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .hospital-item {
          display: flex;
          gap: 16px;
          padding: 12px;
          background: var(--background);
          border-radius: 16px;
          cursor: pointer;
        }
        .hospital-img {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          background-size: cover;
          background-position: center;
          flex-shrink: 0;
        }
        .hospital-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
          flex: 1;
        }
        .hospital-info h4 {
          font-size: 15px;
          font-weight: 700;
        }
        .hospital-addr {
          font-size: 12px;
          color: var(--gray-500);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .hospital-depts {
          display: flex;
          gap: 4px;
          margin-top: 4px;
        }
        .hospital-depts span {
          font-size: 10px;
          background: var(--white);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--primary);
        }
        .skeleton-hospital {
          height: 104px;
          background: #E5E7EB;
          border-radius: 16px;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          z-index: 2000;
          display: flex;
          align-items: flex-end;
        }
        .modal-content {
          width: 100%;
          height: 85vh;
          background: var(--white);
          border-radius: 30px 30px 0 0;
          position: relative;
          overflow-y: auto;
        }
        .close-button {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.8);
          border-radius: 50%;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-img {
          width: 100%;
          height: 250px;
          background-size: cover;
          background-position: center;
        }
        .modal-body {
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .modal-dept {
          font-size: 12px;
          font-weight: 700;
          color: var(--primary);
          background: var(--primary-extra-light);
          padding: 4px 12px;
          border-radius: 20px;
          width: fit-content;
        }
        .modal-body h2 {
          font-size: 24px;
          font-weight: 800;
        }
        .modal-info-grid {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .info-item {
          display: flex;
          gap: 16px;
        }
        .info-item label {
          font-size: 12px;
          color: var(--gray-500);
          display: block;
          margin-bottom: 2px;
        }
        .info-item p {
          font-size: 15px;
          font-weight: 500;
        }
        .modal-desc label {
          font-size: 12px;
          color: var(--gray-500);
          display: block;
          margin-bottom: 8px;
        }
        .modal-desc p {
          font-size: 15px;
          line-height: 1.6;
        }
        .call-button {
          background: var(--primary);
          color: white;
          padding: 16px;
          border-radius: 16px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 10px;
        }
      `}</style>
        </div>
    );
}
