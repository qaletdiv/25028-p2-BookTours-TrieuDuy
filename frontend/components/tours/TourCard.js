import { formatPrice } from "@/data/tours";

export default function TourCard({ tour }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={tour.images[0]}
          alt={tour.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {tour.featured.includes("hot") && (
          <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
            HOT
          </span>
        )}
        <span className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2 py-1 text-xs text-white">
          {tour.duration} ngày
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-teal-600">
          {tour.summary}
        </p>
        <h3 className="mt-1 min-h-[56px] line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-teal-700">
          {tour.name}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Giá từ</p>
            <p className="text-xl font-bold text-teal-600">{formatPrice(tour.price)}</p>
          </div>
          <div className="flex items-center gap-1 text-sm text-amber-500">
            ★ {tour.rating}
          </div>
        </div>
        <a
          href={`/tours/${tour.id}`}
          className="mt-auto block w-full rounded-lg bg-teal-600 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          Xem chi tiết
        </a>
      </div>
    </article>
  );
}
