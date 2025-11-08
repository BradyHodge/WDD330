// src/js/product.js
import { getParam, loadHeaderFooter } from "./utils.mjs";
import productDetails from "./productDetails.mjs";

const productId = getParam("product");
console.log("Producto solicitado:", productId);

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();
  if (productId) {
    productDetails(productId);
  }
});