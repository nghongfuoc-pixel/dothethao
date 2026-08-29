# PRD — Product Requirements Document — Hồng Phước

## 1. Tổng quan

**Tên sản phẩm:** Hồng Phước
**Mô tả:** Website bán quần áo thể thao (áo thể thao, đồ bộ, đồ bơi, áo ba lỗ, quần thể thao). Frontend tĩnh (HTML/CSS/JS thuần, không framework, không build step). Dữ liệu lúc phát triển nằm trong SQLite (qua Prisma), khi triển khai thật chuyển sang Supabase (Postgres + Auth). Không có server tự viết, không cổng thanh toán thật, không gửi email thật.

## 2. Đối tượng người dùng

- **Khách hàng (Guest):** duyệt sản phẩm, tìm kiếm/lọc, xem chi tiết, thêm giỏ hàng, đặt hàng, gửi liên hệ — **không cần tạo tài khoản**.
- **Quản trị viên (Admin):** đăng nhập bằng tài khoản Supabase Auth, quản lý sản phẩm (thêm/sửa/xóa), xem đơn hàng và tin nhắn liên hệ.

> Khác với các mô hình thương mại điện tử có tài khoản khách hàng, Hồng Phước **không có hệ thống đăng ký/đăng nhập cho khách** — mọi đơn hàng là "khách vãng lai" (guest checkout), chỉ admin mới cần đăng nhập.

## 3. Phạm vi (Scope)

**Trong phạm vi:**
- Giao diện tĩnh HTML/CSS/JS, không backend tự viết.
- Dữ liệu sản phẩm: SQLite (dev, qua Prisma) → xuất/đồng bộ sang Supabase (Postgres) cho production.
- Giỏ hàng lưu ở `localStorage` trình duyệt khách (không cần đăng nhập).
- Đặt hàng và gửi liên hệ: ghi trực tiếp vào Supabase (`orders`, `order_items`, `contact_messages`) khi đã cấu hình; lưu tạm `localStorage` khi chưa cấu hình Supabase.
- Trang quản trị (`admin.html`) CRUD sản phẩm + xem đơn hàng/tin nhắn, bảo vệ bằng Supabase Auth + Row Level Security.
- Tìm kiếm sản phẩm theo tên (không phân biệt dấu), lọc theo nhóm hàng.
- Kiểm tra tồn kho phía client khi thêm/sửa số lượng trong giỏ hàng.

**Ngoài phạm vi (hiện tại):**
- Thanh toán trực tuyến thật (thẻ, ví điện tử) — chỉ có hình thức COD/giao hàng thu tiền ngầm định qua form thông tin giao hàng.
- Gửi email xác nhận đơn hàng thật.
- Tài khoản/đăng nhập cho khách hàng (lịch sử mua hàng cá nhân).
- Quản lý tồn kho theo từng size/biến thể (size ở trang chi tiết sản phẩm hiện chỉ mang tính tham khảo).
- Trừ tồn kho tự động phía server khi có đơn hàng (mới kiểm tra giới hạn phía client).

## 4. Tính năng theo trang

### 4.1 Trang chủ (`index.html`)
Banner giới thiệu thương hiệu, nút "Xem toàn bộ sản phẩm" và "Liên hệ cửa hàng".

### 4.2 Giới thiệu (`gioi-thieu.html`)
Câu chuyện cửa hàng, số liệu nhanh, "Vì sao chọn Hồng Phước", "Cam kết của chúng tôi", banner kêu gọi hành động.

### 4.3 Sản phẩm (`san-pham.html`)
- Lọc theo 5 nhóm hàng (Tất cả / Áo thể thao / Đồ bộ / Đồ bơi / Áo ba lỗ / Quần thể thao).
- Ô tìm kiếm theo tên sản phẩm, không phân biệt dấu tiếng Việt.
- Mỗi card: ảnh, nhóm hàng, tên (link sang trang chi tiết), giá, nút "Thêm vào giỏ hàng" (disable + hiện "Hết hàng" nếu `stock = 0`).

### 4.4 Chi tiết sản phẩm (`san-pham-chi-tiet.html?id=`)
Ảnh lớn, tên, giá, trạng thái tồn kho (còn hàng / sắp hết / hết hàng), chọn size (S–XXL, chỉ tham khảo), chọn số lượng (giới hạn theo tồn kho), mô tả, nút thêm vào giỏ hàng.

### 4.5 Giỏ hàng (`gio-hang.html`)
Danh sách sản phẩm đã thêm, sửa số lượng (giới hạn theo tồn kho), xóa từng dòng, tổng tiền, nút sang thanh toán.

### 4.6 Thanh toán (`thanh-toan.html`)
Form giao hàng (họ tên, SĐT, địa chỉ, ghi chú) + tóm tắt đơn hàng. Gửi đơn: ghi vào Supabase nếu đã cấu hình, ngược lại lưu tạm `localStorage`. Sau khi đặt hàng: xóa giỏ hàng, hiện thông báo thành công.

### 4.7 Liên hệ (`lien-he.html`)
Thông tin cửa hàng (điện thoại, email, địa chỉ + bản đồ Google Maps nhúng), form gửi liên hệ nhanh (tên, email, nội dung).

### 4.8 Chính sách (`chinh-sach.html`)
Chính sách đổi trả, vận chuyển, bảo mật thông tin khách hàng.

### 4.9 Quản trị (`admin.html`)
- Đăng nhập bằng tài khoản Supabase Auth (email/mật khẩu).
- 3 tab: **Sản phẩm** (thêm/sửa/xóa), **Đơn hàng** (xem danh sách, đổi trạng thái xử lý), **Liên hệ** (xem tin nhắn khách gửi).
- Chỉ tài khoản đã đăng nhập mới ghi/xem được dữ liệu nhạy cảm (thi hành bằng Row Level Security ở Supabase, không chỉ ẩn giao diện).

## 5. Yêu cầu phi chức năng

- Giao diện tông xanh navy/đỏ/xanh lá theo bộ nhận diện Hồng Phước, responsive (desktop/tablet/mobile, có menu rút gọn dạng hamburger dưới 860px).
- Không bắt buộc đăng nhập ở bất kỳ luồng mua hàng nào (chỉ admin cần đăng nhập).
- Dữ liệu khởi tạo (25 sản phẩm, 5 nhóm hàng) đủ để demo toàn bộ luồng mà không cần nhập tay.
- Có SEO cơ bản (meta description, Open Graph) cho các trang công khai; trang giỏ hàng/thanh toán/quản trị đánh dấu `noindex`.
