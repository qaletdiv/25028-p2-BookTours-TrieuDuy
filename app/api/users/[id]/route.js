import {
  errorResponse,
  getSessionUser,
  getStore,
  jsonResponse,
  updateStore,
} from "@/lib/server-store";

export async function PUT(request, { params }) {
  const sessionId = request.headers.get("x-session-id");
  const store = await getStore();
  const sessionUser = getSessionUser(store, sessionId);

  if (!sessionUser) {
    return errorResponse("Chưa đăng nhập", 401);
  }

  const { id } = await params;
  if (sessionUser.id !== id) {
    return errorResponse("Không có quyền", 403);
  }

  const updates = await request.json();
  const allowed = ["fullName", "phone", "address"];
  const filtered = Object.fromEntries(
    Object.entries(updates).filter(([k]) => allowed.includes(k))
  );

  await updateStore((s) => {
    const idx = s.users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      s.users[idx] = { ...s.users[idx], ...filtered };
    }
    return s;
  });

  const updated = await getStore();
  const user = updated.users.find((u) => u.id === id);
  const { password: _, ...safeUser } = user;

  return jsonResponse({ success: true, user: safeUser });
}
