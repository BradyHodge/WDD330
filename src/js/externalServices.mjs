function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    // Get error details from server
    return res.text().then(text => {
      console.error('Server response:', text);
      throw new Error(`Bad Response (${res.status}): ${text}`);
    });
  }
}


export function getProductsByCategory(category = "tents") {
  return fetch(`/json/${category}.json`)
    .then(convertToJson)
    .then((data) => data);
}

export async function findProductById(id) {
  const categories = ["tents", "sleeping-bags", "backpacks", "hammocks"];
  
  for (const category of categories) {
    try {
      const products = await getProductsByCategory(category);
      const product = products.find((item) => item.Id === id);
      if (product) return product;
    } catch (error) {
      continue;
    }
  }
  
  throw new Error(`Product with ID ${id} not found`);
}


export async function checkout(orderData) {
  const url = "http://server-nodejs.cit.byui.edu:3000/checkout";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  };
  
  try {
    const response = await fetch(url, options);
    const data = await convertToJson(response);
    return data;
  } catch (error) {
    console.error("Error submitting order:", error);
    console.error("Order data sent:", orderData); // Log what was sent
    throw error;
  }
}