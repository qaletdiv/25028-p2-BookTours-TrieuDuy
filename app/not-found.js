import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-6xl font-bold text-teal-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Không tìm thấy trang</h1>
      <p className="mt-2 text-gray-500">
        Trang bạn tìm kiếm không tồn tại hoặc tour đã bị gỡ.
      </p>
      <div className="mt-8 flex gap-3">
        <Button href="/">Về trang chủ</Button>
        <Button href="/tours" variant="secondary">Xem danh sách tour</Button>
      </div>
    </div>
  );
}
