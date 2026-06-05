import { buildToursHref } from "@/lib/tourUrl";

const footerLinks = [
  { href: "/", label: "Trang chủ" },
  { href: buildToursHref({ category: "domestic" }), label: "Tour trong nước" },
  { href: buildToursHref({ category: "international" }), label: "Tour nước ngoài" },
  { href: "/contact", label: "Liên hệ" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-100 bg-gray-900 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h3 className="mb-3 text-lg font-bold text-white">TravelVN</h3>
          <p className="text-sm leading-relaxed">
            Nền tảng đặt tour du lịch trực tuyến — khám phá Việt Nam và thế giới với những hành trình đáng nhớ.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Liên kết</h4>
          <ul className="space-y-2 text-sm">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-teal-400">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Liên hệ</h4>
          <ul className="space-y-2 text-sm">
            <li>📍 116 Tân Chánh Hiệp 18, Q.12, TP.HCM</li>
            <li>📞 1900 1234</li>
            <li>✉️ support@travelvn.demo</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © 2026 TravelVN
      </div>
    </footer>
  );
}
