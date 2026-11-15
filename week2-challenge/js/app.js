// -----------------------------------------
// PESA HARAKA WEB APP - TRANSACTION CALCULATOR
// -----------------------------------------

// 1. Fixed limits and DOM references (selected once).
const MIN_WITHDRAWAL = 50;
const MAX_AMOUNT = 150000;

const transactionForm = document.querySelector("#transaction-form");
const formPanel = document.querySelector("#form-panel");
const receiptPanel = document.querySelector("#receipt-panel");
const receiptDetails = document.querySelector("#receipt-details");
const feePreview = document.querySelector("#fee-preview");
const newTransactionButton = document.querySelector("#new-transaction");

const nameInput = document.querySelector("#full-name");
const phoneInput = document.querySelector("#phone-number");
const typeInput = document.querySelector("#transaction-type");
const amountInput = document.querySelector("#amount");

const fields = {
  fullName: { input: nameInput, error: document.querySelector("#name-error") },
  phoneNumber: {
    input: phoneInput,
    error: document.querySelector("#phone-error"),
  },
  transactionType: {
    input: typeInput,
    error: document.querySelector("#type-error"),
  },
  amount: {
    input: amountInput,
    error: document.querySelector("#amount-error"),
  },
};

let currentView = "form";

// 2. Pure fee function: no DOM access or page updates.
function calculateFee(type, amount) {
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
    return null;
  }

  if (!["send", "withdraw", "business"].includes(type)) {
    return null;
  }

  if (type === "withdraw" && amount < MIN_WITHDRAWAL) {
    return null;
  }

  if (type === "business") {
    return 0;
  }

  if (amount <= 100) {
    return type === "withdraw" ? 11 : 0;
  }
  if (amount <= 1000) {
    return type === "send" ? 13 : 29;
  }
  if (amount <= 5000) {
    return type === "send" ? 53 : 69;
  }
  if (amount <= 20000) {
    return type === "send" ? 87 : 185;
  }

  return type === "send" ? 108 : 309;
}

// 3. Field checkers return an empty string when valid, or an error message.
function checkName(value) {
  const name = value.trim();
  if (!name) return "Please enter your full name.";
  if (name.length < 2) return "Name must contain at least 2 characters.";
  return "";
}

function normalizePhone(value) {
  return value.replace(/\s+/g, "");
}

function checkPhone(value) {
  const phone = normalizePhone(value);
  if (!phone) return "Please enter your phone number.";
  if (!/^(07|01)\d{8}$/.test(phone)) {
    return "Enter 10 digits starting with 07 or 01.";
  }
  return "";
}

function checkAmount(value, type) {
  if (value.trim() === "") return "Please enter the transaction amount.";

  const amount = Number(value);
  if (!Number.isFinite(amount)) return "Enter a valid number.";
  if (amount <= 0) return "Amount must be greater than zero.";
  if (amount > MAX_AMOUNT) return "Maximum transaction amount is KSh 150,000.";
  if (type === "withdraw" && amount < MIN_WITHDRAWAL) {
    return "Minimum withdrawal amount is KSh 50.";
  }
  return "";
}

function checkTransactionType(value) {
  if (!value) return "Please select a transaction type.";
  if (!["send", "withdraw", "business"].includes(value)) {
    return "Please select a valid transaction type.";
  }
  return "";
}

