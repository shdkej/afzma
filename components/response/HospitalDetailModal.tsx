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

    return createPortal(
        <AnimatePresence>
            {hospital && (
                <div className="h-modal-root">
                    <motion.div
                        className="h-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <div className="h-modal-wrapper" onClick={onClose}>
                        <motion.div
                            layoutId={`hospital-${hospital.id}`}
                            className="h-modal-container"
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            transition={{
                                type: 'spring',
                                damping: 30,
                                stiffness: 300,
                                mass: 0.8
                            }}
                        >
                            <div className="h-modal-content">
                                <button
                                    className="h-modal-close"
                                    onClick={onClose}
                                >
                                    <X size={20} />
                                </button>
                                <div
                                    className="h-modal-hero"
                                    style={{ backgroundImage: `url(${hospital.image})` }}
                                />

                                <div className="h-modal-body">
                                    <span className="h-modal-tag">병원 상세 정보</span>
                                    <h2>{hospital.name}</h2>

                                    <div className="h-modal-info">
                                        <div className="h-info-row">
                                            <div className="h-icon-bg"><MapPin size={16} /></div>
                                            <div className="h-text">
                                                <label>주소</label>
                                                <p>{hospital.address}</p>
                                            </div>
                                        </div>
                                        <div className="h-info-row">
                                            <div className="h-icon-bg"><Phone size={16} /></div>
                                            <div className="h-text">
                                                <label>전화번호</label>
                                                <p>{hospital.phone}</p>
                                            </div>
                                        </div>
                                        <div className="h-info-row">
                                            <div className="h-icon-bg"><Info size={16} /></div>
                                            <div className="h-text">
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
                                <button className="h-call-btn">
                                    <Phone size={18} /> 전화 문의하기
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    <style jsx global>{`
                        .h-modal-root {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100vw;
                            height: 100vh;
                            z-index: 10000000;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            pointer-events: none;
                        }
                        .h-modal-overlay {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.4);
                            backdrop-filter: blur(12px);
                            -webkit-backdrop-filter: blur(12px);
                            pointer-events: auto;
                        }
                        .h-modal-wrapper {
                            position: relative;
                            width: 100%;
                            height: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 0 5px; /* 좌우 여백 */
                            pointer-events: auto;
                        }
                        .h-modal-container {
                            width: 100%;
                            max-width: 480px;
                            aspect-ratio: 1 / 1;
                            background: #FFFFFF;
                            border-radius: 32px;
                            overflow: hidden;
                            display: flex;
                            flex-direction: column;
                            box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.3);
                            pointer-events: auto;
                        }
                        .h-modal-content {
                            flex: 1;
                            overflow-y: auto;
                            scrollbar-width: none;
                            position: relative;
                        }
                        .h-modal-content::-webkit-scrollbar { display: none; }

                        .h-modal-close {
                            position: absolute;
                            top: 16px;
                            right: 16px;
                            width: 36px;
                            height: 36px;
                            background: rgba(255, 255, 255, 0.9);
                            border-radius: 50%;
                            z-index: 10;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border: none;
                            cursor: pointer;
                            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        }

                        .h-modal-hero {
                            width: 100%;
                            height: 42%;
                            background-size: cover;
                            background-position: center;
                        }

                        .h-modal-body {
                            padding: 24px;
                            display: flex;
                            flex-direction: column;
                            gap: 20px;
                        }

                        .h-modal-tag {
                            font-size: 11px;
                            font-weight: 800;
                            color: #2D5A27;
                            background: rgba(45, 90, 39, 0.1);
                            padding: 5px 12px;
                            border-radius: 10px;
                            width: fit-content;
                            text-transform: uppercase;
                        }

                        .h-modal-body h2 {
                            font-size: 24px;
                            font-weight: 800;
                            color: #111827;
                            margin: 0;
                            letter-spacing: -0.8px;
                        }

                        .h-modal-info {
                            display: flex;
                            flex-direction: column;
                            gap: 16px;
                        }

                        .h-info-row {
                            display: flex;
                            gap: 14px;
                            align-items: flex-start;
                        }

                        .h-icon-bg {
                            width: 36px;
                            height: 36px;
                            background: #F9FAFB;
                            color: #2D5A27;
                            border-radius: 12px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-shrink: 0;
                        }

                        .h-text label {
                            font-size: 12px;
                            font-weight: 700;
                            color: #9CA3AF;
                            display: block;
                            margin-bottom: 2px;
                        }

                        .h-text p {
                            font-size: 15px;
                            font-weight: 600;
                            color: #1F2937;
                            line-height: 1.4;
                            margin: 0;
                        }

                        .h-modal-desc {
                            background: #F9FAFB;
                            padding: 20px;
                            border-radius: 20px;
                        }

                        .h-modal-desc label {
                            font-size: 11px;
                            font-weight: 800;
                            color: #9CA3AF;
                            display: block;
                            margin-bottom: 8px;
                            text-transform: uppercase;
                        }

                        .h-modal-desc p {
                            font-size: 15px;
                            line-height: 1.6;
                            color: #4B5563;
                            margin: 0;
                        }
                        
                        .h-modal-footer {
                            padding: 20px 24px;
                            background: #FFFFFF;
                            border-top: 1px solid #F3F4F6;
                        }

                        .h-call-btn {
                            width: 100%;
                            background: #2D5A27;
                            color: white;
                            padding: 16px;
                            border-radius: 20px;
                            font-weight: 800;
                            font-size: 17px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                            border: none;
                            cursor: pointer;
                            transition: transform 0.2s;
                        }

                        .h-call-btn:active { transform: scale(0.97); }
                    `}</style>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
