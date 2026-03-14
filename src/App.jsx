import { useState, useEffect, useCallback } from "react";
import SplashScreen from "./components/SplashScreen";
import "./style.css";

import Balance         from "./components/Balance";
import AddTransaction  from "./components/AddTransaction";
import TransactionList from "./components/TransactionList";
import Filters         from "./components/Filters";
import ExpenseChart    from "./components/ExpenseChart";
import DarkModeToggle  from "./components/DarkModeToggle";

import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from "./utils/api";

const LS_DARK_MODE = "expense_tracker_dark";
const fmt = (n) =>
  new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(n);

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [summary,      setSummary]      = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showSplash,   setShowSplash]   = useState(true);

  const [isDark, setIsDark] = useState(() => {
    try {
      const s = localStorage.getItem(LS_DARK_MODE);
      return s !== null ? JSON.parse(s) : false;
    } catch { return false; }
  });

  useEffect(() => {
    localStorage.setItem(LS_DARK_MODE, JSON.stringify(isDark));
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getTransactions(activeFilter);
      setTransactions(res.data);
      setSummary(res.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleAdd = async (payload) => {
    try {
      await createTransaction(payload);
      await fetchTransactions();
    } catch (err) {
      alert("ไม่สามารถเพิ่มรายการได้: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      await fetchTransactions();
    } catch (err) {
      alert("ไม่สามารถลบรายการได้: " + err.message);
    }
  };

  return (
    <>
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}

      <div className={`app-container app-enter ${showSplash ? "app-hidden" : ""}`}>

        {/* ── Header ── */}
        <header className="app-header">
          <div className="header-brand">
            <div className="brand-name">
              <span className="brand-name-main">ระบบบันทึกรายรับ — รายจ่าย</span>
            </div>
          </div>
          <div className="header-actions">
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              fontFamily: "var(--font-mono)", fontSize: 11,
              color: error ? "var(--expense)" : "var(--income)",
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: error ? "var(--expense)" : "var(--income)",
                boxShadow: error
                  ? "0 0 6px var(--expense)"
                  : "0 0 6px var(--income)",
                display: "inline-block",
              }} />
              {error ? "ออฟไลน์" : "เชื่อมต่อแล้ว"}
            </div>
            <DarkModeToggle isDark={isDark} onToggle={() => setIsDark((d) => !d)} />
          </div>
        </header>

        {/* ── Error Banner ── */}
        {error && (
          <div style={{
            background: "var(--expense-dim)",
            border: "1px solid var(--expense-border)",
            borderRadius: "var(--radius-sm)",
            padding: "12px 16px", marginBottom: 16,
            fontFamily: "var(--font-body)", fontSize: 13,
            color: "var(--expense)",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            ⚠️ ไม่สามารถเชื่อมต่อ Backend ได้ กรุณาตรวจสอบว่า Server รันอยู่ที่ port 5000
            <button
              onClick={fetchTransactions}
              style={{
                marginLeft: "auto", padding: "4px 14px",
                background: "transparent",
                border: "1px solid var(--expense)",
                borderRadius: 6, color: "var(--expense)",
                fontFamily: "var(--font-body)", fontSize: 12,
                cursor: "pointer",
              }}
            >
              ลองใหม่
            </button>
          </div>
        )}

        {/* ── Balance ── */}
        <div className="balance-grid">
          <div className="card balance-main animate-fade-up">
            <p className="balance-label">ยอดเงินคงเหลือ</p>
            <p className={`balance-amount ${summary.balance >= 0 ? "positive" : "negative"}`}>
              {fmt(summary.balance)}
            </p>
            <p className="balance-change">
              อัตราการออม:{" "}
              <span>
                {summary.totalIncome > 0
                  ? ((summary.balance / summary.totalIncome) * 100).toFixed(1)
                  : 0}%
              </span>
            </p>
          </div>

          <div className="card stat-card income-card animate-fade-up"
            style={{ animationDelay: "0.08s" }}>
            <div className="stat-icon">📈</div>
            <p className="stat-amount">{fmt(summary.totalIncome)}</p>
            <p className="stat-label">รายรับทั้งหมด</p>
          </div>

          <div className="card stat-card expense-card animate-fade-up"
            style={{ animationDelay: "0.16s" }}>
            <div className="stat-icon">📉</div>
            <p className="stat-amount">{fmt(summary.totalExpense)}</p>
            <p className="stat-label">รายจ่ายทั้งหมด</p>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="main-grid">
          <div className="sidebar">
            <AddTransaction onAdd={handleAdd} />
          </div>
          <div className="content-area">
            <Filters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

            {loading ? (
              <div className="card" style={{
                display: "flex", alignItems: "center",
                justifyContent: "center", padding: 40,
                fontFamily: "var(--font-body)", fontSize: 14,
                color: "var(--text-muted)", gap: 10,
              }}>
                <span style={{
                  animation: "spin 1s linear infinite",
                  display: "inline-block", fontSize: 18,
                }}>
                  ⟳
                </span>
                กำลังโหลดรายการ...
              </div>
            ) : (
              <TransactionList transactions={transactions} onDelete={handleDelete} />
            )}
          </div>
        </div>

        {/* ── Charts ── */}
        <ExpenseChart transactions={transactions} isDark={isDark} />

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>

      </div>
    </>
  );
}