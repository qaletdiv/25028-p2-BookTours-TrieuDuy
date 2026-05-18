import { notFound } from "next/navigation";
import TourCard from "@/components/tours/TourCard";
import TourTabs from "@/components/tour-detail/TourTabs";
import TourMediaGallery from "@/components/tour-detail/TourMediaGallery";
import BookNowButton from "@/components/tour-detail/BookNowButton";
import { getTourById, getRelatedTours, formatDate, formatPrice } from "@/data/tours";

export async function generateStaticParams() {
  const { tours } = await import("@/data/tours");
  return tours.map((t) => ({ id: t.id }));
}

export default async function TourDetailPage({ params }) {
  const { id } = await params;
  const tour = getTourById(id);

  if (!tour) notFound();

  const relatedTours = getRelatedTours(tour);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TourMediaGallery tour={tour} />

          <div className="mt-6">
            <p className="text-sm font-medium text-teal-600">Mã tour: {tour.code}</p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">{tour.name}</h1>
            <p className="mt-3 leading-relaxed text-gray-600">{tour.description}</p>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Thời gian", value: `${tour.duration} ngày` },
                { label: "Khởi hành", value: tour.departure },
                { label: "Ngày gần nhất", value: formatDate(tour.departureDates[0]) },
                { label: "Còn chỗ", value: `${tour.seatsLeft} chỗ` },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-teal-50 p-4 text-center">
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="mt-1 font-semibold text-teal-700">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <TourTabs tour={tour} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <BookNowButton tour={tour} />
          </div>
        </div>
      </div>

      {relatedTours.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Tour liên quan</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedTours.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
