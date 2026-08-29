# SEED_DATA.md — Dữ liệu mẫu — Hồng Phước

Dữ liệu khởi tạo nằm trong [database/products.csv](database/products.csv) (nguồn chỉnh sửa) và được nạp vào SQLite qua `backend-dev/prisma/seed.js`, hoặc nạp thẳng vào Supabase qua [database/supabase_schema.sql](database/supabase_schema.sql).

## 1. Nhóm hàng (`categories`) — 5 nhóm

| id | name | slug |
|---|---|---|
| 1 | Áo thể thao | ao-the-thao |
| 2 | Đồ bộ | do-bo |
| 3 | Đồ bơi | do-boi |
| 4 | Áo ba lỗ | ao-ba-lo |
| 5 | Quần thể thao | quan-the-thao |

## 2. Sản phẩm (`products`) — 25 sản phẩm

Danh sách đầy đủ (tên, giá, ảnh) nằm trong [database/products.csv](database/products.csv) — đây là **nguồn chỉnh sửa duy nhất**, không sửa trực tiếp trong SQLite/Supabase khi muốn cập nhật hàng loạt. Tóm tắt theo nhóm:

| Nhóm hàng | Số sản phẩm | Khoảng giá (VNĐ) |
|---|---|---|
| Áo thể thao | 5 | 473.000 – 1.237.000 |
| Đồ bộ | 5 | 1.260.000 – 1.300.000 |
| Đồ bơi | 5 | 949.200 – 3.309.000 |
| Áo ba lỗ | 5 | 473.000 – 2.285.000 |
| Quần thể thao | 5 | 913.000 – 2.407.000 |

Mỗi sản phẩm hiện có `stock = 100` (mặc định khi seed lần đầu), `description` để trống (trang chi tiết tự hiện mô tả mặc định khi rỗng).

Ảnh sản phẩm: `frontend/assets/products/sp1.jpg` … `sp25.jpg` (đã resize 600×600, nén JPEG quality 80).

## 3. Tài khoản quản trị

**Không có tài khoản demo dựng sẵn trong seed** — vì Supabase Auth quản lý danh tính riêng (không phải bảng do dự án tự định nghĩa), tài khoản admin phải được **tạo thủ công** sau khi tạo project Supabase:

1. Supabase Dashboard → **Authentication → Users → Add user**.
2. Nhập email + mật khẩu bất kỳ cho admin.
3. Đăng nhập bằng tài khoản này tại `admin.html` — không cần bước "nâng quyền" nào thêm, vì mọi tài khoản trong `auth.users` đều được xem là admin hợp lệ (dự án không có bảng `role` phân cấp).

## 4. Đơn hàng / tin nhắn liên hệ mẫu

**Không seed sẵn** — bảng `orders`, `order_items`, `contact_messages` khởi tạo rỗng. Dữ liệu chỉ xuất hiện khi có khách đặt hàng/gửi liên hệ thật qua `thanh-toan.html` / `lien-he.html` sau khi đã kết nối Supabase.

## 5. Quy trình cập nhật dữ liệu sản phẩm

```
Sửa database/products.csv
        │
        ▼
node backend-dev/prisma/seed.js     (cập nhật SQLite dùng cho dev)
        │
        ▼
Xuất lại frontend/data/products.json (script export thủ công, xem ARCHITECTURE.md)
```

Khi đã kết nối Supabase cho production, việc thêm/sửa/xóa sản phẩm nên thực hiện qua **`admin.html`** hoặc Supabase Table Editor thay vì lặp lại quy trình CSV → SQLite ở trên (quy trình CSV chỉ dùng cho lần khởi tạo dữ liệu đầu tiên).
