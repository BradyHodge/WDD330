import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  
  // Display cart total
  displayCartTotal(cartItems);
  
  // Add checkout button
  addCheckoutButton();
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

function displayCartTotal(items) {
  const total = items.reduce((sum, item) => sum + item.FinalPrice, 0);
  
  // Check if total element already exists
  let totalElement = document.querySelector(".cart-total");
  
  if (!totalElement) {
    // Create total element if it doesn't exist
    totalElement = document.createElement("div");
    totalElement.className = "cart-total";
    
    const productList = document.querySelector(".product-list");
    productList.insertAdjacentElement("afterend", totalElement);
  }
  
  totalElement.innerHTML = `<p><strong>Total: $${total.toFixed(2)}</strong></p>`;
}

function addCheckoutButton() {
  // Check if button already exists
  let checkoutButton = document.querySelector(".checkout-button");
  
  if (!checkoutButton) {
    // Create checkout button
    checkoutButton = document.createElement("div");
    checkoutButton.className = "checkout-button";
    checkoutButton.innerHTML = `
      <a href="../checkout/index.html">
        <button>Proceed to Checkout</button>
      </a>
    `;
    
    const cartTotal = document.querySelector(".cart-total");
    if (cartTotal) {
      cartTotal.insertAdjacentElement("afterend", checkoutButton);
    }
  }
}

renderCartContents();