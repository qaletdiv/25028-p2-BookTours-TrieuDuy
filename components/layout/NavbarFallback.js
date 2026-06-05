export default function NavbarFallback() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-lg font-bold text-white">
            T
          </span>
          <div>
            <p className="text-lg font-bold text-gray-900">TravelVN</p>
            <p className="text-xs text-gray-500">Đặt tour dễ dàng</p>
          </div>
        </a>
      </div>
    </header>
  );
}
