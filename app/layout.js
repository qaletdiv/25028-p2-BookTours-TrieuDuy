import { Geist } from "next/font/google";
import "./globals.css";
import NavbarShell from "@/components/layout/NavbarShell";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/context/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "TravelVN - Hệ Thống Đặt Tour Du Lịch",
  description: "Khám phá và đặt tour du lịch trong nước và quốc tế",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <Providers>
          <NavbarShell />
          <main className="flex-1">{children}</main>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
