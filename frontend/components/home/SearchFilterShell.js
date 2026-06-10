export default function SearchFilterShell({ compact = false }) {
  return (
    <div
      className={`rounded-2xl bg-white p-4 shadow-xl sm:p-6 ${
        compact ? "border border-gray-100" : ""
      }`}
      aria-hidden="true"
    >
      <div
        className={`grid gap-4 ${
          compact ? "sm:grid-cols-2 lg:grid-cols-5" : "sm:grid-cols-2 lg:grid-cols-6"
        }`}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-[72px] rounded-lg bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
