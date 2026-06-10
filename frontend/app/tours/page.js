"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TourCard from "@/components/tours/TourCard";
import TourFilters from "@/components/tours/TourFilters";
import Pagination from "@/components/tours/Pagination";
import { tours } from "@/data/tours";
import { filterTours, paginateTours, sortTours } from "@/lib/tourHelpers";
import { buildToursHref, getTourFiltersFromSearchParams } from "@/lib/tourUrl";

function ToursContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);

  const filters = useMemo(
    () => getTourFiltersFromSearchParams(searchParams),
    [searchParams]
  );

  useEffect(() => {
    setPage(1);
  }, [searchParams]);

  const filtered = useMemo(() => {
    const result = filterTours(tours, filters);
    return sortTours(result, sortBy);
  }, [filters, sortBy]);

  const { items, currentPage, totalPages, totalItems } = paginateTours(filtered, page, 6);

  const handleFilterChange = (newFilters) => {
    router.replace(buildToursHref(newFilters));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Danh sách tour</h1>
        <p className="mt-1 text-gray-500">
          Tìm thấy {totalItems} tour phù hợp
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <TourFilters filters={filters} onChange={handleFilterChange} />
        </div>

        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
            <span className="text-sm text-gray-500">Sắp xếp theo</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="default">Mặc định</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="name-asc">Tên A-Z</option>
            </select>
          </div>

          {items.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          ) : (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <p className="text-lg font-medium text-gray-900">Không tìm thấy tour</p>
              <p className="mt-2 text-sm text-gray-500">Thử thay đổi bộ lọc để xem thêm kết quả</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ToursPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    }>
      <ToursContent />
    </Suspense>
  );
}
