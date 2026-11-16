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