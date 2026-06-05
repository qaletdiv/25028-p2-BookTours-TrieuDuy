import Banner from "@/components/home/Banner";
import SearchFilter from "@/components/home/SearchFilter";
import PromoPopup from "@/components/home/PromoPopup";
import TourCard from "@/components/tours/TourCard";
import { tours } from "@/data/tours";
import { buildToursHref } from "@/lib/tourUrl";

const sections = [
  { title: "Tour Hot", featured: "hot", description: "Những tour được yêu thích nhất" },
  { title: "Tour Trong Nước", featured: "domestic", description: "Khám phá vẻ đẹp Việt Nam" },
  { title: "Tour Nước Ngoài", featured: "international", description: "Chinh phục thế giới" },
];

export default function HomePage() {
  return (
    <>
      <PromoPopup />
      <Banner />

      <section className="relative z-10 -mt-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SearchFilter />
      </section>

      {sections.map((section) => {
        const sectionTours = tours.filter((t) => t.featured.includes(section.featured)).slice(0, 4);
        return (
          <section key={section.featured} className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{section.title}</h2>
                <p className="mt-1 text-gray-500">{section.description}</p>
              </div>
              <a
                href={
                  section.featured === "hot"
                    ? buildToursHref({ featured: "hot" })
                    : buildToursHref({ category: section.featured })
                }
                className="hidden text-sm font-semibold text-teal-600 hover:text-teal-700 sm:block"
              >
                Xem tất cả →
              </a>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {sectionTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="bg-teal-600 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Sẵn sàng cho chuyến đi tiếp theo?
          </h2>
          <p className="mt-2 text-teal-100">
            Hơn 15 tour hấp dẫn đang chờ bạn khám phá
          </p>
          <a
            href="/tours"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-teal-200 bg-white px-6 py-3 text-base font-semibold text-teal-700 transition hover:bg-teal-50"
          >
            Khám phá tất cả tour
          </a>
        </div>
      </section>
    </>
  );
}
