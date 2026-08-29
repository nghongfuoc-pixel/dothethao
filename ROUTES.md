# ROUTES.md — Hồng Phước

Website dạng multi-page tĩnh (không SPA). Mỗi dòng dưới đây là 1 file `.html` thật trong `frontend/`.

## 1. Trang công khai (Public)

| Route | File | Mô tả | Query params |
|---|---|---|---|
| `/` | `index.html` | Trang chủ: banner giới thiệu, CTA sang Sản phẩm/Liên hệ | — |
| `/gioi-thieu` | `gioi-thieu.html` | Giới thiệu cửa hàng, điểm mạnh, cam kết | — |
| `/san-pham` | `san-pham.html` | Danh sách sản phẩm, lọc nhóm hàng, tìm kiếm theo tên | — (lọc/tìm xử lý hoàn toàn phía client, không đẩy lên URL) |
| `/san-pham-chi-tiet` | `san-pham-chi-tiet.html` | Chi tiết 1 sản phẩm, chọn size/số lượng | `id` (product id) |
| `/gio-hang` | `gio-hang.html` | Giỏ hàng — đọc/ghi `localStorage`, không gọi server | — |
| `/thanh-toan` | `thanh-toan.html` | Form giao hàng, tóm tắt đơn, gửi đơn hàng | — |
| `/lien-he` | `lien-he.html` | Thông tin liên hệ + bản đồ + form gửi tin nhắn | — |
| `/chinh-sach` | `chinh-sach.html` | Chính sách đổi trả / vận chuyển / bảo mật | anchor: `#doi-tra`, `#van-chuyen`, `#bao-mat` |

## 2. Trang quản trị (yêu cầu đăng nhập Supabase Auth)

| Route | File | Mô tả |
|---|---|---|
| `/admin` | `admin.html` | Đăng nhập + quản trị, gồm 3 tab trong cùng 1 trang: **Sản phẩm** (CRUD), **Đơn hàng** (xem + đổi trạng thái), **Liên hệ** (xem tin nhắn) |

> Khác với mô hình nhiều trang admin riêng biệt, Hồng Phước gộp toàn bộ chức năng quản trị vào **1 file `admin.html` duy nhất**, chuyển tab bằng JavaScript (không load lại trang), vì phạm vi quản trị hiện tại còn nhỏ (chỉ sản phẩm/đơn hàng/liên hệ, không có nhiều loại đối tượng như một hệ thống lớn).

## 3. Luồng điều hướng chính

```
index.html
 ├─(nút "Xem toàn bộ sản phẩm")──> san-pham.html
 └─(nút "Liên hệ cửa hàng")──────> lien-he.html

san-pham.html ──(click ảnh/tên sản phẩm)──> san-pham-chi-tiet.html?id=..
san-pham.html ──(nút "Thêm vào giỏ hàng")──> ở lại trang, cập nhật số trên icon giỏ hàng

san-pham-chi-tiet.html ──(nút "Thêm vào giỏ hàng")──> ở lại trang, cập nhật giỏ hàng

gio-hang.html ──(nút "Tiến hành thanh toán")──> thanh-toan.html
thanh-toan.html ──(submit form, đặt hàng thành công)──> index.html (giỏ hàng bị xóa)

admin.html (chưa đăng nhập) ──(submit form đăng nhập thành công)──> hiện giao diện quản trị (không đổi URL)
admin.html (tab Sản phẩm) ──("+ Thêm sản phẩm" / "Sửa")──> mở modal trong cùng trang
```

## 4. Guard truy cập (client-side + Row Level Security)

- `admin.html` kiểm tra `sessionStorage.hp_admin_token` — chưa đăng nhập thì hiện form đăng nhập thay vì bảng dữ liệu.
- Đây **chỉ là guard hiển thị** ở phía client; lớp bảo vệ thật sự nằm ở **Row Level Security** trên Supabase (xem [DATABASE.md](DATABASE.md) mục 7) — kể cả khi ai đó bỏ qua giao diện và gọi thẳng REST API bằng `anon key`, họ vẫn không ghi/đọc được dữ liệu yêu cầu quyền `authenticated`.
- `gio-hang.html` và `thanh-toan.html` **không yêu cầu đăng nhập** — đúng theo phạm vi sản phẩm (khách vãng lai được mua hàng tự do).
