const CATEGORIES = ["ทั้งหมด", "อาหาร", "เดินทาง", "ค่าบิล", "ช้อปปิ้ง", "สุขภาพ", "บันเทิง", "อื่นๆ"];

const CAT_MAP = {
  "ทั้งหมด": "All", "อาหาร": "Food", "เดินทาง": "Transport",
  "ค่าบิล": "Bills", "ช้อปปิ้ง": "Shopping", "สุขภาพ": "Health",
  "บันเทิง": "Entertainment", "อื่นๆ": "Other"
};
const CAT_MAP_REVERSE = Object.fromEntries(
  Object.entries(CAT_MAP).map(([k, v]) => [v, k])
);

export default function Filters({ activeFilter, onFilterChange }) {
  return (
    <div className="card animate-fade-up" style={{ padding: "14px 20px" }}>
      <div className="filters-row">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${activeFilter === CAT_MAP[cat] ? "active" : ""}`}
            onClick={() => onFilterChange(CAT_MAP[cat])}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}