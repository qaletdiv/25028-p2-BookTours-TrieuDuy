"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { destinations, departurePoints, durationRanges } from "@/data/tours";
import Button from "@/components/ui/Button";

export default function SearchFilter({ compact = false }) {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [departure, setDeparture] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [duration, setDuration] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.set("destination", destination);
    if (departure) params.set("departure", departure);
    if (duration) params.set("duration", duration);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    router.push(`/tours?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`rounded-2xl bg-white p-4 shadow-xl sm:p-6 ${
        compact ? "border border-gray-100" : ""
      }`}
    >
      <div className={`grid gap-4 ${compact ? "sm:grid-cols-2 lg:grid-cols-5" : "sm:grid-cols-2 lg:grid-cols-6"}`}>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Điểm đến
          </label>
          <input
            list="destinations"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Chọn hoặc gõ điểm đến"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
          />
          <datalist id="destinations">
            {destinations.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Điểm khởi hành
          </label>
          <select
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
          >
            <option value="">Tất cả</option>
            {departurePoints.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Ngày đi từ
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Ngày đi đến
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Số ngày
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
          >
            <option value="">Tất cả</option>
            {durationRanges.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <Button type="submit" className="w-full">
            🔍 Tìm tour
          </Button>
        </div>
      </div>
    </form>
  );
}
