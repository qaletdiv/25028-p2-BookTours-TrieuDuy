"use client";

import { useState } from "react";

export default function TourImage({ src, alt, className = "" }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-teal-100 to-teal-200 text-teal-700 ${className}`}
      >
        <span className="text-sm font-medium">🖼 {alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}
