// src/js/productDetails.mjs
import { findProductById } from "./productData.mjs";

let currentProduct = null;

// --- Render del detalle en el HTML ---
function renderProductDetails() {
  if (!currentProduct) return;

  // 1) Títulos / nombres
  const name = currentProduct.Name || currentProduct.name || "";
  const brand = currentProduct.Brand || currentProduct.brand || "";
  const nameWithoutBrand =
    currentProduct.NameWithoutBrand ||
    currentProduct.productNameWithoutBrand ||
    name.replace(new RegExp(brand, "i"), "").trim();

  document.getElementById("productName").textContent = name;
  document.getElementById("productNameWithoutBrand").textContent = nameWithoutBrand;

  // 2) Imagen
  const imgEl = document.getElementById("productImage");
  const imgSrc =
    currentProduct.Image ||
    currentProduct.ImagePrimary ||
    currentProduct.image ||
    currentProduct.Images?.[0] ||
    "";
  imgEl.src = imgSrc;
  imgEl.alt = name;

  // 3) Precio
  const priceEl = document.getElementById("productFinalPrice");
  const price =
    currentProduct.FinalPrice ??
    currentProduct.finalPrice ??
    currentProduct.Price ??
    currentProduct.price ??
    0;
  // Muestra como $199.99
  priceEl.textContent =
    typeof price === "number" ? `$${price.toFixed(2)}` : String(price);

  // 4) Color
  const colorEl = document.getElementById("productColorName");
  const color =
    currentProduct.Colors?.[0]?.ColorName ||
    currentProduct.ColorName ||
    currentProduct.color ||
    "";
  colorEl.textContent = color;

  // 5) Descripción
  const descEl = document.getElementById("productDescriptionHtmlSimple");
  descEl.textContent =
    currentProduct.DescriptionHtmlSimple ||
    currentProduct.description ||
    "";

  // 6) Botón Add to Cart
  const btn = document.getElementById("addToCart");
  btn.dataset.id = currentProduct.Id || currentProduct.id || "";
}

// --- Add to Cart (versión mínima funcional con localStorage) ---
function addToCart(e) {
  const id = e?.currentTarget?.dataset?.id;
  if (!id || !currentProduct) return;

  const key = "so-cart";
  const cart = JSON.parse(localStorage.getItem(key)) || [];
  cart.push(currentProduct);
  localStorage.setItem(key, JSON.stringify(cart));

  // (Opcional) feedback rápido:
  // alert("Added to cart!");
}

// --- Punto de entrada del módulo ---
export default async function productDetails(productId) {
  // 1) Buscar datos del producto por ID
  currentProduct = await findProductById(productId);

  // 2) Render en el DOM
  renderProductDetails();

  // 3) Listener del botón
  const btn = document.getElementById("addToCart");
  if (btn) btn.addEventListener("click", addToCart);
}
