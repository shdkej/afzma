export default function GuideSection() {
  return (
    <section className="guide-section">
      <div className="guide-card">
        <h3>궁금한 증상을 자유롭게 입력하세요</h3>
        <ul>
          <li>"갑자기 머리가 어지럽고 구토 증상이 있어요"</li>
          <li>"아이 열이 39도까지 올라갔어요"</li>
          <li>"무릎이 쑤시고 계단 오르기 힘들어요"</li>
        </ul>
      </div>
      <style jsx>{`
        .guide-card {
          background: linear-gradient(135deg, #FFFFFF 0%, #F0EFEB 100%);
          padding: 24px;
          border-radius: var(--radius);
          color: var(--gray-600);
          box-shadow: var(--shadow-card);
          border: var(--glass-border);
          position: relative;
          overflow: hidden;
        }
        .guide-card::after {
          content: "";
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, var(--primary-soft) 0%, transparent 70%);
          opacity: 0.6;
          border-radius: 50%;
          pointer-events: none;
        }
        .guide-card h3 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--primary);
          position: relative;
          z-index: 1;
        }
        .guide-card ul {
          list-style: none;
          font-size: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          z-index: 1;
        }
        .guide-card li {
          background: rgba(255, 255, 255, 0.6);
          padding: 8px 12px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.8);
        }
      `}</style>
    </section>
  );
}
