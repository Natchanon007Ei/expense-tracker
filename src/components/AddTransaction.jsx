import { useState } from "react";

const CATEGORIES = ["อาหาร", "เดินทาง", "ค่าบิล", "ช้อปปิ้ง", "สุขภาพ", "บันเทิง", "อื่นๆ"];

const CAT_MAP = {
  "อาหาร": "Food", "เดินทาง": "Transport", "ค่าบิล": "Bills",
  "ช้อปปิ้ง": "Shopping", "สุขภาพ": "Health", "บันเทิง": "Entertainment", "อื่นๆ": "Other"
};

export default function AddTransaction({ onAdd }) {
  const [type, setType]               = useState("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount]           = useState("");
  const [category, setCategory]       = useState("อาหาร");

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!description.trim() || isNaN(num) || num <= 0) return;
    onAdd({
      id: crypto.randomUUID(),
      type,
      description: description.trim(),
      amount: num,
      category: CAT_MAP[category] || "Other",
      date: new Date().toISOString(),
    });
    setDescription("");
    setAmount("");
    setCategory("อาหาร");
  };

  return (
    <div className="card animate-fade-up">
      <p className="section-title">รายการใหม่</p>
      <div className="type-toggle">
        <button
          type="button"
          className={`type-btn ${type === "income" ? "active-income" : ""}`}
          onClick={() => setType("income")}
        >
          ↑ รายรับ
        </button>
        <button
          type="button"
          className={`type-btn ${type === "expense" ? "active-expense" : ""}`}
          onClick={() => setType("expense")}
        >
          ↓ รายจ่าย
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">รายละเอียด</label>
          <input
            className="form-input"
            type="text"
            placeholder="เช่น ข้าวกลางวัน"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={60}
          />
        </div>
        <div className="form-group">
          <label className="form-label">จำนวนเงิน (บาท)</label>
          <input
            className="form-input"
            type="number"
            placeholder="0.00"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">หมวดหมู่</label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-btn">
          + เพิ่มรายการ
        </button>
      </form>
    </div>
  );
}