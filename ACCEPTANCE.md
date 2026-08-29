# ACCEPTANCE.md — Tiêu chí nghiệm thu — Hồng Phước

Checklist dùng để kiểm thử thủ công. Các mục đánh dấu **(đã test)** đã được xác nhận hoạt động đúng trong quá trình phát triển bằng trình duyệt thật; các mục còn lại cần kiểm tra khi kết nối Supabase thật.

## 1. Trang chủ

- [x] **(đã test)** Hiển thị đúng banner, tên thương hiệu Hồng Phước, logo SVG riêng.
- [x] **(đã test)** Nút "Xem toàn bộ sản phẩm" → `san-pham.html`, nút "Liên hệ cửa hàng" → `lien-he.html`.

## 2. Sản phẩm

- [x] **(đã test)** Hiển thị đủ 25 sản phẩm, đúng 5 nhóm hàng.
- [x] **(đã test)** Bấm nút lọc theo nhóm hàng → chỉ hiện đúng sản phẩm thuộc nhóm đó (VD: "Đồ bộ" → đúng 5 sản phẩm).
- [x] **(đã test)** Gõ từ khóa vào ô tìm kiếm (không dấu) → lọc đúng theo tên sản phẩm, không phân biệt dấu tiếng Việt.
- [x] **(đã test)** Sản phẩm hết hàng (`stock=0`) → hiện badge "Hết hàng", nút thêm giỏ hàng bị disable.
- [x] **(đã test)** Click ảnh/tên sản phẩm → sang đúng `san-pham-chi-tiet.html?id=` của sản phẩm đó.

## 3. Chi tiết sản phẩm

- [x] **(đã test)** Hiển thị đúng ảnh, tên, giá, tồn kho của sản phẩm được chọn.
- [x] **(đã test)** Chọn size, tăng/giảm số lượng (giới hạn theo tồn kho) hoạt động đúng.
- [x] **(đã test)** Bấm "Thêm vào giỏ hàng" → số trên icon giỏ hàng ở header tăng đúng.

## 4. Giỏ hàng

- [x] **(đã test)** Hiển thị đúng toàn bộ sản phẩm đã thêm, đúng số lượng và giá.
- [x] **(đã test)** Sửa số lượng vượt quá tồn kho → tự động giới hạn về đúng số tồn kho, hiện cảnh báo.
- [x] **(đã test)** Xóa 1 sản phẩm → chỉ sản phẩm đó biến mất, tổng tiền cập nhật lại đúng.
- [x] **(đã test)** Tổng tiền tính đúng (đã kiểm chứng bằng phép cộng thủ công khi test).
- [ ] Giỏ hàng trống → hiện thông báo + nút "Chọn sản phẩm", không có bảng trống gây khó hiểu.

## 5. Thanh toán

- [x] **(đã test)** Tóm tắt đơn hàng ở trang Thanh toán khớp đúng với giỏ hàng.
- [ ] Bỏ trống trường bắt buộc (họ tên/SĐT/địa chỉ) → trình duyệt chặn submit (validate HTML5 `required`).
- [ ] Đặt hàng thành công khi đã kết nối Supabase → dòng mới xuất hiện đúng trong bảng `orders`/`order_items`, giỏ hàng bị xóa sau khi đặt.
- [x] **(đã test, chế độ chưa kết nối Supabase)** Đặt hàng khi chưa cấu hình Supabase → lưu tạm vào `localStorage`, không lỗi, giỏ hàng vẫn được xóa.

## 6. Liên hệ

- [x] **(đã test)** Hiển thị đúng điện thoại, email, địa chỉ, bản đồ Google Maps nhúng đúng vị trí.
- [ ] Gửi form liên hệ khi đã kết nối Supabase → dòng mới xuất hiện đúng trong bảng `contact_messages`.
- [x] **(đã test, chế độ chưa kết nối Supabase)** Gửi form khi chưa cấu hình Supabase → lưu tạm `localStorage`, hiện thông báo thành công.

## 7. Chính sách

- [x] **(đã test)** Đủ 3 mục: đổi trả, vận chuyển, bảo mật. Link ở footer từ mọi trang trỏ đúng anchor tương ứng.

## 8. Quản trị (Admin)

- [x] **(đã test giao diện)** Chưa cấu hình Supabase → hiện đúng thông báo "Chưa cấu hình Supabase", không hiện form đăng nhập.
- [ ] Đăng nhập đúng tài khoản Supabase Auth → vào được giao diện quản trị.
- [ ] Đăng nhập sai → hiện lỗi rõ ràng, không cho vào.
- [ ] Tab Sản phẩm: thêm sản phẩm mới → xuất hiện ngay trong danh sách và trên `san-pham.html` (phía khách).
- [ ] Tab Sản phẩm: sửa/xóa sản phẩm → phản ánh đúng cả 2 phía (admin và khách).
- [ ] Tab Đơn hàng: hiển thị đúng danh sách sản phẩm đã đặt trong mỗi đơn, đổi trạng thái lưu lại đúng sau khi tải lại trang.
- [ ] Tab Liên hệ: hiển thị đúng danh sách tin nhắn, mới nhất lên đầu.
- [ ] Khách vãng lai (không đăng nhập) gọi thẳng API không đọc được `orders`/`contact_messages`/ghi được `products` (kiểm tra bằng cách gọi REST API trực tiếp bằng `anon key`, xác nhận bị chặn bởi RLS).

## 9. Responsive & khả năng tiếp cận

- [x] **(đã test ở khung 375px)** Menu chính thu gọn thành nút hamburger dưới 860px, bấm mở ra menu dọc đầy đủ.
- [x] **(đã test)** Layout chi tiết sản phẩm/thanh toán/liên hệ chuyển từ 2 cột sang 1 cột dưới 800px.
- [x] **(đã test)** Icon trang trí (☎ ✉ 📍 và icon trang Giới thiệu) đã đánh dấu `aria-hidden`, không gây nhiễu trình đọc màn hình.
- [ ] Kiểm tra độ tương phản màu chữ/nền đạt chuẩn WCAG AA cơ bản.

## 10. SEO & hiệu năng

- [x] **(đã test)** Mỗi trang công khai có `<title>` và `meta description` riêng; trang Giỏ hàng/Thanh toán/Quản trị đánh dấu `noindex`.
- [x] **(đã test bằng cách mở trực tiếp file)** Ảnh sản phẩm đã nén, tổng dung lượng 25 ảnh giảm từ 1.52MB xuống 957KB.
- [ ] Chia sẻ link lên Facebook/Zalo hiện đúng ảnh + mô tả Open Graph (cần test sau khi domain thật lên GitHub Pages, vì một số nền tảng không crawl `localhost`).

## 11. Giao diện chung

- [x] **(đã test)** Không có lỗi console JavaScript khi thao tác qua các luồng chính (thêm giỏ hàng, lọc, tìm kiếm, xem chi tiết, mở trang quản trị lúc chưa cấu hình Supabase).
- [x] **(đã test)** Giao diện nhất quán tông màu navy/đỏ/xanh lá theo [UI_SPEC.md](UI_SPEC.md) trên toàn bộ 9 trang.
