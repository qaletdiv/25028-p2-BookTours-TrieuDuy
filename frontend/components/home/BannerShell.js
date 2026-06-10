import { banners } from "@/data/tours";
import { normalizeToursHref } from "@/lib/tourUrl";

const banner = banners[0];

export default function BannerShell() {
  return (
    <section className="relative h-[420px] overflow-hidden sm:h-[520px]">
      <img
        src={banner.image}
        alt={banner.title}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-teal-300">
          {banner.subtitle}
        </p>
        <h1 className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-5xl">
          {banner.title}
        </h1>
        <div className="mt-6">
          <a
            href={normalizeToursHref(banner.link)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-base font-semibold text-white shadow-md shadow-teal-600/20"
          >
            {banner.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
