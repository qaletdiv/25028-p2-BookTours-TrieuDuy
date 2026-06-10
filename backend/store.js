const { promises: fs } = require("fs");
const path = require("path");

const STORE_PATH = path.join(__dirname, "data", "app-store.json");
const SEED = require("./data/app-store.json");

const DEFAULT_STORE = {
  users: [],
  bookings: [],
  contacts: [],
  sessions: {},
  carts: {},
};

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB || "travelvn";
const DOC_ID = "main";

// --- MongoDB backend (used when MONGODB_URI is set) ---
let collectionPromise;

function getCollection() {
  if (!collectionPromise) {
    const { MongoClient } = require("mongodb");
    const client = new MongoClient(MONGODB_URI);
    collectionPromise = client
      .connect()
      .then((c) => c.db(DB_NAME).collection("appstore"));
  }
  return collectionPromise;
}

async function getStoreMongo() {
  const col = await getCollection();
  let doc = await col.findOne({ _id: DOC_ID });
  if (!doc) {
    doc = { _id: DOC_ID, ...DEFAULT_STORE, ...SEED };
    await col.insertOne(doc);
  }
  const { _id, ...store } = doc;
  return { ...DEFAULT_STORE, ...store };
}

async function updateStoreMongo(mutator) {
  const store = await getStoreMongo();
  const next = mutator(store) ?? store;
  const col = await getCollection();
  await col.replaceOne({ _id: DOC_ID }, { _id: DOC_ID, ...next }, { upsert: true });
  return next;
}

// --- File backend (local dev fallback when no MONGODB_URI) ---
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

async function getStoreFile() {
  return readStore();
}

async function updateStoreFile(mutator) {
  const store = await readStore();
  const next = mutator(store) ?? store;
  await writeStore(next);
  return next;
}

// --- Public API (auto-selects backend) ---
async function getStore() {
  return MONGODB_URI ? getStoreMongo() : getStoreFile();
}

async function updateStore(mutator) {
  return MONGODB_URI ? updateStoreMongo(mutator) : updateStoreFile(mutator);
}

function getSessionUser(store, sessionId) {
  if (!sessionId) return null;
  const session = store.sessions[sessionId];
  if (!session) return null;
  const user = store.users.find((u) => u.id === session.userId);
  if (!user) return null;
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

function createSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function getCartKey(store, sessionId, userId) {
  return userId || sessionId || null;
}

module.exports = {
  getStore,
  updateStore,
  getSessionUser,
  createSessionId,
  getCartKey,
};
