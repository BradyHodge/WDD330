// src/js/product.js
import { getParam } from "./utils.mjs";
import productDetails from "./productDetails.mjs";

const productId = getParam("product");
console.log("Producto solicitado:", productId);

if (productId) {
  productDetails(productId);
}
