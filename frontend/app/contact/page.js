"use client";

import { useState } from "react";
import { api } from "@/lib/api-client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await api.submitContact(form);
      setSuccess(true);
      setForm({ fullName: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Liên hệ</h1>
          <p className="mt-2 text-gray-500">
            Có câu hỏi về tour? Hãy liên hệ với chúng tôi, đội ngũ sẽ hỗ trợ bạn sớm nhất.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex gap-4 rounded-xl bg-teal-50 p-4">
              <span className="text-2xl">📍</span>
              <div>
                <p className="font-semibold">Địa chỉ</p>
                <p className="text-sm text-gray-600">116 Tân Chánh Hiệp 18, Q.12, TP.HCM</p>
              </div>
            </div>
            <div className="flex gap-4 rounded-xl bg-teal-50 p-4">
              <span className="text-2xl">📞</span>
              <div>
                <p className="font-semibold">Hotline</p>
                <p className="text-sm text-gray-600">1900 1234 (8:00 - 22:00)</p>
              </div>
            </div>
            <div className="flex gap-4 rounded-xl bg-teal-50 p-4">
              <span className="text-2xl">✉️</span>
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-sm text-gray-600">support@travelvn.demo</p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <h2 className="mb-4 text-lg font-bold">Gửi tin nhắn</h2>
          <div className="space-y-4">
            <Input
              label="Họ tên"
              placeholder="Nguyễn Văn A"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              label="Tiêu đề"
              placeholder="Hỏi về tour..."
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Nội dung</label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                placeholder="Nội dung tin nhắn..."
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
            )}
            {success && (
              <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi liên hệ"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
