# TravelVN Backend API

Express REST API cho hệ thống đặt tour. Lưu dữ liệu trong `data/app-store.json`.

## Chạy local

```bash
npm install
copy .env.example .env   # macOS/Linux: cp .env.example .env
npm run dev              # node --watch server.js
```

Mặc định chạy ở `http://localhost:4000`.

## Biến môi trường

| Biến | Mô tả | Mặc định |
|------|-------|----------|
| `PORT` | Cổng server (Render tự set) | `4000` |
| `CORS_ORIGIN` | Origin frontend được phép gọi API | `*` |

## Endpoints

| Method | Path | Mô tả |
|--------|------|-------|
| POST | `/api/users` | Đăng ký |
| PUT | `/api/users/:id` | Cập nhật hồ sơ (cần session) |
| POST | `/api/auth/login` | Đăng nhập, trả về `sessionId` |
| GET | `/api/auth/session` | Lấy user theo session |
| DELETE | `/api/auth/session` | Đăng xuất |
| GET | `/api/bookings?userId=` | Lịch sử booking (cần session) |
| POST | `/api/bookings` | Tạo booking (cần session) |
| GET/POST/DELETE | `/api/cart` | Quản lý giỏ hàng |
| POST | `/api/contacts` | Gửi liên hệ |

Auth dùng header `X-Session-Id`, giỏ hàng khách dùng `X-Client-Id`.
