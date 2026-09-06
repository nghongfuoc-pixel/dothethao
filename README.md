# Hồng Phước

Website bán quần áo thể thao. Frontend tĩnh (HTML/CSS/JS thuần, không build step), backend là Supabase (Postgres + Auth), deploy qua GitHub Pages.

- **Demo:** https://nghongfuoc-pixel.github.io/dothethao/
- **Supabase dashboard:** https://supabase.com/dashboard/project/mbrvmqwvsbcnznjbtbac

## Tech stack

| Thành phần | Công nghệ |
|---|---|
| Giao diện | HTML5, CSS3, JavaScript thuần (không framework) |
| Cơ sở dữ liệu (dev) | SQLite qua [Prisma](https://www.prisma.io) |
| Cơ sở dữ liệu (production) | Postgres qua [Supabase](https://supabase.com), gọi bằng `fetch()` thẳng tới REST API (không dùng thư viện `supabase-js`) |
| Đăng nhập quản trị | Supabase Auth (email + password) |
| Bảo mật | Row Level Security trên Postgres |
| Hosting | GitHub Pages (deploy tự động qua GitHub Actions khi push `main`) |
| Không có | Server tự viết, tài khoản khách hàng, thanh toán thật, gửi email thật |

## Trạng thái dự án

Đã hoàn thiện giao diện đầy đủ 9 trang (trang chủ, giới thiệu, sản phẩm, chi tiết sản phẩm, giỏ hàng, thanh toán, liên hệ, chính sách, quản trị) và **đã kết nối Supabase thật lên production**: `SUPABASE_URL`/`SUPABASE_ANON_KEY` trong `frontend/js/app.js` đã được điền, schema đã chạy và đã seed dữ liệu (nhóm hàng, sản phẩm) — site đang đọc dữ liệu thật qua REST API thay vì `localStorage`. Bảng `orders`/liên hệ đã sẵn sàng nhận dữ liệu nhưng chưa có đơn hàng thật nào (chưa có khách mua). Xem [ARCHITECTURE.md](ARCHITECTURE.md) để biết chi tiết kiến trúc.

Lưu ý: schema được áp dụng thủ công qua **SQL Editor** của Supabase (chạy trực tiếp [database/supabase_schema.sql](database/supabase_schema.sql)), không qua migration CLI — vì vậy dashboard Supabase sẽ luôn hiện "No migrations". File `.sql` này là nguồn sự thật duy nhất cho schema; nếu cần tái tạo project mới, chạy lại đúng file đó. Project Supabase cũng chưa liên kết GitHub integration ("No repository connected" trên dashboard) — việc deploy code frontend do GitHub Actions/Pages xử lý riêng, không liên quan tới Supabase.

## Tài liệu

| File | Nội dung |
|---|---|
| [PRD.md](PRD.md) | Yêu cầu sản phẩm: mục tiêu, phạm vi, tính năng từng trang |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Kiến trúc kỹ thuật, cấu trúc thư mục, cách chuyển từ SQLite sang Supabase |
| [DATABASE.md](DATABASE.md) | Schema dữ liệu (SQLite & Postgres), Row Level Security |
| [ROUTES.md](ROUTES.md) | Danh sách trang, luồng điều hướng, guard truy cập |
| [UI_SPEC.md](UI_SPEC.md) | Đặc tả giao diện chi tiết từng trang, bảng màu |
| [SEED_DATA.md](SEED_DATA.md) | Dữ liệu mẫu: nhóm hàng, sản phẩm, quy trình cập nhật |
| [ACCEPTANCE.md](ACCEPTANCE.md) | Tiêu chí nghiệm thu, mục nào đã test thật / mục nào cần test sau khi có Supabase |

## Cách chạy local

Dự án tĩnh, không cần build, nhưng **bắt buộc chạy qua local server** (mở trực tiếp bằng `file://` sẽ lỗi vì `fetch('data/products.json')` bị chặn bởi CORS của trình duyệt):

```bash
cd frontend
python -m http.server 5500
```

rồi mở `http://localhost:5500`.

## Cập nhật dữ liệu sản phẩm (dev local, trước khi đẩy lên Supabase)

```bash
# 1. Sửa database/products.csv
# 2. Chạy lại seed để cập nhật SQLite
cd backend-dev
node prisma/seed.js
# 3. Xuất lại frontend/data/products.json từ SQLite (xem script trong ARCHITECTURE.md)
```

## Kết nối Supabase (đã thực hiện — giữ lại làm hướng dẫn tái tạo project mới)

1. Tạo project tại [supabase.com](https://supabase.com).
2. Vào **SQL Editor**, chạy toàn bộ nội dung [database/supabase_schema.sql](database/supabase_schema.sql).
3. Vào **Authentication → Users → Add user**, tạo 1 tài khoản admin.
4. Vào **Project Settings → API**, lấy **Project URL** và **anon public key**, điền vào `SUPABASE_URL` / `SUPABASE_ANON_KEY` trong [frontend/js/app.js](frontend/js/app.js).

Sau bước 4, toàn bộ site (sản phẩm, giỏ hàng, thanh toán, liên hệ, quản trị) tự động chuyển sang dùng dữ liệu thật từ Supabase, không cần sửa thêm code. Project hiện tại (`mbrvmqwvsbcnznjbtbac`) đã qua đủ 4 bước này.

## Deploy lên GitHub Pages

Đã có sẵn workflow tại `.github/workflows/deploy.yml` (build/deploy thư mục `frontend/`). Chỉ cần push lên nhánh `main` và bật **Settings → Pages → Source: GitHub Actions**.