// 4. Shared formatting helpers.
function formatMoney(value) {
  return value.toLocaleString("en-KE", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function getTransactionLabel(type) {
  const labels = {
    send: "Send money",
    withdraw: "Withdraw cash",
    business: "Pay a business",
  };
  return labels[type] || "Unknown transaction";
}

// 5. Accessible field error handling.
function showFieldError(fieldName, message) {
  const field = fields[fieldName];
  field.error.textContent = message;

  if (message) {
    field.input.setAttribute("aria-invalid", "true");
    field.input.setAttribute(
      "aria-describedby",
      getDescribedBy(fieldName, true),
    );
  } else {
    field.input.removeAttribute("aria-invalid");
    field.input.setAttribute(
      "aria-describedby",
      getDescribedBy(fieldName, false),
    );
  }
}

function getDescribedBy(fieldName, includeError) {
  const helpIds = {
    fullName: "name-help",
    phoneNumber: "phone-help",
    transactionType: "",
    amount: "amount-help",
  };
  const errorIds = {
    fullName: "name-error",
    phoneNumber: "phone-error",
    transactionType: "type-error",
    amount: "amount-error",
  };

  return [helpIds[fieldName], includeError ? errorIds[fieldName] : ""]
    .filter(Boolean)
    .join(" ");
}

function clearFieldError(fieldName) {
  showFieldError(fieldName, "");
}

function validateAllFields() {
  const errors = {
    fullName: checkName(nameInput.value),
    phoneNumber: checkPhone(phoneInput.value),
    transactionType: checkTransactionType(typeInput.value),
    amount: checkAmount(amountInput.value, typeInput.value),
  };

  Object.entries(errors).forEach(([fieldName, message]) => {
    showFieldError(fieldName, message);
  });

  const firstInvalid = Object.keys(errors).find(
    (fieldName) => errors[fieldName],
  );
  if (firstInvalid) {
    fields[firstInvalid].input.focus();
    return false;
  }

  return true;
}

// 6. Live fee preview uses the same pure fee function as the receipt.
function updateFeePreview() {
  const amountText = amountInput.value;
  const type = typeInput.value;

  if (amountText.trim() === "" || !type) {
    feePreview.textContent =
      "Enter an amount and select a transaction to preview the fee.";
    feePreview.classList.remove("fee-preview-error");
    return;
  }

  const amountError = checkAmount(amountText, type);
  if (amountError) {
    feePreview.textContent = amountError;
    feePreview.classList.add("fee-preview-error");
    return;
  }

  const fee = calculateFee(type, Number(amountText));
  if (fee === null) {
    feePreview.textContent = "The fee cannot be calculated for these details.";
    feePreview.classList.add("fee-preview-error");
    return;
  }

  feePreview.textContent =
    fee === 0 ? "Fee: FREE" : `Fee: KSh ${formatMoney(fee)}`;
  feePreview.classList.remove("fee-preview-error");
}

// 7. Create receipt safely using createElement and textContent only.
function appendReceiptRow(label, value, emphasized = false) {
  const row = document.createElement("div");
  row.className = emphasized ? "receipt-row receipt-total" : "receipt-row";

  const term = document.createElement("dt");
  term.textContent = label;

  const description = document.createElement("dd");
  description.textContent = value;

  row.append(term, description);
  receiptDetails.append(row);
}

function buildReceipt(transaction) {
  receiptDetails.replaceChildren();

  appendReceiptRow("Customer", transaction.fullName.toUpperCase());
  appendReceiptRow("Phone", transaction.formattedPhone);
  appendReceiptRow("Reference", transaction.reference);
  appendReceiptRow("Date & time", transaction.dateTime);
  appendReceiptRow("Transaction", getTransactionLabel(transaction.type));
  appendReceiptRow("Amount", `KSh ${formatMoney(transaction.amount)}`);
  appendReceiptRow(
    "Transaction fee",
    transaction.fee === 0 ? "FREE" : `KSh ${formatMoney(transaction.fee)}`,
  );
  appendReceiptRow("TOTAL", `KSh ${formatMoney(transaction.total)}`, true);
}

// 8. One function controls which panel is visible.
function renderView() {
  const showingReceipt = currentView === "receipt";
  formPanel.hidden = showingReceipt;
  receiptPanel.hidden = !showingReceipt;
  if (showingReceipt) {
    document.querySelector("#receipt-title").focus();
  } else {
    nameInput.focus();
  }
}

function createTransaction() {
  const amount = Number(amountInput.value);
  const fee = calculateFee(typeInput.value, amount);
  const phone = normalizePhone(phoneInput.value);
  const formattedPhone = `254${phone.substring(1)}`;

  return {
    fullName: nameInput.value.trim(),
    formattedPhone,
    type: typeInput.value,
    amount,
    fee,
    total: amount + fee,
    reference: String(Math.floor(100000 + Math.random() * 900000)),
    dateTime: new Date().toLocaleString("en-KE"),
  };
}

// 9. Submit event: prevent browser reload, validate all, then show receipt.
transactionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateAllFields()) {
    updateFeePreview();
    return;
  }

  const transaction = createTransaction();
  buildReceipt(transaction);
  currentView = "receipt";
  renderView();
});

// 10. Live updates and immediate clearing of corrected field errors.
nameInput.addEventListener("input", () => {
  if (nameInput.getAttribute("aria-invalid") === "true") {
    showFieldError("fullName", checkName(nameInput.value));
  }
});

phoneInput.addEventListener("input", () => {
  if (phoneInput.getAttribute("aria-invalid") === "true") {
    showFieldError("phoneNumber", checkPhone(phoneInput.value));
  }
});

amountInput.addEventListener("input", () => {
  if (amountInput.getAttribute("aria-invalid") === "true") {
    showFieldError("amount", checkAmount(amountInput.value, typeInput.value));
  }
  updateFeePreview();
});

typeInput.addEventListener("change", () => {
  if (typeInput.getAttribute("aria-invalid") === "true") {
    showFieldError("transactionType", checkTransactionType(typeInput.value));
  }
  if (amountInput.getAttribute("aria-invalid") === "true") {
    showFieldError("amount", checkAmount(amountInput.value, typeInput.value));
  }
  updateFeePreview();
});

// 11. Reset the form and return to the form view.
newTransactionButton.addEventListener("click", () => {
  transactionForm.reset();

  Object.keys(fields).forEach((fieldName) => clearFieldError(fieldName));
  feePreview.textContent =
    "Enter an amount and select a transaction to preview the fee.";
  feePreview.classList.remove("fee-preview-error");
  receiptDetails.replaceChildren();

  currentView = "form";
  renderView();
});

// 12. Fee function boundary checks. Open the browser console to see results.
console.assert(calculateFee("send", 100) === 0, "Send KSh 100 should be FREE");
console.assert(
  calculateFee("withdraw", 100) === 11,
  "Withdrawal KSh 100 should cost KSh 11",
);
console.assert(
  calculateFee("send", 101) === 13,
  "Send KSh 101 should cost KSh 13",
);
console.assert(calculateFee("send", 1000) === 13, "Send KSh 1,000 boundary");
console.assert(calculateFee("send", 1001) === 53, "Send KSh 1,001 boundary");
console.assert(
  calculateFee("withdraw", 49) === null,
  "Withdrawal below KSh 50 is not allowed",
);
console.assert(
  calculateFee("withdraw", 50) === 11,
  "Withdrawal KSh 50 is allowed",
);
console.assert(calculateFee("send", 20000) === 87, "Send KSh 20,000 boundary");
console.assert(calculateFee("send", 20001) === 108, "Send KSh 20,001 boundary");
console.assert(
  calculateFee("business", 150000) === 0,
  "Business payment at maximum is FREE",
);
console.assert(
  calculateFee("send", 150001) === null,
  "Amount above maximum is not allowed",
);
