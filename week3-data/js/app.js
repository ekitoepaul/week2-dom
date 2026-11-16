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
