"use client";

import { useState } from "react";

export default function TourMediaGallery({ tour }) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <div className="overflow-hidden rounded-2xl">
      <img
        src={tour.images[activeImage]}
        alt={tour.name}
        className="aspect-[16/10] w-full object-cover sm:aspect-[21/9]"
      />

      <div className="mt-2 flex gap-2 overflow-x-auto p-1">
        {tour.images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImage(i)}
            className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
              activeImage === i ? "border-teal-500" : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <img src={img} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
