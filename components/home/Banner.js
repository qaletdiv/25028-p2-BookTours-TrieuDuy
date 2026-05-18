"use client";

import { useEffect, useState } from "react";
import { banners } from "@/data/tours";
import Button from "@/components/ui/Button";

export default function Banner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const banner = banners[current];

  return (
    <section className="relative h-[420px] overflow-hidden sm:h-[520px]">
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={b.image} alt={b.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      ))}

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-teal-300">
          {banner.subtitle}
        </p>
        <h1 className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-5xl">
          {banner.title}
        </h1>
        <div className="mt-6">
          <Button href={banner.link} size="lg">
            {banner.cta}
          </Button>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? "w-8 bg-white" : "w-2 bg-white/50"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
