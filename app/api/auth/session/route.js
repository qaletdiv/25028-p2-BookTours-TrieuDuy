import {
  getSessionUser,
  getStore,
  jsonResponse,
  updateStore,
} from "@/lib/server-store";

export async function GET(request) {
  const sessionId = request.headers.get("x-session-id");
  const store = await getStore();
  const user = getSessionUser(store, sessionId);

  if (!user) {
    return jsonResponse({ user: null });
  }

  return jsonResponse({ user });
}

export async function DELETE(request) {
  const sessionId = request.headers.get("x-session-id");

  if (sessionId) {
    await updateStore((s) => {
      delete s.sessions[sessionId];
      return s;
    });
  }

  return jsonResponse({ success: true });
}
