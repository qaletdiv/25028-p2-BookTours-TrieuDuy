# TravelVN - Hệ Thống Đặt Tour Du Lịch

Website đặt tour du lịch phía người dùng, xây dựng bằng **React + Next.js** (frontend only).

## Công nghệ

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- localStorage (mô phỏng đăng ký, đăng nhập, booking)

## Chức năng

| Màn hình | Route | Mô tả |
|----------|-------|-------|
| Trang chủ | `/` | Banner slide, bộ lọc tìm kiếm, tour nổi bật, pop-up khuyến mãi |
| Danh sách tour | `/tours` | Lọc, sắp xếp, phân trang |
| Chi tiết tour | `/tours/[id]` | Tab lịch trình/giá/chính sách, đặt ngay |
| Đăng ký | `/register` | Form đăng ký + validation |
| Đăng nhập | `/login` | Xác thực mock qua localStorage |
| Thanh toán | `/checkout` | Yêu cầu đăng nhập, form booking |
| Xác nhận | `/confirmation` | Tóm tắt booking thành công |
| Tài khoản | `/account` | Thông tin cá nhân + lịch sử booking |
| Liên hệ | `/contact` | Form liên hệ (mô phỏng) |

## Cài đặt & chạy

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

## Luồng demo

1. Duyệt tour trên trang chủ hoặc `/tours`
2. Xem chi tiết tour → nhấn **Đặt ngay**
3. Đăng ký tài khoản mới (hoặc đăng nhập nếu đã có)
4. Điền form thanh toán → **Hoàn tất đặt tour**
5. Xem xác nhận booking và lịch sử tại **Tài khoản của tôi**

## Lưu ý

- Không có backend/database thật — dữ liệu lưu trong **localStorage** trình duyệt
- Thanh toán chỉ **mô phỏng**, không kết nối cổng thanh toán
- Ảnh tour lấy từ Unsplash (cần internet khi xem)

## Cấu trúc thư mục

```
app/           → Các trang (Next.js App Router)
components/    → UI components tái sử dụng
context/       → Auth & Cart (React Context)
data/          → Mock data tours
lib/           → Helpers, validation, storage
```
