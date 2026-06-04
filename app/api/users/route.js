import {
  createSessionId,
  errorResponse,
  getStore,
  jsonResponse,
  updateStore,
} from "@/lib/server-store";

export async function POST(request) {
  const { fullName, email, phone, password } = await request.json();

  if (!fullName?.trim() || !email?.trim() || !phone?.trim() || !password) {
    return errorResponse("Thiếu thông tin đăng ký");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const store = await getStore();

  if (store.users.some((u) => u.email === normalizedEmail)) {
    return errorResponse("Email đã được đăng ký");
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

  return jsonResponse({ success: true }, 201);
}
