import productList from "./productList.mjs";
import { loadHeaderFooter } from "./utils.mjs";

console.log("main.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded fired");
  loadHeaderFooter();
  productList("tents", "#product-list");
});