const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function slugify(str) {
  return str
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function splitCsvLine(line) {
  const cols = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      cols.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  cols.push(cur);
  return cols;
}

function parseCsv(text) {
  const lines = text.trim().split("\n").filter(Boolean);
  const header = splitCsvLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);
    const row = {};
    header.forEach((key, i) => {
      if (!key) return;
      row[key] = (cols[i] || "").trim();
    });
    return row;
  });
}

async function main() {
  const csvPath = path.join(__dirname, "..", "..", "database", "products.csv");
  const rows = parseCsv(fs.readFileSync(csvPath, "utf-8"));

  const categoryNames = [...new Set(rows.map((r) => r.nhom_hang))];
  const categoryMap = {};

  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, slug: slugify(name) },
    });
    categoryMap[name] = category.id;
  }

  for (const row of rows) {
    const slug = `${slugify(row.ten_mat_hang)}-${row.id}`;
    const price = parseInt(row.gia_vnd.replace(/[^0-9]/g, ""), 10);
    const data = {
      name: row.ten_mat_hang,
      price,
      imageUrl: row.hinh_anh,
      categoryId: categoryMap[row.nhom_hang],
    };
    await prisma.product.upsert({
      where: { slug },
      update: data,
      create: { ...data, slug, stock: 100 },
    });
  }

  console.log(`Đã import ${categoryNames.length} nhóm hàng và ${rows.length} sản phẩm.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
