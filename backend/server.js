const express = require("express");
const cors = require("cors");

const {
  getStore,
  updateStore,
  getSessionUser,
  createSessionId,
  getCartKey,
} = require("./store");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    allowedHeaders: ["Content-Type", "X-Session-Id", "X-Client-Id"],
  })
);
app.use(express.json());

function error(res, message, status = 400) {
  return res.status(status).json({ success: false, error: message });
}

function resolveCartKey(req, store) {
  const sessionId = req.header("x-session-id");
  const clientId = req.header("x-client-id");
  const user = getSessionUser(store, sessionId);
  return getCartKey(store, clientId, user?.id);
}

app.get("/", (_req, res) => {
  res.json({ name: "TravelVN API", status: "ok" });
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// --- Users ---
app.post("/api/users", async (req, res) => {
  const { fullName, email, phone, password } = req.body || {};

  if (!fullName?.trim() || !email?.trim() || !phone?.trim() || !password) {
    return error(res, "Thiếu thông tin đăng ký");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const store = await getStore();

  if (store.users.some((u) => u.email === normalizedEmail)) {
    return error(res, "Email đã được đăng ký");
  }

  const newUser = {
    id: Date.now().toString(),
    fullName: fullName.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    password,
    address: "",
  };

  await updateStore((s) => {
    s.users.push(newUser);
    return s;
  });

  res.status(201).json({ success: true });
});

app.put("/api/users/:id", async (req, res) => {
  const sessionId = req.header("x-session-id");
  const store = await getStore();
  const sessionUser = getSessionUser(store, sessionId);

  if (!sessionUser) return error(res, "Chưa đăng nhập", 401);

  const { id } = req.params;
  if (sessionUser.id !== id) return error(res, "Không có quyền", 403);

  const updates = req.body || {};
  const allowed = ["fullName", "phone", "address"];
  const filtered = Object.fromEntries(
    Object.entries(updates).filter(([k]) => allowed.includes(k))
  );

  await updateStore((s) => {
    const idx = s.users.findIndex((u) => u.id === id);
    if (idx !== -1) s.users[idx] = { ...s.users[idx], ...filtered };
    return s;
  });

  const updated = await getStore();
  const user = updated.users.find((u) => u.id === id);
  const { password: _password, ...safeUser } = user;

  res.json({ success: true, user: safeUser });
});

// --- Auth ---
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email?.trim() || !password) {
    return error(res, "Email và mật khẩu là bắt buộc");
  }

  const store = await getStore();
  const found = store.users.find(
    (u) => u.email === email.toLowerCase().trim() && u.password === password
  );

  if (!found) return error(res, "Email hoặc mật khẩu không đúng", 401);

  const sessionId = createSessionId();
  const clientId = req.header("x-client-id");

  await updateStore((s) => {
    s.sessions[sessionId] = {
      userId: found.id,
      createdAt: new Date().toISOString(),
    };

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

  const { password: _password, ...safeUser } = found;
  res.json({ success: true, user: safeUser, sessionId });
});

app.get("/api/auth/session", async (req, res) => {
  const sessionId = req.header("x-session-id");
  const store = await getStore();
  const user = getSessionUser(store, sessionId);
  res.json({ user: user || null });
});

app.delete("/api/auth/session", async (req, res) => {
  const sessionId = req.header("x-session-id");

  if (sessionId) {
    await updateStore((s) => {
      delete s.sessions[sessionId];
      return s;
    });
  }

  res.json({ success: true });
});

// --- Bookings ---
app.get("/api/bookings", async (req, res) => {
  const userId = req.query.userId;
  const sessionId = req.header("x-session-id");
  const store = await getStore();
  const sessionUser = getSessionUser(store, sessionId);

  if (!userId || !sessionUser || sessionUser.id !== userId) {
    return error(res, "Không có quyền", 401);
  }

  const bookings = store.bookings.filter((b) => b.userId === userId);
  res.json({ bookings });
});

app.post("/api/bookings", async (req, res) => {
  const sessionId = req.header("x-session-id");
  const store = await getStore();
  const sessionUser = getSessionUser(store, sessionId);

  if (!sessionUser) return error(res, "Chưa đăng nhập", 401);

  const { bookings, lastBooking } = req.body || {};

  if (!Array.isArray(bookings) || bookings.length === 0) {
    return error(res, "Thiếu dữ liệu booking");
  }

  await updateStore((s) => {
    s.bookings.unshift(...bookings);
    return s;
  });

  res.status(201).json({ success: true, lastBooking });
});

// --- Cart ---
app.get("/api/cart", async (req, res) => {
  const store = await getStore();
  const key = resolveCartKey(req, store);
  const items = key ? store.carts[key] || [] : [];
  res.json({ items });
});

app.post("/api/cart", async (req, res) => {
  const { tour } = req.body || {};
  if (!tour?.id) return error(res, "Thiếu thông tin tour");

  const store = await getStore();
  const key = resolveCartKey(req, store);
  if (!key) return error(res, "Không xác định được giỏ hàng");

  await updateStore((s) => {
    const current = s.carts[key] || [];
    if (!current.some((t) => t.id === tour.id)) {
      s.carts[key] = [...current, tour];
    }
    return s;
  });

  const updated = await getStore();
  res.status(201).json({ items: updated.carts[key] || [] });
});

app.delete("/api/cart", async (req, res) => {
  const tourId = req.query.tourId;
  const store = await getStore();
  const key = resolveCartKey(req, store);

  if (!key) return error(res, "Không xác định được giỏ hàng");

  await updateStore((s) => {
    if (tourId) {
      s.carts[key] = (s.carts[key] || []).filter((t) => t.id !== tourId);
    } else {
      s.carts[key] = [];
    }
    return s;
  });

  const updated = await getStore();
  res.json({ items: updated.carts[key] || [] });
});

// --- Contacts ---
app.post("/api/contacts", async (req, res) => {
  const { fullName, email, subject, message } = req.body || {};

  if (!fullName?.trim() || !email?.trim() || !message?.trim()) {
    return error(res, "Vui lòng điền đầy đủ thông tin");
  }

  const contact = {
    id: Date.now().toString(),
    fullName: fullName.trim(),
    email: email.trim(),
    subject: subject?.trim() || "",
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  await updateStore((s) => {
    s.contacts.push(contact);
    return s;
  });

  res.status(201).json({ success: true });
});

app.listen(PORT, () => {
  const storage = process.env.MONGODB_URI ? "MongoDB" : "file (app-store.json)";
  console.log(`TravelVN API running on port ${PORT} | storage: ${storage}`);
});
