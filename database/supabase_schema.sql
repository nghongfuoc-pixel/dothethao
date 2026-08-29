-- Hồng Phước - Supabase schema + dữ liệu khởi tạo
-- Chạy toàn bộ file này trong Supabase SQL Editor (1 lần duy nhất khi tạo project)

create table if not exists categories (
  id serial primary key,
  name text unique not null,
  slug text unique not null
);

create table if not exists products (
  id serial primary key,
  name text not null,
  slug text unique not null,
  price integer not null,
  image_url text not null,
  description text,
  stock integer not null default 0,
  category_id integer not null references categories(id),
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id serial primary key,
  customer_name text not null,
  phone text not null,
  address text not null,
  note text,
  total integer not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id serial primary key,
  order_id integer not null references orders(id) on delete cascade,
  product_id integer not null references products(id),
  quantity integer not null,
  price_at_order integer not null
);

create table if not exists contact_messages (
  id serial primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Dữ liệu nhóm hàng
insert into categories (id, name, slug) values (1, 'Áo thể thao', 'ao-the-thao') on conflict (id) do nothing;
insert into categories (id, name, slug) values (2, 'Đồ bộ', 'do-bo') on conflict (id) do nothing;
insert into categories (id, name, slug) values (3, 'Đồ bơi', 'do-boi') on conflict (id) do nothing;
insert into categories (id, name, slug) values (4, 'Áo ba lỗ', 'ao-ba-lo') on conflict (id) do nothing;
insert into categories (id, name, slug) values (5, 'Quần thể thao', 'quan-the-thao') on conflict (id) do nothing;
select setval('categories_id_seq', (select max(id) from categories));

-- Dữ liệu sản phẩm
insert into products (id, name, slug, price, image_url, category_id) values (1, 'Áo thun nam ngắn tay lụa băng', 'ao-thun-nam-ngan-tay-lua-bang-1', 473000, 'assets/products/sp1.jpg', 1) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (2, 'Áo thun nam thể thao', 'ao-thun-nam-the-thao-2', 1182800, 'assets/products/sp2.jpg', 1) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (3, 'Áo thể thao chạy bộ nhanh khô', 'ao-the-thao-chay-bo-nhanh-kho-3', 1182800, 'assets/products/sp3.jpg', 1) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (4, 'Áo phông nhanh khô áo chạy bộ tập luyện', 'ao-phong-nhanh-kho-ao-chay-bo-tap-luyen-4', 473000, 'assets/products/sp4.jpg', 1) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (5, 'Áo phông thể thao', 'ao-phong-the-thao-5', 1237000, 'assets/products/sp5.jpg', 1) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (6, 'Bộ thể thao mùa hè mỏng', 'bo-the-thao-mua-he-mong-6', 1260000, 'assets/products/sp6.jpg', 2) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (7, 'Bộ vest nhanh khô quần áo thể thao', 'bo-vest-nhanh-kho-quan-ao-the-thao-7', 1260000, 'assets/products/sp7.jpg', 2) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (8, 'Bộ đồ thể thao nam size lớn', 'bo-do-the-thao-nam-size-lon-8', 1300000, 'assets/products/sp8.jpg', 2) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (9, 'Bộ đồ thể thao nhanh khô cảm', 'bo-do-the-thao-nhanh-kho-cam-9', 1260000, 'assets/products/sp9.jpg', 2) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (10, 'Bộ đồ thể thao nam hai mảnh áo phông cổ tròn', 'bo-do-the-thao-nam-hai-manh-ao-phong-co-tron-10', 1300000, 'assets/products/sp10.jpg', 2) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (11, 'Đồ bơi liền thân trẻ em', 'do-boi-lien-than-tre-em-11', 3309000, 'assets/products/sp11.jpg', 3) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (12, 'Quần bơi trẻ em boxer', 'quan-boi-tre-em-boxer-12', 1418000, 'assets/products/sp12.jpg', 3) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (13, 'Ván nổi thông minh Asiwo dành cho người lớn', 'van-noi-thong-minh-asiwo-danh-cho-nguoi-lon-13', 949200, 'assets/products/sp13.jpg', 3) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (14, 'Chân chèo bơi TOSWIM', 'chan-cheo-boi-toswim-14', 1403000, 'assets/products/sp14.jpg', 3) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (15, 'Kính bơi trẻ em', 'kinh-boi-tre-em-15', 1971000, 'assets/products/sp15.jpg', 3) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (16, 'Áo ba lỗ thể thao nam kiểu Mỹ', 'ao-ba-lo-the-thao-nam-kieu-my-16', 1222000, 'assets/products/sp16.jpg', 4) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (17, 'Áo vest nam mùa hè thoáng khí lụa băng', 'ao-vest-nam-mua-he-thoang-khi-lua-bang-17', 473000, 'assets/products/sp17.jpg', 4) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (18, 'Áo ba lỗ thể thao chạy bộ', 'ao-ba-lo-the-thao-chay-bo-18', 1024000, 'assets/products/sp18.jpg', 4) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (19, 'Áo gile thể thao nam mùa hè', 'ao-gile-the-thao-nam-mua-he-19', 2285000, 'assets/products/sp19.jpg', 4) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (20, 'Áo vest nam mùa hè mới', 'ao-vest-nam-mua-he-moi-20', 1221000, 'assets/products/sp20.jpg', 4) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (21, 'Quần jogger ống rộng', 'quan-jogger-ong-rong-21', 1812000, 'assets/products/sp21.jpg', 5) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (22, 'Quần chín phân thể thao điền kinh', 'quan-chin-phan-the-thao-dien-kinh-22', 1418000, 'assets/products/sp22.jpg', 5) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (23, 'Quần short thể thao mùa hè', 'quan-short-the-thao-mua-he-23', 1826000, 'assets/products/sp23.jpg', 5) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (24, 'Quần ba phần tư lụa băng siêu mỏng', 'quan-ba-phan-tu-lua-bang-sieu-mong-24', 913000, 'assets/products/sp24.jpg', 5) on conflict (id) do nothing;
insert into products (id, name, slug, price, image_url, category_id) values (25, 'Lulu Nhanh Khô Quần Chạy Bộ Huấn Luyện', 'lulu-nhanh-kho-quan-chay-bo-huan-luyen-25', 2407000, 'assets/products/sp25.jpg', 5) on conflict (id) do nothing;
select setval('products_id_seq', (select max(id) from products));

-- Bật Row Level Security
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table contact_messages enable row level security;

-- Ai cũng đọc được sản phẩm/nhóm hàng (để hiển thị trên web)
create policy "public_read_categories" on categories for select using (true);
create policy "public_read_products" on products for select using (true);

-- Chỉ tài khoản đã đăng nhập (admin) mới được thêm/sửa/xóa sản phẩm, nhóm hàng
create policy "auth_write_categories" on categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth_write_products" on products for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Ai cũng đặt hàng / gửi liên hệ được (insert), nhưng không đọc/sửa/xóa được đơn của người khác
create policy "public_insert_orders" on orders for insert with check (true);
create policy "public_insert_order_items" on order_items for insert with check (true);
create policy "public_insert_contact_messages" on contact_messages for insert with check (true);

-- Chỉ admin (đã đăng nhập) mới xem được đơn hàng và tin nhắn liên hệ
create policy "auth_read_orders" on orders for select using (auth.role() = 'authenticated');
create policy "auth_read_order_items" on order_items for select using (auth.role() = 'authenticated');
create policy "auth_read_contact_messages" on contact_messages for select using (auth.role() = 'authenticated');
