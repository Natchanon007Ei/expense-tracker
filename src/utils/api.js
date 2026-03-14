// ── API base URL ───────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Generic fetch helper ───────────────────────────────────────────
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API Error");
  return data;
}

// ── Transaction API ────────────────────────────────────────────────

/** Fetch all transactions (optional category filter) */
export async function getTransactions(category = "All") {
  const query = category !== "All" ? `?category=${category}` : "";
  return request(`/transactions${query}`);
}

/** Add a new transaction */
export async function createTransaction(payload) {
  return request("/transactions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Update an existing transaction */
export async function updateTransaction(id, payload) {
  return request(`/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/** Delete a transaction by id */
export async function deleteTransaction(id) {
  return request(`/transactions/${id}`, { method: "DELETE" });
}

/** Health check */
export async function healthCheck() {
  return request("/health");
}
