const SESSION_ID_KEY = "travel_api_session";
const CLIENT_ID_KEY = "travel_client_id";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

export function getApiSessionId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_ID_KEY);
}

export function setApiSessionId(sessionId) {
  if (typeof window === "undefined") return;
  if (sessionId) {
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  } else {
    localStorage.removeItem(SESSION_ID_KEY);
  }
}

export function getClientId() {
  if (typeof window === "undefined") return null;
  let id = sessionStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id = `client_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}

async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const sessionId = getApiSessionId();
  if (sessionId) headers["X-Session-Id"] = sessionId;

  const clientId = getClientId();
  if (clientId) headers["X-Client-Id"] = clientId;

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Yêu cầu thất bại");
  }

  return data;
}

export const api = {
  register: (body) =>
    apiFetch("/api/users", { method: "POST", body: JSON.stringify(body) }),

  login: (body) =>
    apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),

  logout: () => apiFetch("/api/auth/session", { method: "DELETE" }),

  updateUser: (id, body) =>
    apiFetch(`/api/users/${id}`, { method: "PUT", body: JSON.stringify(body) }),

  getBookings: (userId) =>
    apiFetch(`/api/bookings?userId=${encodeURIComponent(userId)}`),

  createBookings: (body) =>
    apiFetch("/api/bookings", { method: "POST", body: JSON.stringify(body) }),

  getCart: () => apiFetch("/api/cart"),

  addToCart: (tour) =>
    apiFetch("/api/cart", { method: "POST", body: JSON.stringify({ tour }) }),

  removeFromCart: (tourId) =>
    apiFetch(`/api/cart?tourId=${encodeURIComponent(tourId)}`, { method: "DELETE" }),

  clearCart: () => apiFetch("/api/cart", { method: "DELETE" }),

  submitContact: (body) =>
    apiFetch("/api/contacts", { method: "POST", body: JSON.stringify(body) }),
};
