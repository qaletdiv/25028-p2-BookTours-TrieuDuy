# TravelVN - Hệ Thống Đặt Tour Du Lịch

Monorepo gồm 2 phần, deploy thành **2 service riêng trên Render**:

```
travel-booking-platform/
├── frontend/   # Next.js 16 + React 19 + Tailwind 4 (giao diện người dùng)
├── backend/    # Express REST API (đăng ký, đăng nhập, booking, cart, contact)
└── render.yaml # Blueprint deploy cả 2 service
```

## Chạy local

Mở 2 terminal:

```bash
# Terminal 1 - backend (cổng 4000)
cd backend
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run dev

# Terminal 2 - frontend (cổng 3000)
cd frontend
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000). Frontend gọi API qua biến `NEXT_PUBLIC_API_URL`.

## Deploy lên Render

1. Push repo này lên GitHub.
2. Trên Render: **New → Blueprint**, chọn repo → Render đọc `render.yaml` và tạo 2 service:
   - `travelvn-api` (backend)
   - `travelvn-web` (frontend)
3. Sau lần deploy đầu, vào từng service set biến môi trường (vì cần URL chéo nhau):
   - `travelvn-api` → `CORS_ORIGIN` = URL frontend (vd `https://travelvn-web.onrender.com`)
   - `travelvn-web` → `NEXT_PUBLIC_API_URL` = URL backend (vd `https://travelvn-api.onrender.com`)
4. Trigger redeploy `travelvn-web` để build lại với URL backend đúng.

> Nếu không dùng Blueprint, tạo thủ công 2 **Web Service**, mỗi service trỏ Root Directory tới `frontend` hoặc `backend`.

## Chức năng

| Màn hình | Route | Mô tả |
|----------|-------|-------|
| Trang chủ | `/` | Banner slide, bộ lọc tìm kiếm, tour nổi bật, pop-up khuyến mãi |
| Danh sách tour | `/tours` | Lọc, sắp xếp, phân trang |
| Chi tiết tour | `/tours/[id]` | Tab lịch trình/giá/chính sách, đặt ngay |
| Đăng ký | `/register` | Form đăng ký + validation |
| Đăng nhập | `/login` | Xác thực qua API |
| Thanh toán | `/checkout` | Yêu cầu đăng nhập, form booking |
| Xác nhận | `/confirmation` | Tóm tắt booking thành công |
| Tài khoản | `/account` | Thông tin cá nhân + lịch sử booking |
| Liên hệ | `/contact` | Form liên hệ |

## Lưu ý

- Backend lưu dữ liệu trong file `backend/data/app-store.json` (không phải DB thật). Trên Render free tier, filesystem là ephemeral nên dữ liệu sẽ reset khi redeploy.
- Thanh toán chỉ **mô phỏng**, không kết nối cổng thanh toán.
- Ảnh tour lấy từ Unsplash (cần internet khi xem).
