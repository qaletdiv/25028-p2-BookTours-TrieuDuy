import { Suspense } from "react";
import Navbar from "./Navbar";

function NavbarFallback() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <span className="text-lg font-bold text-gray-900">TravelVN</span>
      </div>
    </header>
  );
}

export default function NavbarShell() {
  return (
    <Suspense fallback={<NavbarFallback />}>
      <Navbar />
    </Suspense>
  );
}
