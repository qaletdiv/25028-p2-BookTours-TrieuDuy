"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/tours?category=domestic", label: "Tour Trong Nước" },
  { href: "/tours?category=international", label: "Tour Nước Ngoài" },
  { href: "/contact", label: "Liên hệ" },
];

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const { cartItem, clearCart } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white">
            T
          </span>
          <div>
            <p className="text-lg font-bold text-gray-900">TravelVN</p>
            <p className="text-xs text-gray-500">Đặt tour dễ dàng</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                pathname === link.href.split("?")[0]
                  ? "bg-teal-50 text-teal-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-teal-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/checkout"
            className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-50 hover:text-teal-600"
            title="Giỏ hàng"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {user && cartItem && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                1
              </span>
            )}
          </Link>

          {!loading && (
            user ? (
              <>
                <Link
                  href="/account"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Tài khoản của tôi
                </Link>
                <button
                  onClick={() => {
                    clearCart();
                    logout();
                  }}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                >
                  Đăng ký
                </Link>
              </>
            )
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <Link href="/checkout" className="relative rounded-lg p-2 text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {user && cartItem && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-[9px] font-bold text-white">
                1
              </span>
            )}
          </Link>
          <button
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-teal-50"
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2" />
            {!loading && (
              user ? (
                <>
                  <Link href="/account" onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium">
                    Tài khoản của tôi
                  </Link>
                  <button
                    onClick={() => {
                      clearCart();
                      logout();
                      setMenuOpen(false);
                    }}
                    className="rounded-lg px-4 py-3 text-left text-sm font-medium"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium">
                    Đăng nhập
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-teal-600">
                    Đăng ký
                  </Link>
                </>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
