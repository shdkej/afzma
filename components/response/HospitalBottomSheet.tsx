import { Drawer } from 'vaul';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Hospital } from '@/backend/entity';

interface HospitalBottomSheetProps {
  loading: boolean;
  hospitals: Hospital[] | null;
  onHospitalClick: (hospital: Hospital) => void;
  snap: string | number | null;
  onSnapChange: (snap: string | number | null) => void;
}

export default function HospitalBottomSheet({
  loading,
  hospitals,
  onHospitalClick,
  snap,
  onSnapChange
}: HospitalBottomSheetProps) {
  return (
    <Drawer.Root
      modal={false}
      open={true}
      dismissible={false}
      snapPoints={[0.12, 0.5, 0.9, 1]}
      activeSnapPoint={snap}
      setActiveSnapPoint={onSnapChange}
    >
      <Drawer.Portal>
        <Drawer.Content className="hospital-sheet">
          <div
            className="sheet-handle"
            onClick={() => {
              if (snap === 0.12) onSnapChange(0.5);
            }}
          >
            <div className="handle-bar" />
            <Drawer.Title asChild>
              <h3>추천 병원 목록</h3>
            </Drawer.Title>
            <Drawer.Description className="sr-only">
              사용자의 증상과 위치를 기반으로 추천된 주변 병원 목록입니다.
            </Drawer.Description>
          </div>

          <div className="hospital-list" data-vaul-no-drag>
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="skeleton-hospital pulse" />)
            ) : hospitals && hospitals.length > 0 ? (
              hospitals.map((h) => (
                <motion.div
                  key={h.id}
                  layoutId={`hospital-${h.id}`}
                  className="hospital-item"
                  onClick={() => onHospitalClick(h)}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    layoutId={`hospital-img-${h.id}`}
                    className="hospital-img"
                    style={{ backgroundImage: `url(${h.image})` }}
                  />
                  <div className="hospital-info">
                    <h4>{h.name}</h4>
                    <p className="hospital-addr"><MapPin size={12} /> {h.address}</p>
                    <div className="hospital-depts">
                      {h.department.slice(0, 2).map(d => <span key={d}>{d}</span>)}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="empty-hospitals">
                <p>주변에 해당 진료과 병원을 찾을 수 없습니다.</p>
                <small>잠시 후 다시 시도해 주세요.</small>
              </div>
            )}
            <div style={{ height: 160 }} />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
      <style jsx global>{`
        /* Crucial Fix: Prevent the portal container from blocking background interactions */
        [vaul-portal] {
          pointer-events: none;
        }
        .hospital-sheet { 
          pointer-events: auto !important;
          background: #FFFFFF;
          border-radius: 32px 32px 0 0; 
          box-shadow: 0 -10px 40px rgba(0,0,0,0.15); 
          z-index: 9999; 
          display: flex; 
          flex-direction: column; 
          outline: none;
          max-height: 85vh;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: auto;
          transform: translate3d(0, 0, 0); /* Force GPU acceleration */
        }
        .sheet-handle { 
          padding: 16px 20px 20px; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          gap: 16px; 
          cursor: grab;
          border-bottom: 1px solid var(--gray-100);
          flex-shrink: 0;
        }
        .sheet-handle:active { cursor: grabbing; }
        .handle-bar { 
          width: 48px; 
          height: 5px; 
          background: var(--gray-200); 
          border-radius: 3px; 
        }
        .sheet-handle h3 { 
          font-size: 18px; 
          font-weight: 700; 
          color: var(--gray-800);
          width: 100%;
          text-align: left;
        }
        .hospital-list { 
          flex: 1; 
          padding: 20px; 
          overflow-y: auto !important; 
          -webkit-overflow-scrolling: touch;
          display: flex; 
          flex-direction: column; 
          gap: 16px; 
          background: var(--gray-50);
          min-height: 0;
        }
        /* Custom styled scrollbar for visibility */
        .hospital-list::-webkit-scrollbar { width: 4px; display: block; }
        .hospital-list::-webkit-scrollbar-thumb { background: var(--gray-200); border-radius: 10px; }
        
        .hospital-item { 
          display: flex; 
          gap: 16px; 
          padding: 16px; 
          background: var(--white); 
          border-radius: 20px; 
          cursor: pointer; 
          box-shadow: var(--shadow-sm);
          border: 1px solid rgba(0,0,0,0.03);
          transition: all 0.2s ease;
          flex-shrink: 0;
        }
        .hospital-item:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .hospital-img { 
          width: 88px; 
          height: 88px; 
          border-radius: 16px; 
          background-size: cover; 
          background-position: center; 
          flex-shrink: 0;
          box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
        }
        .hospital-info { 
          display: flex; 
          flex-direction: column; 
          justify-content: center; 
          gap: 6px; 
          flex: 1; 
        }
        .hospital-info h4 { 
          font-size: 16px; 
          font-weight: 700; 
          color: var(--gray-800);
        }
        .hospital-addr { 
          font-size: 13px; 
          color: var(--gray-500); 
          display: flex; 
          align-items: center; 
          gap: 4px; 
        }
        .hospital-depts { 
          display: flex; 
          gap: 6px; 
          margin-top: 6px; 
        }
        .hospital-depts span { 
          font-size: 11px; 
          font-weight: 500;
          background: var(--gray-100); 
          padding: 4px 8px; 
          border-radius: 6px; 
          color: var(--gray-600); 
        }
        .skeleton-hospital { 
          height: 120px; 
          background: var(--white); 
          border-radius: 20px; 
          box-shadow: var(--shadow-sm);
        }
        .empty-hospitals { 
          padding: 60px 20px; 
          text-align: center; 
          color: var(--gray-500); 
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .empty-hospitals p { font-weight: 600; margin-bottom: 4px; color: var(--gray-800); }
        .pulse { animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: .5; } 100% { opacity: 1; } }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
      `}</style>
    </Drawer.Root>
  );
}
