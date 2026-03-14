const CATEGORY_ICONS = {
  Food:          "",
  Transport:     "",
  Bills:         "",
  Shopping:      "",
  Health:        "",
  Entertainment: "",
  Other:         "",
};

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function TransactionList({ transactions, onDelete }) {
  return (
    <div className="card" style={{ flex: 1 }}>
      <p className="section-title">
        ประวัติการทำรายการ
        <span className="tx-count">{transactions.length} records</span>
      </p>

      {transactions.length === 0 ? (
        <div className="tx-empty">
          <p>ยังไม่มีรายการธุรกรรม</p>
          <p style={{ marginTop: 4, fontSize: 11 }}>เพิ่มรายการเพื่อเริ่มต้นใช้งาน</p>
        </div>
      ) : (
        <ul className="tx-list" style={{ listStyle: "none" }}>
          {[...transactions].reverse().map((tx) => (
            <li key={tx.id} className="tx-item">
              <div className="tx-cat-icon">
                {CATEGORY_ICONS[tx.category] || "📦"}
              </div>

              <div className="tx-info">
                <p className="tx-desc">{tx.description}</p>
                <p className="tx-meta">
                  <span className={`tx-badge ${tx.type}`}>{tx.type}</span>
                  {tx.category} · {fmtDate(tx.date)}
                </p>
              </div>

              <span className={`tx-amount ${tx.type}`}>
                {tx.type === "expense" ? "−" : "+"}
                {fmt(tx.amount)}
              </span>

              <button
                className="tx-delete"
                onClick={() => onDelete(tx.id)}
                title="Delete transaction"
                aria-label={`Delete ${tx.description}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
