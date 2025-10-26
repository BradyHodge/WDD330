import productList from "./productList.mjs";
console.log("main.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded fired");
  productList("tents", "#product-list");
});

import { loadHeaderFooter } from './utils.mjs';


window.addEventListener('DOMContentLoaded', () => {
loadHeaderFooter();
});