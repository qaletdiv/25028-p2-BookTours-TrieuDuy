"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLastBooking } from "@/lib/storage";
import { formatDate, formatPrice } from "@/data/tours";
import Button from "@/components/ui/Button";

export default function ConfirmationPage() {
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    setBooking(getLastBooking());
  }, []);

  if (!booking) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-gray-500">Không tìm thấy thông tin booking.</p>
        <Button href="/tours" className="mt-4">Xem tour</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-2xl border border-green-200 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
          ✓
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Đặt tour thành công!
        </h1>
        <p className="mt-2 text-gray-500">
          Cảm ơn bạn đã đặt tour. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
        </p>

        <div className="mt-8 rounded-xl bg-gray-50 p-6 text-left">
          <h2 className="mb-4 font-bold text-gray-900">Chi tiết booking</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Mã booking</dt>
              <dd className="font-semibold text-teal-600">{booking.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Tour</dt>
              <dd className="font-medium">{booking.tourName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Ngày khởi hành</dt>
              <dd>{formatDate(booking.departureDate)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Số khách</dt>
              <dd>{booking.adults} người lớn, {booking.children} trẻ em</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Thanh toán</dt>
              <dd>{booking.paymentMethod === "bank" ? "Chuyển khoản" : "Thẻ tín dụng"}</dd>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3 text-base">
              <dt className="font-semibold">Tổng tiền</dt>
              <dd className="font-bold text-teal-600">{formatPrice(booking.totalPrice)}</dd>
            </div>
          </dl>
        </div>

        <Button href="/tours" className="mt-8" size="lg">
          Tiếp tục xem tour
        </Button>
      </div>
    </div>
  );
}
