import { getLocalStorage, setLocalStorage } from "./utils.mjs";

// Helper function to convert form data to JSON
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

// Helper function to package items for checkout
function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: 1,
  }));
}

const checkoutProcess = {
  key: "",
  outputSelector: "",
  list: [],
  itemTotal: 0,
  shipping: 0,
  tax: 0,
  orderTotal: 0,

  init: function (key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = getLocalStorage(key) || [];
    this.calculateItemSummary();
  },

  calculateItemSummary: function () {
    // Calculate the total amount of items in the cart
    const summaryElement = document.querySelector(this.outputSelector);
    if (!summaryElement) return;

    // Calculate item total
    this.itemTotal = this.list.reduce((total, item) => {
      return total + (item.FinalPrice || 0);
    }, 0);

    // Display the item total
    const cartTotalElement = document.querySelector("#cart-total");
    if (cartTotalElement) {
      cartTotalElement.textContent = `$${this.itemTotal.toFixed(2)}`;
    }

    // Display number of items
    const itemCount = this.list.length;
    console.log(`Cart contains ${itemCount} item(s)`);
  },

  calculateOrderTotal: function () {
    // Calculate shipping: $10 for first item + $2 for each additional
    const itemCount = this.list.length;
    if (itemCount > 0) {
      this.shipping = 10 + (itemCount - 1) * 2;
    } else {
      this.shipping = 0;
    }

    // Calculate tax: 6% of item total
    this.tax = this.itemTotal * 0.06;

    // Calculate order total
    this.orderTotal = this.itemTotal + this.shipping + this.tax;

    // Display the totals
    this.displayOrderTotals();
  },

 displayOrderTotals: function () {
  // Display shipping
  const shippingElement = document.querySelector("#shipping-estimate");
  if (shippingElement) {
    shippingElement.textContent = `$${this.shipping.toFixed(2)}`;
  }
  
  // Display tax
  const taxElement = document.querySelector("#tax-estimate");
  if (taxElement) {
    taxElement.textContent = `$${this.tax.toFixed(2)}`;
  }
  
  // Display order total
  const orderTotalElement = document.querySelector("#order-total");
  if (orderTotalElement) {
    orderTotalElement.textContent = `$${this.orderTotal.toFixed(2)}`;
  }
},

async checkout(form) {
  // Get form data
  const formData = formDataToJSON(form);
  
  // Build the order object
  const orderData = {
    orderDate: new Date().toISOString(),
    fname: formData.fname,
    lname: formData.lname,
    street: formData.street,
    city: formData.city,
    state: formData.state,
    zip: formData.zip,
    cardNumber: formData.cardNumber,
    expiration: formData.expiration,
    code: formData.code,
    items: packageItems(this.list),
    orderTotal: parseFloat(this.orderTotal.toFixed(2)), 
    shipping: this.shipping, 
    tax: parseFloat(this.tax.toFixed(2)), 
  };
  
  console.log("Order data:", orderData);


    try {
      // Import the checkout function from externalServices
      const { checkout } = await import("./externalServices.mjs");
      
      // Submit the order
      const response = await checkout(orderData);
      console.log("Order response:", response);
      
      // Clear the cart after successful order
      setLocalStorage(this.key, []);
      
      return response;
    } catch (error) {
      console.error("Checkout error:", error);
      throw error;
    }
  },
};

export default checkoutProcess;