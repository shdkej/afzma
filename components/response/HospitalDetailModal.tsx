import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, Info } from 'lucide-react';
import { Hospital } from '@/backend/entity';

interface HospitalDetailModalProps {
    hospital: Hospital | null;
    onClose: () => void;
}

export default function HospitalDetailModal({ hospital, onClose }: HospitalDetailModalProps) {
    return (
        <AnimatePresence>
            {hospital && (
                <motion.div
                    className="modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="modal-content"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button className="close-button" onClick={onClose}>
                            <X size={24} />
                        </button>
                        <div className="modal-img" style={{ backgroundImage: `url(${hospital.image})` }} />
                        <div className="modal-body">
                            <span className="modal-dept">병원 상세 정보</span>
                            <h2>{hospital.name}</h2>
                            <div className="modal-info-grid">
                                <div className="info-item">
                                    <MapPin size={18} color="#2D5A27" />
                                    <div><label>주소</label><p>{hospital.address}</p></div>
                                </div>
                                <div className="info-item">
                                    <Phone size={18} color="#2D5A27" />
                                    <div><label>전화번호</label><p>{hospital.phone}</p></div>
                                </div>
                                <div className="info-item">
                                    <Info size={18} color="#2D5A27" />
                                    <div><label>진료 과목</label><p>{hospital.department.join(', ')}</p></div>
                                </div>
                            </div>
                            <div className="modal-desc">
                                <label>소개</label>
                                <p>{hospital.description}</p>
                            </div>
                            <button className="call-button"><Phone size={18} /> 전화 문의하기</button>
                        </div>
                    </motion.div>
                    <style jsx>{`
            .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 10000; display: flex; align-items: flex-end; }
            .modal-content { width: 100%; height: 88vh; background: var(--white); border-radius: 32px 32px 0 0; position: relative; overflow-y: auto; box-shadow: 0 -20px 60px rgba(0,0,0,0.3); }
            .close-button { position: absolute; top: 20px; right: 20px; width: 44px; height: 44px; background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); border-radius: 50%; z-index: 10; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1); color: var(--gray-800); }
            .modal-img { width: 100%; height: 280px; background-size: cover; background-position: center; border-bottom: 1px solid rgba(0,0,0,0.05); }
            .modal-body { padding: 32px 24px 60px; display: flex; flex-direction: column; gap: 28px; }
            .modal-dept { font-size: 13px; font-weight: 800; color: var(--primary); background: var(--primary-soft); padding: 6px 14px; border-radius: 12px; width: fit-content; text-transform: uppercase; letter-spacing: 0.5px; }
            .modal-body h2 { font-size: 28px; font-weight: 800; color: var(--gray-800); letter-spacing: -0.5px; }
            .modal-info-grid { display: flex; flex-direction: column; gap: 24px; }
            .info-item { display: flex; gap: 16px; align-items: flex-start; }
            .info-item label { font-size: 13px; font-weight: 700; color: var(--gray-400); display: block; margin-bottom: 4px; }
            .info-item p { font-size: 16px; font-weight: 600; color: var(--gray-800); line-height: 1.5; }
            .modal-desc { background: var(--gray-50); padding: 20px; border-radius: 20px; }
            .modal-desc label { font-size: 13px; font-weight: 700; color: var(--gray-400); display: block; margin-bottom: 8px; }
            .modal-desc p { font-size: 16px; line-height: 1.7; color: var(--gray-600); }
            .call-button { background: var(--primary-gradient); color: white; padding: 18px; border-radius: 20px; font-weight: 800; font-size: 16px; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 20px; box-shadow: 0 12px 24px rgba(45,90,39,0.25), inset 0 2px 0 rgba(255,255,255,0.3); transition: all 0.3s ease; }
            .call-button:active { transform: scale(0.98); }
          `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
