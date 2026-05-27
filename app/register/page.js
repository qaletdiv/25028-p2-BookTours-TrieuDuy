"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { validateRegister } from "@/lib/validation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateRegister(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setServerError("");
    const result = register(form);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        const next = redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login";
        router.push(next);
      }, 2000);
    } else {
      setServerError(result.error);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="rounded-2xl bg-green-50 p-8">
          <div className="text-4xl">✓</div>
          <h2 className="mt-4 text-xl font-bold text-green-800">Đăng ký thành công!</h2>
          <p className="mt-2 text-green-600">Đang chuyển đến trang đăng nhập...</p>
        {redirect && (
          <p className="mt-2 text-xs text-green-700">
            Sau khi đăng nhập, bạn sẽ được đưa về trang đang thao tác.
          </p>
        )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Đăng ký tài khoản</h1>
        <p className="mt-1 text-sm text-gray-500">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-semibold text-teal-600 hover:underline">
            Đăng nhập
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Họ và tên"
            name="fullName"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            error={errors.fullName}
            placeholder="Nguyễn Văn A"
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            placeholder="email@example.com"
          />
          <Input
            label="Số điện thoại"
            name="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            error={errors.phone}
            placeholder="0901234567"
          />
          <Input
            label="Mật khẩu"
            type="password"
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            placeholder="Tối thiểu 6 ký tự"
          />
          <Input
            label="Nhập lại mật khẩu"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            error={errors.confirmPassword}
            placeholder="••••••"
          />

          {serverError && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {serverError}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center">Đang tải...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
