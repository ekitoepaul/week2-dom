// -----------------------------------------
// PESA HARAKA FEE CALCULATOR
// -----------------------------------------

// Fixed transaction limits
const MIN_WITHDRAWAL = 50;
const MAX_AMOUNT = 150000;

let errorMessage = "";

// 1. Ask for customer's full name
const nameInput = prompt("Enter your full name:");
const fullName = nameInput ? nameInput.trim() : "";

if (fullName === "") {
  errorMessage = "Transaction cancelled: A valid customer name is required.";
}

// 2. Ask for phone number
let phoneNumber = "";

if (errorMessage === "") {
  const phoneInput = prompt("Enter your phone number:");
  phoneNumber = phoneInput === null ? "" : phoneInput.replaceAll(" ", "");

  const hasValidPrefix =
    phoneNumber.startsWith("07") || phoneNumber.startsWith("01");

  const isAllDigits = /^\d+$/.test(phoneNumber);

  if (phoneNumber.length !== 10 || !hasValidPrefix || !isAllDigits) {
    errorMessage =
      "Invalid phone number. Enter 10 digits starting with 07 or 01.";
  }
}

if (errorMessage === "") {
  // Format phone number to international format
  const formattedPhone = "254" + phoneNumber.substring(1);

  // 3. Ask for transaction type
  const transactionInput = prompt(
    "Select transaction type:\n" +
      "1. Send money\n" +
      "2. Withdraw cash\n" +
      "3. Pay a business",
  );

  if (transactionInput === null || transactionInput.trim() === "") {
    errorMessage = "Transaction cancelled: Select a transaction type.";
  } else {
    const transactionChoice = Number(transactionInput);

    let transactionType = "";

    // Switch statement for transaction selection
    switch (transactionChoice) {
      case 1:
        transactionType = "Send Money";
        break;

      case 2:
        transactionType = "Withdraw Cash";
        break;

      case 3:
        transactionType = "Pay a Business";
        break;

      default:
        errorMessage = "Unknown transaction type. Select 1, 2 or 3.";
    }

    if (errorMessage === "") {
      // 4. Ask for transaction amount
      const amountInput = prompt("Enter transaction amount in KSh:");

      if (amountInput === null || amountInput.trim() === "") {
        errorMessage = "Amount is required. Transaction cancelled.";
      } else {
        const amount = Number(amountInput);

        // Calculate the fee OUTSIDE any if statement.
        // It is safe to calculate even if the amount is invalid.
        const getTransactionFee = (choice, value) => {
          if (value <= 100) {
            if (choice === 2) {
              return 11;
            }
          } else if (value <= 1000) {
            if (choice === 1) {
              return 13;
            } else if (choice === 2) {
              return 29;
            }
          } else if (value <= 5000) {
            if (choice === 1) {
              return 53;
            } else if (choice === 2) {
              return 69;
            }
          } else if (value <= 20000) {
            if (choice === 1) {
              return 87;
            } else if (choice === 2) {
              return 185;
            }
          } else if (value <= MAX_AMOUNT) {
            if (choice === 1) {
              return 108;
            } else if (choice === 2) {
              return 309;
            }
          }

          return 0;
        };

        const transactionFee = getTransactionFee(transactionChoice, amount);
        const totalAmount = amount + transactionFee;

        // First-level else-if chain: amount validation
        if (Number.isNaN(amount)) {
          errorMessage = "Invalid amount. Please enter a valid number.";
        } else if (amount <= 0) {
          errorMessage = "Invalid amount. Amount must be greater than zero.";
        } else if (amount > MAX_AMOUNT) {
          errorMessage = "Transaction refused: Maximum amount is KSh 150,000.";
        } else if (transactionChoice === 2 && amount < MIN_WITHDRAWAL) {
          errorMessage = "Transaction refused: Minimum withdrawal is KSh 50.";
        } else {
          // Second-level check: transaction type
          if (transactionChoice === 1) {
            transactionType = "Send Money";
          } else if (transactionChoice === 2) {
            transactionType = "Withdraw Cash";
          } else if (transactionChoice === 3) {
            transactionType = "Pay a Business";
          } else {
            errorMessage = "Unknown transaction type. Select 1, 2 or 3.";
          }
        }

        if (errorMessage === "") {
          // Generate random six-digit reference
          const referenceNumber = Math.floor(100000 + Math.random() * 900000);

          // Format numbers with thousands separators
          const formatMoney = (value) => value.toLocaleString("en-KE");

          // Ternary operator for free transactions
          const feeMessage =
            transactionFee === 0
              ? "FREE"
              : "KSh " + formatMoney(transactionFee);

          // Prepare receipt
          const receipt = `
========================================
          PESA HARAKA RECEIPT
========================================
Customer Name : ${fullName.toUpperCase()}
Phone Number  : ${formattedPhone}
Reference No. : ${referenceNumber}
----------------------------------------
Transaction   : ${transactionType}
----------------------------------------
${"Description".padEnd(22)}${"Amount (KSh)".padStart(12)}
${"Transaction".padEnd(22)}${formatMoney(amount).padStart(12)}
${"Transaction Fee".padEnd(22)}${feeMessage.padStart(12)}
----------------------------------------
${"TOTAL".padEnd(22)}${formatMoney(totalAmount).padStart(12)}
========================================
       Thank you for using Pesa Haraka!
========================================
`;

          // Final decision: error OR successful receipt
          if (errorMessage !== "") {
            console.log(errorMessage);
            alert(errorMessage);
          } else {
            console.log(receipt);
            alert(
              `Done. Fee: ${feeMessage}, total: KSh ${formatMoney(
                totalAmount,
              )}. See the console for your receipt.`,
            );
          }
        }
      }
    }
  }
}

// Final error display for earlier failures
if (errorMessage !== "") {
  console.log(errorMessage);
  alert(errorMessage);
}
