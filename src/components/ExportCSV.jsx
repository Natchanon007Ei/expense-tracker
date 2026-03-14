import { exportToCSV } from "../utils/csvExport";

export default function ExportCSV({ transactions }) {
  return (
    <button
      className="export-btn"
      onClick={() => exportToCSV(transactions)}
      title="Export transactions to CSV"
    >
      <span>⬇</span>
      <span>Export CSV</span>
    </button>
  );
}
