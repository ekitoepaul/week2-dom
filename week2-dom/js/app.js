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