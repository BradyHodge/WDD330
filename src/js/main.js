import productList from "./productList.mjs";
console.log("main.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded fired");
  productList("tents", "#product-list");
});
