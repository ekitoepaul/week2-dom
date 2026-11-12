
 // -----------------------------------------
 // MAMA MBOGA FRESH - SHOPPING APP
 // -----------------------------------------

// 1. Select page elements
const heading = document.querySelector("#shop-name");
const statusEl = document.querySelector("#status");
const productName = document.querySelector("#product-name");
const productPrice = document.querySelector("#product-price");
const productImage = document.querySelector("#product-image");

const minusBtn = document.querySelector("#minus-btn");
const plusBtn = document.querySelector("#plus-btn");
const qtyEl = document.querySelector("#qty");
const costEl = document.querySelector("#cost");
const addBtn = document.querySelector("#add-btn");

const basketEl = document.querySelector("#basket");
const totalEl = document.querySelector("#total");

// New elements
const clearBtn = document.querySelector("#clear-btn");
const deliveryMessage = document.querySelector("#delivery-message");

// 2. Settings
const PRICE_PER_KG = 120;
const OPENING_HOUR = 7;
const CLOSING_HOUR = 19;
const FREE_DELIVERY_THRESHOLD = 1000;

// 3. State
let quantity = 0;
let basketTotal = 0;

// 4. Helper functions

// Format amounts in Kenyan Shillings
function formatKsh(amount) {
  return `KSh ${Number(amount).toFixed(2)}`;
}

// Calculate VAT (16%)
function calculateVat(price, vatRate = 0.16) {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return 0;
  }

  return numericPrice * (1 + vatRate);
}

// Check whether the shop is open
function isOpen(hour) {
  return hour >= OPENING_HOUR && hour < CLOSING_HOUR;
}

// Display temporary messages
function showMessage(text) {
  const message = document.createElement("p");
  message.className = "message";
  message.textContent = text;

  heading.after(message);

  setTimeout(() => {
    message.remove();
  }, 3000);
}

// Add an item to the basket
function addBasketLine(name, kilos, pricePerKg) {
  const lineTotal = kilos * pricePerKg;

  const listItem = document.createElement("li");

  listItem.textContent =
    `${name}, ${kilos} kg: ${formatKsh(lineTotal)}`;

  basketEl.append(listItem);

  return lineTotal;
}

// 5. Render quantity, cost, basket total and delivery message
function render() {

  // Update quantity
  qtyEl.textContent = quantity;

  // Update selected product cost
  costEl.textContent = formatKsh(
    quantity * PRICE_PER_KG
  );

  // Enable or disable buttons
  minusBtn.disabled = quantity === 0;
  addBtn.disabled = quantity === 0;

  // Update basket total
  totalEl.textContent = formatKsh(basketTotal);

  // Calculate amount remaining for free delivery
  const remainingForDelivery =
    FREE_DELIVERY_THRESHOLD - basketTotal;

  // Ternary operator for free-delivery message
  deliveryMessage.textContent =
    basketTotal >= FREE_DELIVERY_THRESHOLD
      ? "Congratulations! You qualify for free delivery."
      : `Add ${formatKsh(remainingForDelivery)} more for free delivery.`;
}

// 6. Quantity stepper events

plusBtn.addEventListener("click", () => {
  quantity += 1;
  render();
});

minusBtn.addEventListener("click", () => {
  if (quantity > 0) {
    quantity -= 1;
  }

  render();
});

// 7. Handle Add to Basket button
function handleAddClick() {

  if (quantity === 0) {
    return;
  }

  const lineTotal = addBasketLine(
    "Tomatoes",
    quantity,
    PRICE_PER_KG
  );

  basketTotal += lineTotal;

  // Reset quantity after adding
  quantity = 0;

  render();

  showMessage("Tomatoes successfully added to basket!");
}

addBtn.addEventListener("click", handleAddClick);

// 8. Clear Basket button
function handleClearBasket() {

  // Empty the basket list
  basketEl.textContent = "";

  // Reset basket total and quantity
  basketTotal = 0;
  quantity = 0;

  // Refresh the display
  render();

  showMessage("Your basket has been cleared!");
}

clearBtn.addEventListener("click", handleClearBasket);

// 9. Keyboard events
function handleKeyDown(event) {

  console.log("Key pressed:", event.key);

  // Escape resets the selected quantity
  if (event.key === "Escape") {
    quantity = 0;
    render();

    console.log("Quantity reset to zero.");
  }
}

document.addEventListener("keydown", handleKeyDown);

// 10. Update shop details
heading.textContent = "Mama Mboga Fresh: Avocado Day";

// Update product information
productName.textContent = "Onions";
productPrice.textContent = "80";

productImage.src = "images/Fresh_Onion.jpg";
productImage.alt = "Fresh brown onions";

// Calculate product price including VAT
const tomatoPriceWithVat = calculateVat(
  productPrice.textContent
);

console.log(
  "Product price including VAT:",
  formatKsh(tomatoPriceWithVat)
);

// 11. Add initial basket items
basketTotal += addBasketLine("Tomatoes", 3, 120);
basketTotal += addBasketLine("Onions", 2, 80);
basketTotal += addBasketLine("Sukuma", 1, 20);

// 12. Check shop opening status
const hour = new Date().getHours();

if (isOpen(hour)) {

  statusEl.textContent = "Open now";
  statusEl.classList.add("open");

  showMessage(
    "Welcome to Mama Mboga Fresh! We are open."
  );

} else {

  statusEl.textContent = "Closed. We open at 7am.";
  statusEl.classList.add("closed");

  showMessage(
    "Sorry, we are currently closed."
  );
}

// 13. Initial rendering
render();

// 14. Log selected elements and final details
console.log("Heading:", heading);
console.log("Status paragraph:", statusEl);
console.log("Product name:", productName);
console.log("Product price:", productPrice);
console.log("Product image:", productImage);

console.log("Updated product name:", productName.textContent);
console.log("Updated product price:", productPrice.textContent);
console.log("Updated image source:", productImage.src);

console.log("Basket total:", formatKsh(basketTotal));
