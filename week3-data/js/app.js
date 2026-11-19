function formatKsh(value) {
  return `KSh ${value.toLocaleString("en-KE", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

// Print every multiple of 5 from 5 to 100 using continue
for (let number = 1; number <= 100; number++) {
  if (number % 5 !== 0) {
    continue;
  }

  console.log(number);
}

// Print every multiple of 5 from 5 to 100 using a better step
for (let number = 5; number <= 100; number += 5) {
  console.log(number);
}

// Mama Mboga tomato exercise using a while loop
let tomatoes = 37;
const kilogramsPerOrder = 4;
let fullOrders = 0;

while (tomatoes >= kilogramsPerOrder) {
  tomatoes -= kilogramsPerOrder;
  fullOrders++;
}

console.log(`While loop: ${fullOrders} full orders served`);
console.log(`While loop: ${tomatoes} kg of tomatoes left`);

// Solve the same problem using Math.floor and %
const totalTomatoes = 37;

const calculatedOrders = Math.floor(totalTomatoes / kilogramsPerOrder);
const calculatedLeftover = totalTomatoes % kilogramsPerOrder;

console.log(`Math.floor and %: ${calculatedOrders} full orders served`);
console.log(`Math.floor and %: ${calculatedLeftover} kg of tomatoes left`);

// Compare the two methods
const methodsAgree =
  fullOrders === calculatedOrders && tomatoes === calculatedLeftover;

console.log(`Both methods give the same result: ${methodsAgree}`);

// Price table: half-kilo steps from 0.5 kg to 5 kg
const priceTable = document.querySelector("#price-table");
const pricePerKg = 120;
const vatRate = 0.16;

priceTable.innerHTML = `
  <thead>
    <tr>
      <th>Quantity (kg)</th>
      <th>Price before VAT</th>
      <th>Price including 16% VAT</th>
    </tr>
  </thead>
  <tbody></tbody>
`;

const tableBody = priceTable.querySelector("tbody");

for (let quantity = 0.5; quantity <= 5; quantity += 0.5) {
  const priceBeforeVat = quantity * pricePerKg;
  const priceIncludingVat = priceBeforeVat * (1 + vatRate);

  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${quantity} kg</td>
    <td>${formatKsh(priceBeforeVat)}</td>
    <td>${formatKsh(priceIncludingVat)}</td>
  `;

  tableBody.appendChild(row);
}

// Count how many times the letter "a" appears, ignoring case
const message = "Mama Mboga Fresh, Kangemi Market";
let aCount = 0;

for (let index = 0; index < message.length; index++) {
  if (message[index].toLowerCase() === "a") {
    aCount++;
  }
}

console.log(`The letter "a" appears ${aCount} times.`);

// Show the result on the page
const outputList = document.querySelector("#output");
const resultItem = document.createElement("li");

resultItem.textContent = `The letter "a" appears ${aCount} times in "${message}".`;
outputList.appendChild(resultItem);

// Stock list: add products, remove the last product, and show the stock count
const stock = ["Tomatoes", "Onions", "Sukuma"]; // state

const addForm = document.querySelector("#add-form");
const newProductInput = document.querySelector("#new-product");
const stockList = document.querySelector("#stock-list");
const stockCount = document.querySelector("#stock-count");
const removeLastButton = document.querySelector("#remove-last");

const bulkAddForm = document.querySelector("#bulk-add-form");
const newProductsInput = document.querySelector("#new-products");

