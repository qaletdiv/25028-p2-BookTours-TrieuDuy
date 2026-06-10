export const TOUR_FILTER_KEYS = [
  "destination",
  "departure",
  "duration",
  "category",
  "featured",
  "type",
  "minPrice",
  "maxPrice",
  "dateFrom",
  "dateTo",
];

export function buildToursHref(filters = {}) {
  const params = new URLSearchParams();
  TOUR_FILTER_KEYS.forEach((key) => {
    if (filters[key]) params.set(key, String(filters[key]));
  });
  const query = params.toString();
  return query ? `/tours?${query}` : "/tours";
}

export function getTourFiltersFromSearchParams(searchParams) {
  return {
    destination: searchParams.get("destination") || "",
    departure: searchParams.get("departure") || "",
    duration: searchParams.get("duration") || "",
    category: searchParams.get("category") || "",
    featured: searchParams.get("featured") || "",
    type: searchParams.get("type") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    dateFrom: searchParams.get("dateFrom") || "",
    dateTo: searchParams.get("dateTo") || "",
  };
}

export function normalizeToursHref(href) {
  if (!href?.startsWith("/tours")) return href;

  const [, search = ""] = href.split("?");
  if (!search) return "/tours";

  const params = new URLSearchParams(search);
  const filters = {};
  TOUR_FILTER_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) filters[key] = value;
  });

  return buildToursHref(filters);
}
