import {
  errorResponse,
  getCartKey,
  getSessionUser,
  getStore,
  jsonResponse,
  updateStore,
} from "@/lib/server-store";

function resolveCartKey(request, store) {
  const sessionId = request.headers.get("x-session-id");
  const clientId = request.headers.get("x-client-id");
  const user = getSessionUser(store, sessionId);
  return getCartKey(store, clientId, user?.id);
}

export async function GET(request) {
  const store = await getStore();
  const key = resolveCartKey(request, store);
  const items = key ? store.carts[key] || [] : [];
  return jsonResponse({ items });
}

export async function POST(request) {
  const { tour } = await request.json();
  if (!tour?.id) {
    return errorResponse("Thiếu thông tin tour");
  }

  const store = await getStore();
  const key = resolveCartKey(request, store);
  if (!key) {
    return errorResponse("Không xác định được giỏ hàng");
  }

  await updateStore((s) => {
    const current = s.carts[key] || [];
    if (!current.some((t) => t.id === tour.id)) {
      s.carts[key] = [...current, tour];
    }
    return s;
  });

  const updated = await getStore();
  return jsonResponse({ items: updated.carts[key] || [] }, 201);
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const tourId = searchParams.get("tourId");
  const store = await getStore();
  const key = resolveCartKey(request, store);

  if (!key) {
    return errorResponse("Không xác định được giỏ hàng");
  }

  await updateStore((s) => {
    if (tourId) {
      s.carts[key] = (s.carts[key] || []).filter((t) => t.id !== tourId);
    } else {
      s.carts[key] = [];
    }
    return s;
  });

  const updated = await getStore();
  return jsonResponse({ items: updated.carts[key] || [] });
}
