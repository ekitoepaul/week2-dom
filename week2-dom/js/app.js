function printHeader() {
  console.log('MAMA MBOGA FRESH');
  console.log('Kangemi Market, Stall 14');
  console.log('-'.repeat(24));
}

// Function to print the footer
function printFooter() {
    console.log("------------------------------");
    console.log("Thank you for using our program!");
    console.log("Developed by Pesa Haraka");
    console.log("------------------------------");
}

// Call the function
printHeader();
printFooter();

// Function to print a receipt line
function printLine(item, amount) {
    console.log(item + " ................ KSh " + amount);
}

// Print three receipt lines
printLine("Transaction Fee", 50);
printLine("Withdrawal Fee", 30);
printLine("Service Charge", 20);

// Function to print the total amount
function printTotal(label, amount) {
    console.log(label + ": KSh " + amount.toFixed(2));
}

// Call the function
printTotal("Total Amount", 1500);

//functio to calculate VAT
function calculateVAT(amount) {
    const vatrate = 0.16;
    const vat = amount * vatrate;
    return vat;
}

// Test the function
console.log("VAT: KSh " + calculateVAT(1000).toFixed(2));

//function to validate the phone number
function isValidPhone(phone) {
    const cleanPhone = phone.replace(/\s+/g, "");

    const phonePattern = /^(?:07|01)\d{8}$|^(?:\+254|254)[17]\d{8}$/;

    return phonePattern.test(cleanPhone);
}
// Test the function
console.log(isValidPhone("0717544278"));
console.log(isValidPhone("254790151004"));
console.log(isValidPhone("12345"));

