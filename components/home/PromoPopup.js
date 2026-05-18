"use client";

import { useEffect, useState } from "react";
import { img } from "@/data/images";
import Button from "@/components/ui/Button";

export default function PromoPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("promo_popup_shown");
    if (!shown) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("promo_popup_shown", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <img
          src={img.travel1}
          alt="Khuyến mãi"
          className="h-40 w-full object-cover"
        />
        <div className="p-6">
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
            KHUYẾN MÃI
          </span>
          <h3 className="mt-3 text-xl font-bold text-gray-900">
            Giảm 15% tour mùa hè!
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Đăng ký nhận tin để cập nhật ưu đãi mới nhất. Chỉ hiển thị một lần mỗi phiên truy cập.
          </p>
          <div className="mt-5 flex gap-3">
            <Button href="/register" className="flex-1" onClick={handleClose}>
              Đăng ký ngay
            </Button>
            <Button variant="ghost" onClick={handleClose}>
              Để sau
            </Button>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
          aria-label="Đóng"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
