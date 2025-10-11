// /js/productList.mjs
import { getData } from "./productData.mjs";
import { renderListWithTemplate } from "./utils.mjs";

console.log("productList.mjs loaded");

//  Normaliza rutas de imágenes (evita líos con "/" vs "./")
function normalizeImagePath(url) {
  if (!url) return null;
  // si es http(s) o empieza con "/", déjala igual
  if (/^https?:\/\//i.test(url) || url.startsWith("/")) return url;
  // si es "images/..." prefijamos "./" para que funcione según la base
  if (!url.startsWith("./")) return `./${url}`;
  return url;
}

//  Detecta diferentes formatos del campo Image / Images
function resolveImage(p) {
  let img = p.Image ?? p.image ?? p.Images?.[0] ?? p.images?.[0];
  if (typeof img === "string") return img;
  if (Array.isArray(img)) return typeof img[0] === "string" ? img[0] : null;
  if (img && typeof img === "object") {
    return (
      img.src ??
      img.url ??
      img.path ??
      img.href ??
      Object.values(img).find((v) => typeof v === "string") ??
      null
    );
  }
  return null;
}

//  Genera una tarjeta de producto (HTML)
function productCardTemplate(product) {
  const id    = product.Id ?? product.id;
  const brand = product.Brand ?? product.brand ?? "";
  const name  = product.Name ?? product.name ?? "";
  const alt   = product.Alt ?? product.alt ?? name;
  const price =
    product.FinalPrice ??
    product.finalPrice ??
    product.Price ??
    product.price ??
    "";

  const rawImg = resolveImage(product);
  console.log("IMG DEBUG:", { name, imgResolved: rawImg });
  const image  = normalizeImagePath(rawImg) || "./images/placeholder.png";

  return `
    <li class="product-card">
      <a href="product_pages/index.html?product=${encodeURIComponent(id)}">
        <img src="${image}" alt="${alt}"
             onerror="this.onerror=null; console.warn('Missing image:', this.src); this.src='./images/placeholder.png';">
        ${brand ? `<h3 class="card__brand">${brand}</h3>` : ""}
        <h2 class="card__name">${name}</h2>
        ${
          price !== ""
            ? `<p class="product-card__price">$${Number(price).toFixed(2)}</p>`
            : ""
        }
      </a>
    </li>
  `;
}

// Elegímos 4 con imágenes válidas: Ajax 3P, Talus 4P, Alpine 3P/4S, Rimrock 2P
function pickFour(list) {
  const ids = ["880RR", "985RF", "985PR", "344YJ"]; // <- acá elegís tus 4
  return list.filter(p => ids.includes(p.Id)).slice(0, 4);
}

//  Función principal (único export default)
export default async function productList(category, selector) {
  console.log("productList() called with:", { category, selector });
  const parent = document.querySelector(selector);
  console.log("parent element found?", !!parent);
  if (!parent) return;

  const products = await getData(category);
  console.log("fetched products:", products?.length, products?.[0]);

  const four = pickFour(products);
  renderListWithTemplate(productCardTemplate, parent, four, "afterbegin", true);

  console.log("Rendered products:", {
    total: products.length,
    shown: four.length,
  });
}
