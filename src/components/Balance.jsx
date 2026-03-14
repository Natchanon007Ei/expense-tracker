const fmt = (n) =>
  new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(n);

export default function Balance({ summary }) {
  const balance     = summary?.balance     ?? 0;
  const totalIncome  = summary?.totalIncome  ?? 0;
  const totalExpense = summary?.totalExpense ?? 0;
  const savingsRate  = totalIncome > 0
    ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  return (
    <div className="balance-grid">
      <div className="card balance-main animate-fade-up">
        <p className="balance-label">ยอดเงินคงเหลือ</p>
        <p className={`balance-amount ${balance >= 0 ? "positive" : "negative"}`}>
          {fmt(balance)}
        </p>
        <p className="balance-change">
          อัตราการออม: <span>{savingsRate}%</span>
        </p>
      </div>

      <div className="card stat-card income-card animate-fade-up" style={{ animationDelay: "0.08s" }}>
        <div className="stat-icon">📈</div>
        <p className="stat-amount">{fmt(totalIncome)}</p>
        <p className="stat-label">รายรับทั้งหมด</p>
      </div>

      <div className="card stat-card expense-card animate-fade-up" style={{ animationDelay: "0.16s" }}>
        <div className="stat-icon">📉</div>
        <p className="stat-amount">{fmt(totalExpense)}</p>
        <p className="stat-label">รายจ่ายทั้งหมด</p>
      </div>
    </div>
  );
}