import { durationRanges } from "@/data/tours";

export function filterTours(tours, filters) {
  return tours.filter((tour) => {
    if (filters.destination && tour.destination !== filters.destination) return false;
    if (filters.departure && tour.departure !== filters.departure) return false;
    if (filters.category && tour.category !== filters.category) return false;
    if (filters.type && tour.type !== filters.type) return false;

    if (filters.minPrice && tour.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && tour.price > Number(filters.maxPrice)) return false;

    if (filters.duration) {
      const range = durationRanges.find((r) => r.value === filters.duration);
      if (range && (tour.duration < range.min || tour.duration > range.max)) return false;
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        tour.name.toLowerCase().includes(q) ||
        tour.destination.toLowerCase().includes(q) ||
        tour.summary.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (filters.featured) {
      if (!tour.featured.includes(filters.featured)) return false;
    }

    if (filters.dateFrom || filters.dateTo) {
      const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
      const to = filters.dateTo ? new Date(filters.dateTo) : null;
      const hasMatchingDate = tour.departureDates.some((d) => {
        const date = new Date(d);
        if (from && date < from) return false;
        if (to && date > to) return false;
        return true;
      });
      if (!hasMatchingDate) return false;
    }

    return true;
  });
}

export function sortTours(tours, sortBy) {
  const sorted = [...tours];
  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    default:
      return sorted;
  }
}

export function paginateTours(tours, page, perPage = 6) {
  const totalPages = Math.ceil(tours.length / perPage) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * perPage;
  return {
    items: tours.slice(start, start + perPage),
    currentPage,
    totalPages,
    totalItems: tours.length,
  };
}
