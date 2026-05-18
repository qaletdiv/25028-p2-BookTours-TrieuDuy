"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { validateLogin } from "@/lib/validation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLogin(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setServerError("");
    const result = login(form);
    setLoading(false);

    if (result.success) {
      router.push(redirect);
    } else {
      setServerError(result.error);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Đăng nhập</h1>
        <p className="mt-1 text-sm text-gray-500">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="font-semibold text-teal-600 hover:underline">
            Đăng ký ngay
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            label="Mật khẩu"
            type="password"
            name="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            placeholder="••••••"
          />

          {serverError && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {serverError}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center">Đang tải...</div>}>
      <LoginForm />
    </Suspense>
  );
}
