import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Liên hệ</h1>
          <p className="mt-2 text-gray-500">
            Có câu hỏi về tour? Hãy liên hệ với chúng tôi, đội ngũ sẽ hỗ trợ bạn sớm nhất.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex gap-4 rounded-xl bg-teal-50 p-4">
              <span className="text-2xl">📍</span>
              <div>
                <p className="font-semibold">Địa chỉ</p>
                <p className="text-sm text-gray-600">116 Tân Chánh Hiệp 18, Q.12, TP.HCM</p>
              </div>
            </div>
            <div className="flex gap-4 rounded-xl bg-teal-50 p-4">
              <span className="text-2xl">📞</span>
              <div>
                <p className="font-semibold">Hotline</p>
                <p className="text-sm text-gray-600">1900 1234 (8:00 - 22:00)</p>
              </div>
            </div>
            <div className="flex gap-4 rounded-xl bg-teal-50 p-4">
              <span className="text-2xl">✉️</span>
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-sm text-gray-600">support@travelvn.demo</p>
              </div>
            </div>
          </div>
        </div>

        <form className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Gửi tin nhắn</h2>
          <div className="space-y-4">
            <Input label="Họ tên" placeholder="Nguyễn Văn A" />
            <Input label="Email" type="email" placeholder="email@example.com" />
            <Input label="Tiêu đề" placeholder="Hỏi về tour..." />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Nội dung</label>
              <textarea
                rows={4}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                placeholder="Nội dung tin nhắn..."
              />
            </div>
            <Button type="button" className="w-full">
              Gửi liên hệ
            </Button>
            <p className="text-center text-xs text-gray-400">
              (Form mô phỏng — không gửi dữ liệu thật)
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
