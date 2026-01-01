'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Phone, Info } from 'lucide-react';
import { Hospital } from '@/backend/entity';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface HospitalDetailModalProps {
    hospital: Hospital | null;
    onClose: () => void;
}

export default function HospitalDetailModal({ hospital, onClose }: HospitalDetailModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const modalContent = (
        <AnimatePresence>
            {hospital && (
                <motion.div
                    className="hospital-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="hospital-modal-container"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={e => e.stopPropagation()}
                        transition={{
                            type: 'spring',
                            damping: 25,
                            stiffness: 300
                        }}
                    >
                        <button
                            className="h-modal-close-btn"
                            onClick={onClose}
                        >
                            <X size={20} />
                        </button>

                        <div className="h-modal-scroll-node">
                            <div
                                className="h-modal-image"
                                style={{ backgroundImage: `url(${hospital.image})` }}
                            />
                            <div className="h-modal-body">
                                <span className="h-modal-label">병원 상세 정보</span>
                                <h2>{hospital.name}</h2>

                                <div className="h-modal-info-section">
                                    <div className="h-modal-info-row">
                                        <div className="h-modal-icon-box"><MapPin size={16} /></div>
                                        <div className="h-modal-text">
                                            <label>주소</label>
                                            <p>{hospital.address}</p>
                                        </div>
                                    </div>
                                    <div className="h-modal-info-row">
                                        <div className="h-modal-icon-box"><Phone size={16} /></div>
                                        <div className="h-modal-text">
                                            <label>전화번호</label>
                                            <p>{hospital.phone}</p>
                                        </div>
                                    </div>
                                    <div className="h-modal-info-row">
                                        <div className="h-modal-icon-box"><Info size={16} /></div>
                                        <div className="h-modal-text">
                                            <label>진료 과목</label>
                                            <p>{hospital.department.join(', ')}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-modal-desc">
                                    <label>병원 소개</label>
                                    <p>{hospital.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="h-modal-footer">
                            <button className="h-modal-call-btn">
                                <Phone size={18} /> 전화 문의하기
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            <style jsx global>{`
                .hospital-modal-overlay { 
                    position: fixed !important; 
                    top: 0 !important; 
                    left: 0 !important; 
                    width: 100vw !important;
                    height: 100vh !important;
                    background: rgba(0, 0, 0, 0.45) !important; 
                    backdrop-filter: blur(8px) !important;
                    -webkit-backdrop-filter: blur(8px) !important;
                    z-index: 9999999 !important;
                    display: flex !important; 
                    align-items: center !important; 
                    justify-content: center !important;
                    padding: 0 5px !important;
                    pointer-events: auto !important;
                }
                
                .hospital-modal-container { 
                    width: 100%; 
                    max-width: 480px;
                    aspect-ratio: 1 / 1; 
                    background: #FFFFFF; 
                    border-radius: 24px;
                    position: relative; 
                    overflow: hidden; 
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }

                .h-modal-scroll-node {
                    flex: 1;
                    overflow-y: auto;
                    scrollbar-width: none;
                }
                .h-modal-scroll-node::-webkit-scrollbar { display: none; }

                .h-modal-close-btn { 
                    position: absolute; 
                    top: 12px; 
                    right: 12px; 
                    width: 36px; 
                    height: 36px; 
                    background: rgba(255, 255, 255, 0.9); 
                    border-radius: 50%; 
                    z-index: 100; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    color: #111827; 
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .h-modal-image { 
                    width: 100%; 
                    height: 38%; 
                    background-size: cover; 
                    background-position: center; 
                }

                .h-modal-body { 
                    padding: 20px; 
                    display: flex; 
                    flex-direction: column; 
                    gap: 16px; 
                }

                .h-modal-label { 
                    font-size: 10px; 
                    font-weight: 700; 
                    color: #2D5A27; 
                    background: rgba(45, 90, 39, 0.08); 
                    padding: 4px 10px; 
                    border-radius: 8px; 
                    width: fit-content;
                }

                .h-modal-body h2 { 
                    font-size: 22px; 
                    font-weight: 800; 
                    color: #111827; 
                    margin: 0;
                    letter-spacing: -0.5px;
                }

                .h-modal-info-section { 
                    display: flex; 
                    flex-direction: column; 
                    gap: 14px; 
                }

                .h-modal-info-row { 
                    display: flex; 
                    gap: 12px; 
                    align-items: flex-start; 
                }

                .h-modal-icon-box { 
                    width: 32px; 
                    height: 32px; 
                    background: #F9FAFB; 
                    color: #2D5A27; 
                    border-radius: 10px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    flex-shrink: 0; 
                }

                .h-modal-text label { 
                    font-size: 12px; 
                    font-weight: 600; 
                    color: #9CA3AF; 
                    display: block; 
                    margin-bottom: 2px; 
                }

                .h-modal-text p { 
                    font-size: 14px; 
                    font-weight: 500; 
                    color: #1F2937; 
                    line-height: 1.4; 
                    margin: 0; 
                }

                .h-modal-desc { 
                    background: #F9FAFB; 
                    padding: 16px; 
                    border-radius: 16px; 
                }

                .h-modal-desc label { 
                    font-size: 11px; 
                    font-weight: 700; 
                    color: #9CA3AF; 
                    display: block; 
                    margin-bottom: 6px; 
                }

                .h-modal-desc p { 
                    font-size: 14px; 
                    line-height: 1.5; 
                    color: #4B5563; 
                    margin: 0; 
                }
                
                .h-modal-footer {
                    padding: 16px 20px;
                    background: #FFFFFF;
                    border-top: 1px solid #F3F4F6;
                }

                .h-modal-call-btn { 
                    width: 100%; 
                    background: #2D5A27; 
                    color: #FFFFFF; 
                    padding: 14px; 
                    border-radius: 16px; 
                    font-weight: 700; 
                    font-size: 16px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 8px; 
                    border: none;
                    cursor: pointer;
                }

                .h-modal-call-btn:active { transform: scale(0.98); }
            `}</style>
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}
