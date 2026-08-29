# DATABASE.md — Schema Hồng Phước

Có 2 bản schema tương đương nhau, dùng cho 2 môi trường khác nhau — xem lý do ở [ARCHITECTURE.md](ARCHITECTURE.md):

- **SQLite** (dev): [backend-dev/prisma/schema.prisma](backend-dev/prisma/schema.prisma) — nguồn sự thật lúc phát triển.
- **Postgres** (production, Supabase): [database/supabase_schema.sql](database/supabase_schema.sql) — nguồn sự thật khi đã kết nối Supabase, gồm cả RLS + dữ liệu khởi tạo.

## 1. Sơ đồ quan hệ

```
categories ───< products
products   ───< order_items >─── orders
contact_messages (độc lập, không có khóa ngoại)
```

Không có bảng người dùng/tài khoản khách hàng — chỉ có tài khoản admin nằm trong `auth.users` của Supabase Auth (không phải bảng do dự án tự định nghĩa).

## 2. Bảng `categories`

| Cột | Kiểu (SQLite / Postgres) | Ghi chú |
|---|---|---|
| id | INTEGER PK AUTOINCREMENT / `serial primary key` | |
| name | TEXT UNIQUE / `text unique not null` | VD: "Áo thể thao" |
| slug | TEXT UNIQUE / `text unique not null` | VD: "ao-the-thao", dùng để lọc theo URL-safe string |

## 3. Bảng `products`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK / `serial primary key` | |
| name | TEXT NOT NULL | Tên sản phẩm |
| slug | TEXT UNIQUE NOT NULL | Sinh từ tên + id, dùng làm khóa upsert khi seed lại từ CSV |
| price | INTEGER NOT NULL | Đơn vị VNĐ, số nguyên (không có phần thập phân) |
| image_url | TEXT NOT NULL | Đường dẫn tương đối tới ảnh trong `frontend/assets/products/` |
| description | TEXT (nullable) | Mô tả chi tiết, hiện chưa có dữ liệu thật (hiển thị mô tả mặc định ở trang chi tiết nếu rỗng) |
| stock | INTEGER NOT NULL DEFAULT 0 | Tồn kho — hiện đặt mặc định 100 cho toàn bộ 25 sản phẩm |
| category_id | INTEGER NOT NULL FK → categories.id | |
| created_at | DATETIME / `timestamptz` DEFAULT now() | |

## 4. Bảng `orders`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK / `serial primary key` | |
| customer_name | TEXT NOT NULL | |
| phone | TEXT NOT NULL | |
| address | TEXT NOT NULL | |
| note | TEXT (nullable) | |
| total | INTEGER NOT NULL | Tổng tiền đơn hàng, VNĐ |
| status | TEXT NOT NULL DEFAULT 'pending' | `pending` \| `processing` \| `completed` \| `cancelled` — đổi qua tab "Đơn hàng" trong `admin.html` |
| created_at | DATETIME / `timestamptz` DEFAULT now() | |

Không có cột `user_id` — vì không có tài khoản khách hàng, mọi đơn hàng đều là khách vãng lai.

## 5. Bảng `order_items`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK / `serial primary key` | |
| order_id | INTEGER NOT NULL FK → orders.id | |
| product_id | INTEGER NOT NULL FK → products.id | |
| quantity | INTEGER NOT NULL | |
| price_at_order | INTEGER NOT NULL | Giá tại thời điểm đặt hàng (chốt giá, không đổi kể cả khi admin sửa giá sản phẩm sau đó) |

## 6. Bảng `contact_messages`

| Cột | Kiểu | Ghi chú |
|---|---|---|
| id | INTEGER PK / `serial primary key` | |
| name | TEXT NOT NULL | |
| email | TEXT NOT NULL | |
| message | TEXT NOT NULL | |
| created_at | DATETIME / `timestamptz` DEFAULT now() | |

## 7. Row Level Security (chỉ áp dụng ở Postgres/Supabase)

- `categories`, `products`: `select` công khai; `insert`/`update`/`delete` chỉ role `authenticated` (admin đã đăng nhập).
- `orders`, `order_items`, `contact_messages`: `insert` công khai (khách vãng lai đặt hàng/gửi liên hệ không cần đăng nhập); `select` chỉ role `authenticated`.

Câu lệnh đầy đủ (`enable row level security`, `create policy`) nằm trong [database/supabase_schema.sql](database/supabase_schema.sql), phần cuối file.

## 8. Khác biệt cố ý giữa 2 bản schema

| Điểm khác | SQLite (dev) | Postgres (Supabase) |
|---|---|---|
| Tên cột | camelCase (`imageUrl`, `categoryId`) — quy ước của Prisma | snake_case (`image_url`, `category_id`) — quy ước của Postgres/PostgREST |
| Auto increment | `INTEGER PRIMARY KEY AUTOINCREMENT` | `serial` / `bigint generated` |
| Ngày giờ | `DATETIME` | `timestamptz` |
| RLS | Không áp dụng (SQLite không hỗ trợ) | Bắt buộc, là lớp bảo mật chính |

Vì 2 bên khác convention đặt tên cột, hàm `loadProducts()` trong `js/app.js` tự map lại tên trường (`image_url` → `image`, `category_id` → bỏ qua, dùng `category` embed) khi đọc từ Supabase, để phần code còn lại của frontend dùng chung 1 cấu trúc object bất kể nguồn dữ liệu.
