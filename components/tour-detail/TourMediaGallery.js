"use client";

import { useState } from "react";

const DEFAULT_VIDEO = "https://www.youtube.com/embed/1E4ciuOHlBg";

export default function TourMediaGallery({ tour }) {
  const [activeImage, setActiveImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const videoUrl = tour.videoUrl || DEFAULT_VIDEO;

  return (
    <div className="overflow-hidden rounded-2xl">
      {showVideo ? (
        <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
          <iframe
            src={videoUrl}
            title={`Video ${tour.name}`}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <img
          src={tour.images[activeImage]}
          alt={tour.name}
          className="aspect-[16/10] w-full object-cover sm:aspect-[21/9]"
        />
      )}

      <div className="mt-2 flex gap-2 overflow-x-auto p-1">
        {tour.images.map((img, i) => (
          <button
            key={i}
            onClick={() => { setActiveImage(i); setShowVideo(false); }}
            className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
              !showVideo && activeImage === i ? "border-teal-500" : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <img src={img} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
        <button
          onClick={() => setShowVideo(true)}
          className={`flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border-2 bg-gray-900 text-xs font-semibold text-white transition ${
            showVideo ? "border-teal-500" : "border-transparent opacity-80 hover:opacity-100"
          }`}
        >
          ▶ Video
        </button>
      </div>
    </div>
  );
}
