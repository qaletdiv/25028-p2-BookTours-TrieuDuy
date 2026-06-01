"use client";

import { useEffect, useRef, useState } from "react";
import { getBookings, getLastBooking } from "@/lib/storage";
import { formatDate, formatPrice } from "@/data/tours";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";

function normalizeLastBooking(last) {
  if (!last) return null;
  if (last.bookings?.length) return last;
  if (last.id && last.tourName) {
    return {
      bookings: [last],
      totalPrice: last.totalPrice,
      paymentMethod: last.paymentMethod,
      contact: last.contact,
      createdAt: last.createdAt,
    };
  }
  return null;
}

export default function ConfirmationPage() {
  const [order, setOrder] = useState(null);
  const [ready, setReady] = useState(false);
  const { clearCart } = useCart();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    clearCart();

    const last = normalizeLastBooking(getLastBooking());
    if (last) {
      setOrder(last);
      setReady(true);
      return;
    }

    const bookings = getBookings();
    if (bookings.length > 0) {
      setOrder({
        bookings: [bookings[0]],
        totalPrice: bookings[0].totalPrice,
        paymentMethod: bookings[0].paymentMethod,
      });
    }
    setReady(true);
  }, [clearCart]);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (!order?.bookings?.length) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-gray-500">Không tìm thấy thông tin booking.</p>
        <Button href="/tours" className="mt-4">
          Xem tour
        </Button>
      </div>
    );
  }

  const { bookings, totalPrice, paymentMethod } = order;
  const multiple = bookings.length > 1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-2xl border border-green-200 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
          ✓
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          {multiple ? `Đặt ${bookings.length} tour thành công!` : "Đặt tour thành công!"}
        </h1>
        <p className="mt-2 text-gray-500">
          Cảm ơn bạn đã đặt tour. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
        </p>

        <div className="mt-8 space-y-4 text-left">
          {bookings.map((booking) => (
            <div key={booking.id} className="rounded-xl bg-gray-50 p-6">
              <h2 className="mb-4 font-bold text-gray-900">
                {multiple ? booking.tourName : "Chi tiết booking"}
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Mã booking</dt>
                  <dd className="font-semibold text-teal-600">{booking.id}</dd>
                </div>
                {!multiple && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Tour</dt>
                    <dd className="font-medium">{booking.tourName}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-gray-500">Ngày khởi hành</dt>
                  <dd>{formatDate(booking.departureDate)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Số khách</dt>
                  <dd>
                    {booking.adults} người lớn, {booking.children} trẻ em
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Thành tiền</dt>
                  <dd className="font-medium text-teal-600">{formatPrice(booking.totalPrice)}</dd>
                </div>
              </dl>
            </div>
          ))}

          <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Thanh toán</span>
              <span>{paymentMethod === "bank" ? "Chuyển khoản" : "Thẻ tín dụng"}</span>
            </div>
            {multiple && (
              <div className="mt-2 flex justify-between border-t border-teal-100 pt-2 text-base font-bold">
                <span>Tổng thanh toán</span>
                <span className="text-teal-600">{formatPrice(totalPrice)}</span>
              </div>
            )}
          </div>
        </div>

        <Button href="/tours" className="mt-8" size="lg">
          Tiếp tục xem tour
        </Button>
      </div>
    </div>
  );
}
