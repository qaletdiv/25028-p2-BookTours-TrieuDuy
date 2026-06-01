"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatDate, formatPrice } from "@/data/tours";
import { getTourById } from "@/data/tours";
import {
  generateBookingCode,
  getBookings,
  saveBookings,
  saveLastBooking,
} from "@/lib/storage";
import { validateCheckout } from "@/lib/validation";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

function CheckoutForm() {
  const { user } = useAuth();
  const { cartItems, addToCart, removeFromCart, clearCart, ready } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [contact, setContact] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });
  const [tourDates, setTourDates] = useState({});
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [passengers, setPassengers] = useState([{ fullName: "", phone: "", idNumber: "" }]);
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const tourId = searchParams.get("tourId");
    if (tourId) {
      const tour = getTourById(tourId);
      if (tour && !cartItems.some((t) => t.id === tour.id)) {
        addToCart(tour);
        return;
      }
    }
    if (cartItems.length === 0) {
      router.replace("/tours");
    }
  }, [ready, searchParams, cartItems, addToCart, router]);

  useEffect(() => {
    if (!ready || cartItems.length === 0) return;
    setContact({
      fullName: user.fullName || "",
      phone: user.phone || "",
      email: user.email || "",
      address: user.address || "",
    });
    setTourDates((prev) => {
      const next = { ...prev };
      cartItems.forEach((t) => {
        if (!next[t.id]) next[t.id] = t.departureDates[0];
      });
      return next;
    });
  }, [cartItems, user, ready]);

  useEffect(() => {
    const total = adults + children;
    setPassengers((prev) => {
      const updated = [...prev];
      while (updated.length < total) {
        updated.push({ fullName: "", phone: "", idNumber: "" });
      }
      return updated.slice(0, total);
    });
  }, [adults, children]);

  if (!ready || cartItems.length === 0) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  const lineTotal = (tour) => adults * tour.price + children * tour.childPrice;
  const totalPrice = cartItems.reduce((sum, tour) => sum + lineTotal(tour), 0);

  const handlePassengerChange = (index, field, value) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateCheckout({ contact, passengers, paymentMethod, card });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    const bookings = cartItems.map((tour) => ({
      id: generateBookingCode(),
      userId: user.id,
      tourId: tour.id,
      tourName: tour.name,
      departureDate: tourDates[tour.id],
      adults,
      children,
      totalPrice: lineTotal(tour),
      paymentMethod,
      contact,
      passengers,
      createdAt: new Date().toISOString(),
    }));

    const allBookings = getBookings();
    allBookings.unshift(...bookings);
    saveBookings(allBookings);
    saveLastBooking({
      bookings,
      totalPrice,
      paymentMethod,
      contact,
      createdAt: new Date().toISOString(),
    });

    router.push("/confirmation");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Thanh toán</h1>
      <p className="mb-8 text-sm text-gray-500">
        Giỏ hàng có {cartItems.length} tour — bạn có thể tiếp tục thêm tour khác trước khi thanh toán
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">Thông tin liên lạc</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Họ tên"
                  value={contact.fullName}
                  onChange={(e) => setContact({ ...contact, fullName: e.target.value })}
                  error={errors.contactFullName}
                />
                <Input
                  label="Số điện thoại"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  error={errors.contactPhone}
                  placeholder="0901234567"
                />
                <Input
                  label="Email"
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  error={errors.contactEmail}
                />
                <Input
                  label="Địa chỉ"
                  value={contact.address}
                  onChange={(e) => setContact({ ...contact, address: e.target.value })}
                  error={errors.contactAddress}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">Số lượng khách (áp dụng cho tất cả tour)</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Người lớn"
                  type="number"
                  min={1}
                  max={10}
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                />
                <Input
                  label="Trẻ em"
                  type="number"
                  min={0}
                  max={10}
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">Thông tin khách đi tour</h2>
              <div className="space-y-4">
                {passengers.map((p, i) => (
                  <div key={i} className="rounded-xl bg-gray-50 p-4">
                    <p className="mb-3 text-sm font-semibold text-gray-700">Khách {i + 1}</p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Input
                        label="Họ tên"
                        value={p.fullName}
                        onChange={(e) => handlePassengerChange(i, "fullName", e.target.value)}
                        error={errors.passengers?.[i]?.fullName}
                      />
                      <Input
                        label="SĐT"
                        value={p.phone}
                        onChange={(e) => handlePassengerChange(i, "phone", e.target.value)}
                        error={errors.passengers?.[i]?.phone}
                      />
                      <Input
                        label="CMND/CCCD"
                        value={p.idNumber}
                        onChange={(e) => handlePassengerChange(i, "idNumber", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">Phương thức thanh toán</h2>
              <div className="space-y-3">
                {[
                  { id: "bank", label: "Chuyển khoản ngân hàng", desc: "Vietcombank - 1234567890" },
                  { id: "card", label: "Thẻ tín dụng (mô phỏng)", desc: "Visa / Mastercard" },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                      paymentMethod === method.id ? "border-teal-500 bg-teal-50" : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                    />
                    <div>
                      <p className="font-medium">{method.label}</p>
                      <p className="text-sm text-gray-500">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === "card" && (
                <div className="mt-4 grid gap-4 rounded-xl border border-teal-100 bg-teal-50/50 p-4 sm:grid-cols-2">
                  <Input
                    label="Số thẻ"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                    error={errors.card?.number}
                    placeholder="1234 5678 9012 3456"
                    className="sm:col-span-2"
                  />
                  <Input
                    label="Hạn sử dụng"
                    value={card.expiry}
                    onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                    error={errors.card?.expiry}
                    placeholder="MM/YY"
                  />
                  <Input
                    label="CVV"
                    value={card.cvv}
                    onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                    error={errors.card?.cvv}
                    placeholder="123"
                  />
                  <Input
                    label="Tên trên thẻ"
                    value={card.name}
                    onChange={(e) => setCard({ ...card, name: e.target.value })}
                    error={errors.card?.name}
                    className="sm:col-span-2"
                  />
                  <p className="text-xs text-gray-500 sm:col-span-2">
                    * Form mô phỏng — không thu thập dữ liệu thẻ thật
                  </p>
                </div>
              )}
            </section>
          </div>

          <div>
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
                <h2 className="text-lg font-bold">Giỏ hàng ({cartItems.length})</h2>
                <ul className="mt-4 space-y-4">
                  {cartItems.map((tour) => (
                    <li key={tour.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex gap-3">
                        <img
                          src={tour.images[0]}
                          alt=""
                          className="h-16 w-16 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm leading-snug">{tour.name}</h3>
                          {tour.departureDates.length > 1 ? (
                            <Select
                              label="Ngày khởi hành"
                              value={tourDates[tour.id] || tour.departureDates[0]}
                              onChange={(e) =>
                                setTourDates({ ...tourDates, [tour.id]: e.target.value })
                              }
                              className="mt-2"
                            >
                              {tour.departureDates.map((d) => (
                                <option key={d} value={d}>
                                  {formatDate(d)}
                                </option>
                              ))}
                            </Select>
                          ) : (
                            <p className="mt-1 text-xs text-gray-500">
                              Khởi hành: {formatDate(tour.departureDates[0])}
                            </p>
                          )}
                          <p className="mt-1 text-sm font-medium text-teal-600">
                            {formatPrice(lineTotal(tour))}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeFromCart(tour.id)}
                            className="mt-1 text-xs text-red-600 hover:underline"
                          >
                            Xóa khỏi giỏ
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Người lớn x{adults} × {cartItems.length} tour
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-2 text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-teal-600">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <Button type="submit" className="mt-6 w-full" size="lg" disabled={loading}>
                  {loading ? "Đang xử lý..." : `Hoàn tất đặt ${cartItems.length} tour`}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-2 w-full"
                  onClick={() => router.push("/tours")}
                >
                  Thêm tour khác
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-2 w-full text-red-600"
                  onClick={() => {
                    clearCart();
                    router.push("/tours");
                  }}
                >
                  Xóa toàn bộ giỏ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <CheckoutForm />
    </AuthGuard>
  );
}
