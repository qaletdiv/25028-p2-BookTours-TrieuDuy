"use client";

import { useState } from "react";

export default function TourTabs({ tour }) {
  const [activeTab, setActiveTab] = useState("itinerary");

  const tabs = [
    { id: "itinerary", label: "Lịch trình" },
    { id: "pricing", label: "Giá & Phụ thu" },
    { id: "policy", label: "Chính sách" },
  ];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-4 text-sm font-semibold transition sm:px-6 ${
              activeTab === tab.id
                ? "border-b-2 border-teal-600 text-teal-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === "itinerary" && (
          <div className="space-y-6">
            {tour.itinerary.map((day) => (
              <div key={day.day} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
                  {day.day}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{day.title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{day.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="mb-3 font-semibold text-green-700">✓ Bao gồm</h4>
              <ul className="space-y-2">
                {tour.included.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-gray-600">
                    <span className="text-green-500">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-red-600">✗ Không bao gồm</h4>
              <ul className="space-y-2">
                {tour.excluded.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-gray-600">
                    <span className="text-red-400">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === "policy" && (
          <p className="text-sm leading-relaxed text-gray-600">{tour.policy}</p>
        )}
      </div>
    </div>
  );
}
