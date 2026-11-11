// Select page elements
const heading = document.querySelector("#shop-name");
const statusEl = document.querySelector("#status");
const productName = document.querySelector("#product-name");
const productPrice = document.querySelector("#product-price");
const productImage = document.querySelector("#product-image");
const basketEl = document.querySelector("#basket");
const totalEl = document.querySelector("#total");

// Log the selected elements
console.log("Heading:", heading);
console.log("Status paragraph:", statusEl);
console.log("Product name:", productName);
console.log("Product price:", productPrice);
console.log("Product image:", productImage);

// Calculate VAT-inclusive price
function calculateVat(price, vatRate = 0.16) {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return 0;
  }

  return numericPrice * (1 + vatRate);
}

// Format an amount as Kenyan shillings
function formatKsh(amount) {
  return `KSh ${Number(amount).toFixed(2)}`;
}

// Show a temporary message below the heading
function showMessage(text) {
  const message = document.createElement("p");
  message.className = "message";
  message.textContent = text;

  heading.after(message);

  setTimeout(() => {
    message.remove();
  }, 3000);
}

// Add one item to the basket and return its total
function addBasketLine(name, kilos, pricePerKg) {
  const lineTotal = kilos * pricePerKg;

  const listItem = document.createElement("li");
  listItem.textContent =
    `${name}, ${kilos} kg: ${formatKsh(lineTotal)}`;

  basketEl.append(listItem);

  return lineTotal;
}

// Opening hours
const OPENING_HOUR = 7;
const CLOSING_HOUR = 19;

function isOpen(hour) {
  return hour >= OPENING_HOUR && hour < CLOSING_HOUR;
}

// Update the shop name
heading.textContent = "Mama Mboga Fresh: Avocado Day";

// Read the tomato price and show it with 16% VAT
const tomatoPrice = productPrice.textContent;
const tomatoPriceWithVat = calculateVat(tomatoPrice);

// Swap the product to onions
productName.textContent = "Onions";
productPrice.textContent = "80";
productImage.src = "images/Fresh_Onion.jpg";
productImage.alt = "Fresh brown onions";

// Add basket items
let total = 0;
total += addBasketLine("Tomatoes", 3, 120);
total += addBasketLine("Onions", 2, 80);
total += addBasketLine("Sukuma", 1, 20);

totalEl.textContent = formatKsh(total);

// Set the open or closed status
const hour = new Date().getHours();

if (isOpen(hour)) {
  statusEl.textContent = "Open now";
  statusEl.classList.add("open");
  showMessage("Welcome to Mama Mboga Fresh! We are open.");
} else {
  statusEl.textContent = "Closed. We open at 7am.";
  statusEl.classList.add("closed");
  showMessage("Sorry, we are currently closed.");
}

// Log the final details
console.log("Updated product name:", productName.textContent);
console.log("Updated product price:", productPrice.textContent);
console.log("Updated image source:", productImage.src);
console.log("Basket total:", formatKsh(total));