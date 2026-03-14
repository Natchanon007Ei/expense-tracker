import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Title
);

const CATEGORY_COLORS = {
  Food:          "#4f46e5",
  Transport:     "#7c3aed",
  Bills:         "#db2777",
  Shopping:      "#0891b2",
  Health:        "#16a34a",
  Entertainment: "#d97706",
  Other:         "#6b7280",
};

const CATEGORY_TH = {
  Food: "อาหาร", Transport: "เดินทาง", Bills: "ค่าบิล",
  Shopping: "ช้อปปิ้ง", Health: "สุขภาพ",
  Entertainment: "บันเทิง", Other: "อื่นๆ",
};

const MONTHS_TH = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
                   "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

function buildMonthlyData(transactions) {
  const now    = new Date();
  const months = [];
  const income  = [];
  const expense = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(MONTHS_TH[d.getMonth()]);

    const monthTxns = transactions.filter((t) => {
      const td = new Date(t.date || t.createdAt);
      return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth();
    });

    income.push(monthTxns.filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0));
    expense.push(monthTxns.filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0));
  }

  return { months, income, expense };
}

export default function ExpenseChart({ transactions, isDark }) {
  const textColor  = isDark ? "#8b95a8" : "#6b7280";
  const gridColor  = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
  const tooltipBg  = isDark ? "#1c2333" : "#ffffff";
  const tooltipTxt = isDark ? "#f1f3f9" : "#111318";
  const tooltipBdr = isDark ? "#252d3d" : "#e8eaef";

  // ── Doughnut: รายจ่ายตามหมวด ──────────────────────────────
  const expByCat = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + t.amount; return acc; }, {});

  const pieLabels = Object.keys(expByCat).map((k) => CATEGORY_TH[k] || k);
  const pieData   = Object.values(expByCat);
  const pieColors = Object.keys(expByCat).map((k) => CATEGORY_COLORS[k] || "#6b7280");

  const doughnutData = {
    labels: pieLabels,
    datasets: [{
      data: pieData,
      backgroundColor: pieColors.map((c) => c + "cc"),
      borderColor: tooltipBg,
      borderWidth: 3,
      hoverOffset: 8,
    }],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: textColor,
          font: { family: "'Inter', sans-serif", size: 11 },
          padding: 12,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipTxt,
        bodyColor: textColor,
        borderColor: tooltipBdr,
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (ctx) =>
            `  ฿${ctx.parsed.toLocaleString("th-TH", { minimumFractionDigits: 2 })}`,
        },
      },
    },
  };

  // ── Line: แนวโน้มรายรับ-รายจ่าย ───────────────────────────
  const { months, income, expense } = buildMonthlyData(transactions);

  const lineData = {
    labels: months,
    datasets: [
      {
        label: "รายรับ",
        data: income,
        borderColor: "#16a34a",
        backgroundColor: "rgba(22,163,74,0.08)",
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: "#16a34a",
        pointBorderColor: tooltipBg,
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
      {
        label: "รายจ่าย",
        data: expense,
        borderColor: "#dc2626",
        backgroundColor: "rgba(220,38,38,0.06)",
        borderWidth: 2.5,
        pointRadius: 4,
        pointBackgroundColor: "#dc2626",
        pointBorderColor: tooltipBg,
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: textColor,
          font: { family: "'Inter', sans-serif", size: 11 },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipTxt,
        bodyColor: textColor,
        borderColor: tooltipBdr,
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (ctx) =>
            `  ${ctx.dataset.label}: ฿${ctx.parsed.y.toLocaleString("th-TH", {
              minimumFractionDigits: 2,
            })}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor, drawBorder: false },
        border: { display: false },
        ticks: {
          color: textColor,
          font: { family: "'Inter', sans-serif", size: 11 },
          maxRotation: 0,
        },
      },
      y: {
        grid: { color: gridColor, drawBorder: false },
        border: { display: false, dash: [4, 4] },
        ticks: {
          color: textColor,
          font: { family: "'Inter', sans-serif", size: 11 },
          callback: (v) =>
            v >= 1000 ? `฿${(v / 1000).toFixed(0)}k` : `฿${v}`,
          maxTicksLimit: 5,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="charts-grid">
      {/* Doughnut */}
      <div className="card chart-card animate-fade-up">
        <p className="section-title">รายจ่ายตามหมวดหมู่</p>
        <div className="chart-wrapper">
          {pieData.length > 0 ? (
            <Doughnut data={doughnutData} options={doughnutOptions} />
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
              ยังไม่มีข้อมูลรายจ่าย
            </p>
          )}
        </div>
      </div>

      {/* Line */}
      <div className="card chart-card animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <p className="section-title">แนวโน้ม 6 เดือนล่าสุด</p>
        <div className="chart-wrapper">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
}