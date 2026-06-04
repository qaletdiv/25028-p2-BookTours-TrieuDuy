import {
  errorResponse,
  getSessionUser,
  getStore,
  jsonResponse,
  updateStore,
} from "@/lib/server-store";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const sessionId = request.headers.get("x-session-id");
  const store = await getStore();
  const sessionUser = getSessionUser(store, sessionId);

  if (!userId || !sessionUser || sessionUser.id !== userId) {
    return errorResponse("Không có quyền", 401);
  }

  const bookings = store.bookings.filter((b) => b.userId === userId);
  return jsonResponse({ bookings });
}

export async function POST(request) {
  const sessionId = request.headers.get("x-session-id");
  const store = await getStore();
  const sessionUser = getSessionUser(store, sessionId);

  if (!sessionUser) {
    return errorResponse("Chưa đăng nhập", 401);
  }

  const { bookings, lastBooking } = await request.json();

  if (!Array.isArray(bookings) || bookings.length === 0) {
    return errorResponse("Thiếu dữ liệu booking");
  }

  await updateStore((s) => {
    s.bookings.unshift(...bookings);
    return s;
  });

  return jsonResponse({ success: true, lastBooking }, 201);
}
