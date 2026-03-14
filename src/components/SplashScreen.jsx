import { useEffect, useState } from "react";

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState("enter"); 

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"),  600);
    const t2 = setTimeout(() => setPhase("exit"),  1800);
    const t3 = setTimeout(() => onDone(),          2500);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  return (
    <div className={`splash ${phase}`}>
      <div className="splash-content">
        <div className="splash-icon">💰</div>
        <div className="splash-title">
          <span className="splash-main">ระบบบันทึก</span>
          <span className="splash-accent">รายรับ-รายจ่าย</span>
        </div>
        <div className="splash-bar">
          <div className="splash-bar-fill" />
        </div>
      </div>
    </div>
  );
}