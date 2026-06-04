import { promises as fs } from "fs";
import path from "path";

const STORE_PATH = path.join(process.cwd(), "data", "app-store.json");

const DEFAULT_STORE = {
  users: [],
  bookings: [],
  contacts: [],
  sessions: {},
  carts: {},
};

async function readStore() {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    return { ...DEFAULT_STORE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STORE };
  }
}

async function writeStore(store) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

export async function getStore() {
  return readStore();
}

export async function updateStore(mutator) {
  const store = await readStore();
  const next = mutator(store) ?? store;
  await writeStore(next);
  return next;
}

export function jsonResponse(data, status = 200) {
  return Response.json(data, { status });
}

export function errorResponse(message, status = 400) {
  return jsonResponse({ success: false, error: message }, status);
}

export function getSessionUser(store, sessionId) {
  if (!sessionId) return null;
  const session = store.sessions[sessionId];
  if (!session) return null;
  const user = store.users.find((u) => u.id === session.userId);
  if (!user) return null;
  const { password: _, ...safeUser } = user;
  return safeUser;
}

export function createSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getCartKey(store, sessionId, userId) {
  return userId || sessionId || null;
}
