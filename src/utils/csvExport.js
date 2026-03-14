/**
 * Export transactions array to a CSV file download.
 * Columns: Date, Description, Category, Amount, Type
 */
export function exportToCSV(transactions) {
  if (!transactions.length) {
    alert("No transactions to export.");
    return;
  }

  const headers = ["Date", "Description", "Category", "Amount", "Type"];

  const rows = transactions.map((tx) => {
    const date = new Date(tx.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    // Escape any commas or quotes in description
    const desc = `"${tx.description.replace(/"/g, '""')}"`;
    return [date, desc, tx.category, tx.amount.toFixed(2), tx.type].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