function renderStock() {
  stockList.textContent = ""; // clear, then rebuild

  for (let i = 0; i < stock.length; i++) {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${stock[i]}`;
    stockList.append(li);
  }

  const word = stock.length === 1 ? "product" : "products";
  stockCount.textContent = `${stock.length} ${word} in stock`;
}

addForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = newProductInput.value.trim();
  const lowerCaseName = name.toLowerCase();

  let isDuplicate = false;

  for (let i = 0; i < stock.length; i++) {
    if (stock[i].toLowerCase() === lowerCaseName) {
      isDuplicate = true;
      break;
    }
  }

  if (name === "" || isDuplicate) {
    return;
  }

  stock.push(name);
  newProductInput.value = "";
  renderStock();
});

removeLastButton.addEventListener("click", () => {
  if (stock.length > 0) {
    stock.pop();
    renderStock();
  }
});

bulkAddForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const productsText = newProductsInput.value;
  const productNames = productsText.split(",");

  for (let i = 0; i < productNames.length; i++) {
    const name = productNames[i].trim();
    const lowerCaseName = name.toLowerCase();

    let isDuplicate = false;

    for (let j = 0; j < stock.length; j++) {
      if (stock[j].toLowerCase() === lowerCaseName) {
        isDuplicate = true;
        break;
      }
    }

    if (name !== "" && !isDuplicate) {
      stock.push(name);
    }
  }

  newProductsInput.value = "";
  renderStock();
});

renderStock();

// -----------------------------------------
// MAMA MBOGA FRESH - PRODUCT SEARCH
// -----------------------------------------

// 1. Array of product objects
const products = [
  { id: 1, name: "Tomatoes", price: 120, stockKg: 12 },
  { id: 2, name: "Onions", price: 80, stockKg: 0 },
  { id: 3, name: "Sukuma", price: 20, stockKg: 30 },
  { id: 4, name: "Spinach", price: 40, stockKg: 8 },
  { id: 5, name: "Avocados", price: 30, stockKg: 5 },
];

// 2. Get HTML elements
const searchInput = document.querySelector("#search");
const under100 = document.querySelector("#under-100");
const results = document.querySelector("#results");
const resultsCount = document.querySelector("#results-count");

// 3. Find matching products
function matchingProducts() {
  const term = searchInput.value.trim().toLowerCase();

  return products
    .filter((p) => p.name.toLowerCase().includes(term))
    .filter((p) => !under100.checked || p.price < 100)
    .sort((a, b) => a.name.localeCompare(b.name));
}

// 4. Display matching products
function renderResults() {
  const found = matchingProducts();

  // Clear previous results
  results.textContent = "";

  // Display each matching product
  found.forEach((p) => {
    const li = document.createElement("li");

    const status = p.stockKg === 0 ? " (sold out)" : "";

    li.textContent = `${p.name}: ${formatKsh(p.price)}${status}`;

    results.append(li);
  });

  // Display number of matching products
  resultsCount.textContent =
    found.length === 0
      ? "No products match"
      : `${found.length} of ${products.length} products`;
}

// 5. Listen for user actions
searchInput.addEventListener("input", renderResults);
under100.addEventListener("change", renderResults);

// 6. Display all products when page loads
renderResults();

// Today's sales report
const sales = [450, 1200, 80, 3000, 950]; // state

const saleForm = document.querySelector("#sale-form");
const saleAmount = document.querySelector("#sale-amount");
const summary = document.querySelector("#summary");
const topSales = document.querySelector("#top-sales");
const clearSalesButton = document.querySelector("#clear-sales");

function addRow(term, value) {
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");

  dt.textContent = term;
  dd.textContent = value;

  summary.append(dt, dd);
}

function renderReport() {
  const total = sales.reduce((sum, amount) => sum + amount, 0);
  const average = sales.length === 0 ? 0 : total / sales.length;
  const bigCount = sales.filter((amount) => amount >= 1000).length;

  const smallestSale = sales.length
    ? sales.reduce(
        (smallest, amount) => (amount < smallest ? amount : smallest),
        sales[0],
      )
    : null;

  const smallSalesTotal = sales
    .filter((amount) => amount < 500)
    .reduce((total, amount) => total + amount, 0);

  summary.textContent = "";

  addRow("Number of sales", sales.length);
  addRow("Total", formatKsh(total));
  addRow("Average sale", formatKsh(Math.round(average)));
  addRow("Sales of KSh 1,000 or more", bigCount);
  addRow(
    "Smallest sale",
    smallestSale === null ? "No sales yet" : formatKsh(smallestSale),
  );
  addRow("Total of sales under KSh 500", formatKsh(smallSalesTotal));

  topSales.textContent = "";

  sales
    .slice()
    .sort((a, b) => b - a)
    .slice(0, 3)
    .forEach((amount) => {
      const li = document.createElement("li");
      li.textContent = formatKsh(amount);

      topSales.append(li);
    });
}

saleForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const amount = Number(saleAmount.value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return;
  }

  sales.push(amount);
  saleAmount.value = "";

  renderReport();
});

clearSalesButton.addEventListener("click", () => {
  sales.length = 0;
  renderReport();
});

renderReport();
