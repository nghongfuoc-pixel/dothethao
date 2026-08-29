# ARCHITECTURE.md — Hồng Phước

## 1. Nguyên tắc thiết kế

- Frontend tĩnh (HTML/CSS/JS thuần, **không** framework, **không** build step, **không** ES module) — mỗi trang là 1 file `.html` độc lập nhúng `<script src="js/app.js">`.
- Backend là **Supabase** (Postgres + Auth + Row Level Security), gọi thẳng qua REST API (PostgREST) bằng `fetch()` — **không dùng thư viện `supabase-js`**, để giữ đúng tinh thần "HTML/CSS/JS thuần" và tránh phụ thuộc CDN ngoài.
- Lúc phát triển (chưa có Supabase), toàn bộ site chạy với dữ liệu tĩnh xuất sẵn từ SQLite ra `frontend/data/products.json` — không cần dựng server nào ngoài 1 static file server.
- An toàn dữ liệu dựa vào **Row Level Security (RLS)** trên Postgres, không dựa vào việc giấu `anon key` (key này luôn công khai trong JS) — xem [DATABASE.md](DATABASE.md).

## 2. Hai môi trường dữ liệu song song

| | Lúc phát triển (dev) | Lúc vận hành (production) |
|---|---|---|
| Nguồn dữ liệu | SQLite (`backend-dev/prisma/dev.db`) qua Prisma | Supabase Postgres |
| Cách frontend đọc | `fetch('data/products.json')` (file tĩnh xuất từ SQLite) | `fetch()` thẳng tới REST API Supabase |
| Cách chuyển đổi | Đổi 2 hằng số `SUPABASE_URL` / `SUPABASE_ANON_KEY` trong `js/app.js` từ rỗng sang có giá trị | — |
| Ai cập nhật dữ liệu | Sửa `database/products.csv` → chạy `prisma/seed.js` → xuất lại `products.json` | Sửa trực tiếp qua `admin.html` hoặc Supabase Table Editor |

Việc chuyển từ SQLite sang Supabase **không cần sửa code** — hàm `loadProducts()` trong `js/app.js` tự kiểm tra `supabaseEnabled()` (có `SUPABASE_URL`+`SUPABASE_ANON_KEY` hay không) để quyết định lấy dữ liệu từ đâu.

## 3. Cấu trúc thư mục

```
webphuoc/
├── frontend/                      # Toàn bộ site tĩnh — deploy lên GitHub Pages
│   ├── index.html
│   ├── gioi-thieu.html
│   ├── san-pham.html
│   ├── san-pham-chi-tiet.html     # ?id=<product_id>
│   ├── gio-hang.html
│   ├── thanh-toan.html
│   ├── lien-he.html
│   ├── chinh-sach.html
│   ├── admin.html                 # quản trị — không có trong sitemap SEO
│   ├── css/styles.css
│   ├── js/app.js                  # toàn bộ logic dùng chung: cart, header/footer, gọi Supabase
│   ├── data/products.json         # dữ liệu tĩnh dự phòng khi chưa có Supabase
│   └── assets/
│       ├── logo.svg
│       └── products/spN.jpg       # ảnh sản phẩm (đã nén, resize 600×600)
├── database/
│   ├── products.csv               # nguồn dữ liệu sản phẩm gốc, chỉnh sửa tại đây
│   └── supabase_schema.sql        # schema + RLS + seed data, chạy 1 lần trong Supabase SQL Editor
├── backend-dev/                   # công cụ nội bộ, KHÔNG deploy lên web
│   └── prisma/
│       ├── schema.prisma          # định nghĩa 5 bảng (dùng chung ý tưởng cho cả SQLite & Postgres)
│       ├── seed.js                # đọc database/products.csv → ghi vào SQLite
│       └── dev.db                 # SQLite (gitignore, không đẩy lên GitHub)
└── .gitignore                     # loại trừ node_modules/, *.db, .env
```

## 4. Tầng dữ liệu (Data layer) — `js/app.js`

