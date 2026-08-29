# UI_SPEC.md — Đặc tả giao diện — Hồng Phước

## 1. Bảng màu & typography

Định nghĩa dạng CSS custom properties trong [frontend/css/styles.css](frontend/css/styles.css), áp dụng toàn site.

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--navy` | `#0f1b2d` | Header, footer, banner hero, nút hoạt động (nav/filter active) |
| `--navy-light` | `#16233a` | Gradient cùng `--navy` cho hero/CTA band |
| `--red` | `#e5484d` | Màu thương hiệu chính — nút CTA chính, giá tiền, tag danh mục |
| `--red-dark` | `#c93a3e` | Trạng thái hover của nút đỏ |
| `--green` | `#7fc93c` | Nút phụ (CTA thứ 2), badge số lượng giỏ hàng |
| `--text` | `#1a1a1a` | Chữ chính |
| `--muted` | `#6b7280` | Chữ phụ, mô tả, ghi chú |
| `--border` | `#e5e7eb` | Viền card, input, bảng |
| `--bg` | `#f8f9fb` | Nền toàn trang (nền sáng) |
| Font | hệ thống (`"Segoe UI", Roboto, Arial, sans-serif`) | Toàn site |

## 2. Trang chủ (`index.html`)

**Header:** logo Hồng Phước (SVG, huy hiệu tròn "HP") trái, menu ngang giữa/phải (Trang chủ, Giới thiệu, Sản phẩm, Giỏ hàng có badge số lượng, Thanh toán, Liên hệ, Quản trị), nút hamburger thay menu khi màn hình ≤860px.

**Hero:** nền gradient navy, bên trái tiêu đề "Cửa hàng HỒNG PHƯỚC" + đoạn giới thiệu ngắn + 2 nút CTA (đỏ: "Xem toàn bộ sản phẩm", xanh lá: "Liên hệ cửa hàng"); bên phải 1 ảnh sản phẩm minh họa trong khung bo góc trắng.

**Footer:** liên kết chính sách (đổi trả / vận chuyển / bảo mật) + dòng bản quyền kèm địa chỉ cửa hàng.

## 3. Trang Giới thiệu (`gioi-thieu.html`)

- Hero giống trang chủ (đổi nội dung: "VỀ CHÚNG TÔI" / tên cửa hàng / đoạn giới thiệu dài hơn).
- Dải 4 ô số liệu nhanh (`--navy` nền, số lớn màu `--green`).
- 2 khối "feature-grid" 4 cột (desktop) / responsive co lại: "Vì sao chọn Hồng Phước" và "Cam kết của chúng tôi", mỗi ô gồm icon emoji + tiêu đề + mô tả ngắn.
- CTA band cuối trang (nền gradient navy) với 2 nút dẫn sang Sản phẩm/Liên hệ.

## 4. Trang Sản phẩm (`san-pham.html`)

- Tiêu đề trang + số lượng sản phẩm đang hiển thị (cập nhật động).
- Ô tìm kiếm dạng input đơn, đặt trên hàng filter.
- Hàng nút lọc nhóm hàng dạng pill (nút đang chọn nền `--navy`, chữ trắng).
- Grid sản phẩm responsive (`auto-fill, minmax(230px,1fr)`), mỗi card: ảnh vuông (object-fit: cover, `loading="lazy"`), tag nhóm hàng, tên (link), giá (đỏ, đậm), badge "Hết hàng" nếu `stock=0`, nút thêm giỏ hàng (disable khi hết hàng).
- Không có kết quả (lọc/tìm kiếm) → dòng chữ "Không tìm thấy sản phẩm phù hợp." thay cho grid trống.

## 5. Trang chi tiết sản phẩm (`san-pham-chi-tiet.html`)

- Layout 2 cột (desktop): ảnh lớn bên trái, thông tin bên phải; xếp dọc trên mobile (≤800px).
- Bên phải: tag nhóm hàng, tên, giá lớn, badge tồn kho (xanh lá "Còn hàng", vàng cam "Sắp hết hàng", đỏ "Hết hàng"), bộ chọn size dạng pill (S/M/L/XL/XXL), bộ chọn số lượng (nút −/+ giới hạn theo tồn kho), nút "Thêm vào giỏ hàng" (disable khi hết hàng), đoạn mô tả, ghi chú nhỏ về việc size chỉ mang tính tham khảo.

## 6. Giỏ hàng (`gio-hang.html`)

- Bảng: ảnh + tên | đơn giá | số lượng (input number, giới hạn theo tồn kho) | thành tiền | nút xóa (chữ đỏ).
- Khối tổng tiền căn phải, nổi bật, kèm nút "Tiến hành thanh toán".
- Giỏ hàng trống → thông báo + nút "Chọn sản phẩm" dẫn về trang Sản phẩm.

## 7. Thanh toán (`thanh-toan.html`)

- Layout 2 cột: form giao hàng (họ tên*, SĐT*, địa chỉ*, ghi chú) bên trái; tóm tắt đơn hàng (từng dòng sản phẩm x số lượng + tổng cộng) bên phải. 1 cột trên mobile.
- Nút "Đặt hàng" full-width, disable nếu giỏ hàng trống.

## 8. Liên hệ (`lien-he.html`)

- 3 thẻ thông tin ngang hàng: Điện thoại (giờ mở cửa), Email (thời gian phản hồi), Địa chỉ (nút "Chỉ đường trên Google Maps"). Icon trang trí đánh dấu `aria-hidden="true"`.
- Bên dưới: bản đồ Google Maps nhúng (iframe) bên trái, form gửi liên hệ nhanh (tên*, email*, nội dung*) bên phải. 1 cột trên mobile.

## 9. Chính sách (`chinh-sach.html`)

- 3 mục theo thứ tự: Đổi trả → Vận chuyển → Bảo mật thông tin, mỗi mục 1 thẻ nội dung (dùng lại style `.feature-card`).
- CTA band cuối trang dẫn sang Liên hệ.

## 10. Trang Quản trị (`admin.html`)

- Chưa đăng nhập: form đăng nhập căn giữa (email + mật khẩu), không có sidebar/menu quản trị.
- Đã đăng nhập: tiêu đề + 3 nút tab dạng pill ("Sản phẩm" / "Đơn hàng" / "Liên hệ"), nút "+ Thêm sản phẩm" chỉ hiện ở tab Sản phẩm, nút "Đăng xuất" luôn hiện.
  - **Tab Sản phẩm:** bảng (ảnh, tên, nhóm hàng, giá, tồn kho, nút Sửa/Xóa). Thêm/sửa mở modal form (tên, nhóm hàng, giá, đường dẫn ảnh, tồn kho).
  - **Tab Đơn hàng:** bảng (mã đơn, khách hàng, SĐT, địa chỉ + ghi chú, danh sách sản phẩm đã đặt, tổng tiền, dropdown đổi trạng thái, thời gian đặt).
  - **Tab Liên hệ:** bảng (tên, email, nội dung, thời gian gửi).
- Chưa cấu hình `SUPABASE_URL`/`SUPABASE_ANON_KEY` → hiện khối cảnh báo hướng dẫn cấu hình thay vì form đăng nhập.

## 11. Responsive

- Breakpoint chính: `≤860px` (chuyển menu chính thành hamburger), `≤800px` (layout 2 cột → 1 cột cho chi tiết sản phẩm/thanh toán/liên hệ).
- Không có sidebar drawer riêng cho filter (khác mô hình 2 cột sidebar+list) — bộ lọc sản phẩm nằm ngay trên grid, tự xuống dòng (`flex-wrap`) trên màn hình nhỏ.
