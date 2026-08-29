const STORE = {
  name: "Hồng Phước",
  tagline: "Quần áo thể thao",
  logo: "assets/logo.svg",
  phone: "0983 523 925",
  phoneRaw: "0983523925",
  hours: "8:00 – 21:00 hằng ngày",
  email: "nghongfuoc@gmail.com",
  address: "1/31B Trường Chinh, Phường Đông Hưng Thuận, Thành phố Hồ Chí Minh",
  mapsQuery: "1/31B Trường Chinh, Phường Đông Hưng Thuận, Thành phố Hồ Chí Minh",
};

// Điền 2 giá trị này khi đã tạo project Supabase (Project Settings > API).
// Để trống thì toàn bộ site vẫn chạy bình thường với dữ liệu tĩnh data/products.json.
const SUPABASE_URL = "https://mbrvmqwvsbcnznjbtbac.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_TZ2ChpTUQm1K-Z2rYc81Vw_UEquUAMg";

function supabaseEnabled() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

// Điền Measurement ID (dạng G-XXXXXXX) khi đã tạo Google Analytics 4. Để trống thì bỏ qua, không load gì cả.
const GA_MEASUREMENT_ID = "";

function initAnalytics() {
  if (!GA_MEASUREMENT_ID) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);
}

async function sbFetch(path, options = {}) {
  const token = sessionStorage.getItem("hp_admin_token") || SUPABASE_ANON_KEY;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `Lỗi Supabase (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

const CART_KEY = "hp_cart";

function formatVND(n) {
  return n.toLocaleString("vi-VN") + " ₫";
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCartCount();
}

function addToCart(productId, qty = 1, maxStock = null) {
  const cart = getCart();
  const line = cart.find((l) => l.productId === productId);
  const currentQty = line ? line.qty : 0;
  let nextQty = currentQty + qty;

  if (maxStock != null) {
    if (maxStock <= 0) {
      showToast("Sản phẩm đã hết hàng");
      return;
    }
    if (nextQty > maxStock) {
      nextQty = maxStock;
      showToast(`Chỉ còn ${maxStock} sản phẩm trong kho, đã thêm tối đa có thể`);
    } else {
      showToast("Đã thêm vào giỏ hàng");
    }
  } else {
    showToast("Đã thêm vào giỏ hàng");
  }

  if (line) line.qty = nextQty;
  else cart.push({ productId, qty: nextQty });
  saveCart(cart);
}

function updateCartQty(productId, qty, maxStock = null) {
  const cart = getCart();
  const line = cart.find((l) => l.productId === productId);
  if (!line) return;
  let value = Math.max(1, qty);
  if (maxStock != null && value > maxStock) {
    value = maxStock;
    showToast(`Chỉ còn ${maxStock} sản phẩm trong kho`);
  }
  line.qty = value;
  saveCart(cart);
}

function removeFromCart(productId) {
  saveCart(getCart().filter((l) => l.productId !== productId));
}

function cartCount() {
  return getCart().reduce((sum, l) => sum + l.qty, 0);
}

function renderCartCount() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = cartCount();
  });
}

function showToast(msg) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2000);
}

async function loadProducts() {
  if (window.__PRODUCTS__) return window.__PRODUCTS__;

  if (supabaseEnabled()) {
    const rows = await sbFetch("products?select=id,name,slug,price,image_url,stock,description,category:categories(name,slug)&order=id.asc");
    window.__PRODUCTS__ = rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      price: r.price,
      image: r.image_url,
      stock: r.stock,
      description: r.description,
      category: r.category.name,
      categorySlug: r.category.slug,
    }));
    return window.__PRODUCTS__;
  }

  const res = await fetch("data/products.json");
  window.__PRODUCTS__ = await res.json();
  return window.__PRODUCTS__;
}

function renderHeader(active) {
  const links = [
    { href: "index.html", label: "Trang chủ" },
    { href: "gioi-thieu.html", label: "Giới thiệu" },
    { href: "san-pham.html", label: "Sản phẩm" },
    { href: "gio-hang.html", label: "Giỏ hàng", cart: true },
    { href: "thanh-toan.html", label: "Thanh toán" },
    { href: "lien-he.html", label: "Liên hệ" },
    { href: "admin.html", label: "Quản trị" },
  ];
  const navHtml = links
    .map(
      (l) => `<a href="${l.href}" class="${l.href === active ? "active" : ""}">${l.label}${
        l.cart ? ' <span class="cart-count" data-cart-count>0</span>' : ""
      }</a>`
    )
    .join("");

  document.getElementById("header").innerHTML = `
    <header class="site-header">
      <a href="index.html" class="brand">
        <img src="${STORE.logo}" alt="Logo ${STORE.name}">
        <div class="brand-text">
          <div class="name">${STORE.name.toUpperCase()}</div>
          <div class="tagline">${STORE.tagline.toUpperCase()}</div>
        </div>
      </a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Mở menu">☰</button>
      <nav class="main-nav" id="main-nav">${navHtml}</nav>
    </header>
  `;
  renderCartCount();

  document.getElementById("nav-toggle").addEventListener("click", () => {
    document.getElementById("main-nav").classList.toggle("open");
  });
}

function renderFooter() {
  const el = document.getElementById("footer");
  if (!el) return;
  el.innerHTML = `
    <footer class="site-footer">
      <div><a href="chinh-sach.html">Chính sách đổi trả</a> · <a href="chinh-sach.html#van-chuyen">Vận chuyển</a> · <a href="chinh-sach.html#bao-mat">Bảo mật thông tin</a></div>
      <div style="margin-top:6px;">© ${new Date().getFullYear()} Cửa hàng ${STORE.name} — ${STORE.address}</div>
    </footer>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderCartCount();
  initAnalytics();
});
