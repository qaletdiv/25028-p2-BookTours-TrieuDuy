"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatDate, formatPrice } from "@/data/tours";
import Button from "@/components/ui/Button";

export default function BookNowButton({ tour }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  const handleBook = () => {
    if (!user) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          `/checkout?tourId=${tour.id}`
        )}`
      );
      return;
    }
    addToCart(tour);
    router.push("/checkout");
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
      <p className="text-sm text-gray-500">Giá từ</p>
      <p className="text-3xl font-bold text-teal-600">{formatPrice(tour.price)}</p>
      <p className="mt-1 text-sm text-gray-500">
        Trẻ em: {formatPrice(tour.childPrice)}
      </p>

      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <p>⏱ {tour.duration} ngày {tour.duration - 1} đêm</p>
        <p>📍 Khởi hành: {tour.departure}</p>
        <p>🗓 Ngày gần nhất: {formatDate(tour.departureDates[0])}</p>
        <p>👥 Còn {tour.seatsLeft} chỗ</p>
      </div>

      <Button onClick={handleBook} className="mt-6 w-full" size="lg">
        Đặt ngay
      </Button>
    </div>
  );
}
