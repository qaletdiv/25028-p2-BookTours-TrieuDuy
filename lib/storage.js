const USERS_KEY = "travel_users";
const SESSION_KEY = "travel_session";
const BOOKINGS_KEY = "travel_bookings";
const LAST_BOOKING_KEY = "travel_last_booking";
const CART_KEY = "travel_cart";

export function getUsers() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveSession(user) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function getBookings() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveBookings(bookings) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

export function getLastBooking() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(LAST_BOOKING_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveLastBooking(booking) {
  localStorage.setItem(LAST_BOOKING_KEY, JSON.stringify(booking));
}

export function generateBookingCode() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `BK${num}`;
}

export function getCartItem() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(sessionStorage.getItem(CART_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveCartItem(tour) {
  if (tour) {
    sessionStorage.setItem(CART_KEY, JSON.stringify(tour));
  } else {
    sessionStorage.removeItem(CART_KEY);
  }
}
