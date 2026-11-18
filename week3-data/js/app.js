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

// Product search and price filter
const names = [
  "Tomatoes",
  "Onions",
  "Sukuma",
  "Spinach",
  "Avocados",
  "Cabbage",
];

const costs = [120, 80, 20, 40, 30, 0];

const searchInput = document.querySelector("#search");
const under100 = document.querySelector("#under-100");
const results = document.querySelector("#results");
const resultsCount = document.querySelector("#results-count");
const under50Message = document.querySelector("#under-50-message");
const findButton = document.querySelector("#find-button");

function matchingIndexes() {
  const term = searchInput.value.trim().toLowerCase();
  return names
    .map((name, i) => i) // [0, 1, 2, 3, 4]
    .filter((i) => names[i].toLowerCase().includes(term))
    .filter((i) => !under100.checked || costs[i] < 100);
}

function updateUnder50Message() {
  const hasProductUnder50 = costs.some((cost) => cost < 50);

  if (hasProductUnder50) {
    under50Message.textContent = "Some products are under KSh 50";
  } else {
    under50Message.textContent = "No products under KSh 50";
  }
}

function renderResults() {
  const foundIndexes = matchingIndexes();

  results.textContent = "";

  for (let i = 0; i < foundIndexes.length; i++) {
    const index = foundIndexes[i];
    const cost = costs[index];

    let productText = `${names[index]}: ${formatKsh(cost)}`;

    if (cost === 0) {
      productText += " — Sold out";
    }

    const listItem = document.createElement("li");
    listItem.textContent = productText;

    results.append(listItem);
  }

  if (foundIndexes.length === 0) {
    resultsCount.textContent = "No products match";
  } else {
    resultsCount.textContent = `${foundIndexes.length} of ${names.length} products`;
  }

  updateUnder50Message();
}
function findFirstProduct() {
  const letter = searchInput.value.trim().toLowerCase();

  const firstMatch = names.find((name) => {
    return name.toLowerCase().startsWith(letter);
  });

  if (firstMatch) {
    resultsCount.textContent = `First product found: ${firstMatch}`;
  } else {
    resultsCount.textContent = "Not found";
  }
}

findButton.addEventListener("click", findFirstProduct);
searchInput.addEventListener("input", renderResults);
under100.addEventListener("change", renderResults);

renderResults();