- `supabaseEnabled()`: true khi cả `SUPABASE_URL` và `SUPABASE_ANON_KEY` đều có giá trị.
- `sbFetch(path, options)`: hàm gọi chung tới `${SUPABASE_URL}/rest/v1/${path}`, tự gắn header `apikey` + `Authorization: Bearer <token>` (token là JWT của admin sau khi đăng nhập, hoặc `anon key` cho khách vãng lai).
- `loadProducts()`: nếu Supabase bật → `GET products?select=...,category:categories(...)`; nếu không → `fetch('data/products.json')`. Kết quả cache trong `window.__PRODUCTS__` để không gọi lại nhiều lần trong cùng 1 lượt tải trang.
- Không có tầng SQL thô ở phía client — mọi truy vấn Supabase đi qua cú pháp query string của PostgREST (`select`, `order`, `eq`, embed quan hệ dạng `category:categories(name,slug)`).

## 5. Giỏ hàng (Cart)

- Lưu hoàn toàn trong `localStorage` (`key: hp_cart`), dạng `[{ productId, qty }]`.
- **Không gắn với session hay tài khoản** — vì Hồng Phước không có đăng nhập cho khách, giỏ hàng chỉ tồn tại trên trình duyệt hiện tại của khách.
- Mọi thao tác thêm/sửa số lượng đều đối chiếu với `stock` của sản phẩm (giới hạn phía client) trước khi ghi vào `localStorage`.

## 6. Đặt hàng / Liên hệ

- `thanh-toan.html`: nếu Supabase đã cấu hình → `POST` vào bảng `orders`, rồi `POST` từng dòng vào `order_items`; ngược lại → ghi tạm vào `localStorage` (`hp_orders`) để không làm hỏng trải nghiệm demo khi chưa có backend thật.
- `lien-he.html`: tương tự, ghi vào bảng `contact_messages` hoặc `localStorage` (`hp_messages`).
- **Chưa có bước trừ tồn kho tự động phía server** khi đơn hàng được tạo — đây là hạn chế đã biết, cần bổ sung bằng Postgres function/trigger khi đưa vào vận hành thật với lưu lượng đơn hàng đáng kể.

## 7. Đăng nhập quản trị (Admin Auth)

- Dùng **Supabase Auth** (email + password) — không tự viết hệ thống tài khoản.
- `admin.html` gọi `POST /auth/v1/token?grant_type=password` để lấy `access_token`, lưu trong `sessionStorage` (`hp_admin_token`), dùng làm `Authorization: Bearer` cho các request ghi/đọc dữ liệu nhạy cảm (sản phẩm, đơn hàng, tin nhắn).
- Không có vai trò `user` — chỉ có "đã đăng nhập" (admin) hoặc "khách vãng lai" (anon). Việc phân quyền admin dựa vào **có tài khoản trong Supabase Auth hay không** (tạo thủ công qua Supabase Dashboard), không có bảng `profiles`/`role` như một hệ thống nhiều cấp quyền.

## 8. Bảo mật (Row Level Security)

| Bảng | Đọc | Ghi |
|---|---|---|
| `categories`, `products` | Công khai (ai cũng đọc, để hiển thị trên web) | Chỉ tài khoản đã đăng nhập (`auth.role() = 'authenticated'`) |
| `orders`, `order_items` | Chỉ tài khoản đã đăng nhập (admin xem đơn hàng) | Ai cũng **insert** được (khách vãng lai đặt hàng không cần đăng nhập) |
| `contact_messages` | Chỉ tài khoản đã đăng nhập | Ai cũng **insert** được |

Chi tiết đầy đủ câu lệnh `create policy` nằm trong [database/supabase_schema.sql](database/supabase_schema.sql).

## 9. Điều hướng (Navigation)

- Không có router SPA — điều hướng bằng thẻ `<a href="...">` và query string (`?id=`).
- Menu chính dùng chung ở mọi trang, render bằng JS (`renderHeader(active)` trong `app.js`) để tránh lặp HTML; có nút hamburger (`.nav-toggle`) ẩn/hiện menu dưới 860px.

## 10. Deploy

- Frontend: push nhánh `main` → GitHub Actions build/deploy thư mục `frontend/` lên GitHub Pages (workflow tại `.github/workflows/deploy.yml`).
- Schema/RLS/seed Supabase: chạy tay 1 lần qua Supabase SQL Editor bằng `database/supabase_schema.sql`, không nằm trong pipeline deploy tự động.
- `backend-dev/` chỉ chạy trên máy phát triển, không được deploy (không có phần "server" nào cần host).
