import {
  createSessionId,
  errorResponse,
  getStore,
  jsonResponse,
  updateStore,
} from "@/lib/server-store";

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email?.trim() || !password) {
    return errorResponse("Email và mật khẩu là bắt buộc");
  }

  const store = await getStore();
  const found = store.users.find(
    (u) => u.email === email.toLowerCase().trim() && u.password === password
  );

  if (!found) {
    return errorResponse("Email hoặc mật khẩu không đúng", 401);
  }

  const sessionId = createSessionId();
  const clientId = request.headers.get("x-client-id");

  await updateStore((s) => {
    s.sessions[sessionId] = { userId: found.id, createdAt: new Date().toISOString() };

    if (clientId && s.carts[clientId]?.length) {
      const existing = s.carts[found.id] || [];
      const merged = [...existing];
      for (const tour of s.carts[clientId]) {
        if (!merged.some((t) => t.id === tour.id)) merged.push(tour);
      }
      s.carts[found.id] = merged;
      delete s.carts[clientId];
    }

    return s;
  });

  const { password: _, ...safeUser } = found;
  return jsonResponse({ success: true, user: safeUser, sessionId });
}
