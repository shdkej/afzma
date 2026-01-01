'use client';

import { Suspense } from 'react';
import { useMedicalResponse } from '@/hooks/useMedicalResponse';

// Sub-components
import ResponseHeader from '@/components/response/ResponseHeader';
import AnalysisSection from '@/components/response/AnalysisSection';
import ChatInput from '@/components/common/ChatInput';
import HospitalBottomSheet from '@/components/response/HospitalBottomSheet';
import HospitalDetailModal from '@/components/response/HospitalDetailModal';

function ResponseContent() {
  const {
    loading,
    data,
    selectedHospital,
    setSelectedHospital,
    snap,
    setSnap,
    followUpInput,
    setFollowUpInput,
    handleFollowUpSubmit,
    userSymptom,
    urgencyStyle,
  } = useMedicalResponse();

  return (
    <div className="response-container">
      <ResponseHeader userSymptom={userSymptom} />

      <main className="main-content">
        <AnalysisSection
          loading={loading}
          data={data}
          urgencyStyle={urgencyStyle}
        />

        {!loading && (
          <ChatInput
            value={followUpInput}
            onChange={setFollowUpInput}
            onSubmit={handleFollowUpSubmit}
            isLoading={loading}
            placeholder="추가로 궁금한 점이 있으신가요?"
            isFixed={true}
          />
        )}

        {snap === 0.12 && !loading && (
          <button
            className="show-hospitals-btn"
            onClick={() => setSnap(0.5)}
          >
            <span className="pulse-dot" />
            주변 병원 목록 보기
          </button>
        )}
      </main>

      <HospitalBottomSheet
        loading={loading}
        hospitals={data?.hospitals || null}
        onHospitalClick={setSelectedHospital}
        snap={snap}
        onSnapChange={setSnap}
      />

      <HospitalDetailModal
        hospital={selectedHospital}
        onClose={() => setSelectedHospital(null)}
      />

      <style jsx>{`
        .response-container { 
          height: 100%; 
          display: flex; 
          flex-direction: column; 
          background: var(--background); 
          position: relative; 
          overflow: hidden; 
        }
        .main-content { 
          flex: 1; 
          overflow-y: auto; 
          padding-bottom: 220px; 
          scrollbar-width: none;
          -ms-overflow-style: none;
          position: relative;
        }
        .main-content::-webkit-scrollbar {
          display: none;
        }
        .show-hospitals-btn {
          position: fixed;
          bottom: 110px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--gray-800);
          color: white;
          padding: 12px 20px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          z-index: 1001;
          border: 1px solid rgba(255,255,255,0.1);
          animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #4ADE80;
          border-radius: 50%;
          position: relative;
        }
        .pulse-dot::after {
          content: "";
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border-radius: 50%;
          border: 2px solid #4ADE80;
          animation: pulse-ring 1.5s infinite;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.7); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function ResponsePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResponseContent />
    </Suspense>
  );
}
