import { errorResponse, jsonResponse, updateStore } from "@/lib/server-store";

export async function POST(request) {
  const { fullName, email, subject, message } = await request.json();

  if (!fullName?.trim() || !email?.trim() || !message?.trim()) {
    return errorResponse("Vui lòng điền đầy đủ thông tin");
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

  return jsonResponse({ success: true }, 201);
}
