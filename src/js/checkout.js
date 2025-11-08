import { loadHeaderFooter } from "./utils.mjs";
import checkoutProcess from "./checkoutProcess.mjs";

document.addEventListener("DOMContentLoaded", () => {
  loadHeaderFooter();
  
  // Initialize checkout process
  checkoutProcess.init("so-cart", "#order-summary");
  
  // Listen for zip code input to calculate shipping and tax
  const zipInput = document.querySelector("#zip");
  if (zipInput) {
    zipInput.addEventListener("blur", () => {
      checkoutProcess.calculateOrderTotal();
    });
  }
  
  // Handle form submission
  const checkoutForm = document.querySelector("#checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      try {
        // Show loading state
        const submitButton = document.querySelector("#checkout-button");
        const originalText = submitButton.textContent;
        submitButton.textContent = "Processing...";
        submitButton.disabled = true;
        
        // Submit the order
        const response = await checkoutProcess.checkout(checkoutForm);
        
        // Handle successful order
        alert("Order submitted successfully! Order ID: " + (response.orderId || "N/A"));
        
        // Redirect to home page
        window.location.href = "/index.html";
      } catch (error) {
        // Handle error
        alert("There was an error processing your order. Please try again.");
        console.error("Checkout error:", error);
        
        // Reset button
        const submitButton = document.querySelector("#checkout-button");
        submitButton.textContent = "Complete Purchase";
        submitButton.disabled = false;
      }
    });
  }
});