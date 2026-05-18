"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { getBookings } from "@/lib/storage";
import { formatDate, formatPrice } from "@/data/tours";

function AccountContent() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const all = getBookings();
    setBookings(all.filter((b) => b.userId === user.id));
  }, [user.id]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Tài khoản của tôi</h1>

      <section className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">Thông tin cá nhân</h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-gray-500">Họ và tên</dt>
            <dd className="font-medium">{user.fullName}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Email</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Số điện thoại</dt>
            <dd className="font-medium">{user.phone}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Địa chỉ</dt>
            <dd className="font-medium">{user.address || "Chưa cập nhật"}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-bold">Lịch sử booking</h2>
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-700">
                    {booking.id}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(booking.departureDate)}
                  </span>
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">{booking.tourName}</h3>
                <p className="mt-1 text-lg font-bold text-teal-600">
                  {formatPrice(booking.totalPrice)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-gray-50 p-8 text-center text-gray-500">
            Bạn chưa có booking nào. Hãy khám phá các tour hấp dẫn!
          </div>
        )}
      </section>
    </div>
  );
}

export default function AccountPage() {
  return (
    <AuthGuard>
      <AccountContent />
    </AuthGuard>
  );
}
