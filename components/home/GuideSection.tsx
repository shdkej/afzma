import styles from './GuideSection.module.css';

export default function GuideSection() {
  return (
    <section className={styles.guideSection}>
      <div className={styles.guideCard}>
        <h3>궁금한 증상을 자유롭게 입력하세요</h3>
        <ul>
          <li>"갑자기 머리가 어지럽고 구토 증상이 있어요"</li>
          <li>"아이 열이 39도까지 올라갔어요"</li>
          <li>"무릎이 쑤시고 계단 오르기 힘들어요"</li>
        </ul>
      </div>
    </section>
  );
}
