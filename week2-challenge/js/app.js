"use strict";

// -----------------------------------------
// PESA HARAKA WEB APP - TRANSACTION CALCULATOR
// -----------------------------------------

const MIN_WITHDRAWAL = 50;
const MAX_AMOUNT = 150000;

const transactionForm = document.querySelector("#transaction-form");
const formPanel = document.querySelector("#form-panel");
const receiptPanel = document.querySelector("#receipt-panel");
const receiptDetails = document.querySelector("#receipt-details");
const feePreview = document.querySelector("#fee-preview");
const newTransactionButton = document.querySelector("#new-transaction");
const receiptTitle = document.querySelector("#receipt-title");

const nameInput = document.querySelector("#full-name");
const phoneInput = document.querySelector("#phone-number");
const typeInput = document.querySelector("#transaction-type");
const amountInput = document.querySelector("#amount");

const fields = {
  fullName: {
    input: nameInput,
    error: document.querySelector("#name-error"),
    helpId: "name-help",
    errorId: "name-error",
  },
  phoneNumber: {
    input: phoneInput,
    error: document.querySelector("#phone-error"),
    helpId: "phone-help",
    errorId: "phone-error",
  },
  transactionType: {
    input: typeInput,
    error: document.querySelector("#type-error"),
    helpId: "",
    errorId: "type-error",
  },
  amount: {
    input: amountInput,
    error: document.querySelector("#amount-error"),
    helpId: "amount-help",
    errorId: "amount-error",
  },
};

let currentView = "form";

// -----------------------------------------
// Pure fee function
// -----------------------------------------

function calculateFee(type, amount) {
  if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
    return null;
  }

  if (type !== "send" && type !== "withdraw" && type !== "business") {
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

// -----------------------------------------
// Checker functions
// -----------------------------------------

function checkName(value) {
  const name = value.trim();

  if (name === "") {
    return "Please enter your full name.";
  }

  if (name.length < 2) {
    return "Name must contain at least 2 characters.";
  }

  return "";
}

function normalizePhone(value) {
  return value.replace(/\s+/g, "");
}

function checkPhone(value) {
  const phone = normalizePhone(value);

  if (phone === "") {
    return "Please enter your phone number.";
  }

  if (!/^(07|01)\d{8}$/.test(phone)) {
    return "Enter 10 digits starting with 07 or 01.";
  }

  return "";
}

function checkAmount(value, type) {
  if (value.trim() === "") {
    return "Please enter the transaction amount.";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "Enter a valid number.";
  }

  if (amount <= 0) {
    return "Amount must be greater than zero.";
  }

  if (amount > MAX_AMOUNT) {
    return "Maximum transaction amount is KSh 150,000.";
  }

  if (type === "withdraw" && amount < MIN_WITHDRAWAL) {
    return "Minimum withdrawal amount is KSh 50.";
  }

  return "";
}

function checkTransactionType(value) {
  if (value === "") {
    return "Please select a transaction type.";
  }

  if (value !== "send" && value !== "withdraw" && value !== "business") {
    return "Please select a valid transaction type.";
  }

  return "";
}

// -----------------------------------------
// Formatting helpers
// -----------------------------------------

function formatKsh(value) {
  return `KSh ${value.toLocaleString("en-KE", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

function getTransactionLabel(type) {
  if (type === "send") {
    return "Send money";
  }

  if (type === "withdraw") {
    return "Withdraw cash";
  }

  if (type === "business") {
    return "Pay a business";
  }

  return "Unknown transaction";
}

// -----------------------------------------
// Accessible error handling
// -----------------------------------------

function getDescribedBy(fieldName, hasError) {
  const field = fields[fieldName];
  const describedByValues = [];

  if (field.helpId !== "") {
    describedByValues.push(field.helpId);
  }

  if (hasError) {
    describedByValues.push(field.errorId);
  }

  return describedByValues.join(" ");
}

function showFieldError(fieldName, message) {
  const field = fields[fieldName];

  field.error.textContent = message;

  if (message !== "") {
    field.input.setAttribute("aria-invalid", "true");
    field.input.setAttribute(
      "aria-describedby",
      getDescribedBy(fieldName, true),
    );
  } else {
    field.input.removeAttribute("aria-invalid");

    if (field.helpId !== "") {
      field.input.setAttribute(
        "aria-describedby",
        getDescribedBy(fieldName, false),
      );
    } else {
      field.input.removeAttribute("aria-describedby");
    }
  }
}

function clearFieldError(fieldName) {
  showFieldError(fieldName, "");
}

function clearAllErrors() {
  clearFieldError("fullName");
  clearFieldError("phoneNumber");
  clearFieldError("transactionType");
  clearFieldError("amount");
}

// -----------------------------------------
// Validation
// -----------------------------------------

function validateAllFields() {
  const nameError = checkName(nameInput.value);
  const phoneError = checkPhone(phoneInput.value);
  const typeError = checkTransactionType(typeInput.value);
  const amountError = checkAmount(amountInput.value, typeInput.value);

  showFieldError("fullName", nameError);
  showFieldError("phoneNumber", phoneError);
  showFieldError("transactionType", typeError);
  showFieldError("amount", amountError);

  if (nameError !== "") {
    nameInput.focus();
    return false;
  }

  if (phoneError !== "") {
    phoneInput.focus();
    return false;
  }

  if (typeError !== "") {
    typeInput.focus();
    return false;
  }

  if (amountError !== "") {
    amountInput.focus();
    return false;
  }

  return true;
}

// -----------------------------------------
// Live fee preview
// -----------------------------------------

function updateFeePreview() {
  const amountText = amountInput.value;
  const type = typeInput.value;

  if (amountText.trim() === "" || type === "") {
    feePreview.textContent =
      "Enter an amount and select a transaction to preview the fee.";
    feePreview.classList.remove("fee-preview-error");
    return;
  }

  const amountError = checkAmount(amountText, type);

  if (amountError !== "") {
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

  if (fee === 0) {
    feePreview.textContent = "Fee: FREE";
  } else {
    feePreview.textContent = "Fee: KSh " + formatMoney(fee);
  }

  feePreview.classList.remove("fee-preview-error");
}

// -----------------------------------------
// Receipt creation
// -----------------------------------------

function appendReceiptRow(label, value, isTotal) {
  const row = document.createElement("div");

  if (isTotal === true) {
    row.className = "receipt-row receipt-total";
  } else {
    row.className = "receipt-row";
  }

  const term = document.createElement("dt");
  term.textContent = label;

  const description = document.createElement("dd");
  description.textContent = value;

  row.append(term, description);
  receiptDetails.append(row);
}

function buildReceipt(transaction) {
  receiptDetails.replaceChildren();

  appendReceiptRow("Customer", transaction.fullName.toUpperCase(), false);
  appendReceiptRow("Phone", transaction.formattedPhone, false);
  appendReceiptRow("Reference", transaction.reference, false);
  appendReceiptRow("Date & time", transaction.dateTime, false);
  appendReceiptRow("Transaction", getTransactionLabel(transaction.type), false);
  appendReceiptRow("Amount", "KSh " + formatMoney(transaction.amount), false);

  if (transaction.fee === 0) {
    appendReceiptRow("Transaction fee", "FREE", false);
  } else {
    appendReceiptRow(
      "Transaction fee",
      "KSh " + formatMoney(transaction.fee),
      false,
    );
  }

  appendReceiptRow("TOTAL", "KSh " + formatMoney(transaction.total), true);
}

// -----------------------------------------
// State and rendering
// -----------------------------------------

function renderView() {
  const showingReceipt = currentView === "receipt";

  formPanel.hidden = showingReceipt;
  receiptPanel.hidden = !showingReceipt;

  if (showingReceipt) {
    receiptTitle.focus();
  } else {
    nameInput.focus();
  }
}

function createTransaction() {
  const amount = Number(amountInput.value);
  const fee = calculateFee(typeInput.value, amount);
  const phone = normalizePhone(phoneInput.value);
  const formattedPhone = "254" + phone.substring(1);

  return {
    fullName: nameInput.value.trim(),
    formattedPhone: formattedPhone,
    type: typeInput.value,
    amount: amount,
    fee: fee,
    total: amount + fee,
    reference: String(Math.floor(100000 + Math.random() * 900000)),
    dateTime: new Date().toLocaleString("en-KE"),
  };
}

// -----------------------------------------
// Events and callbacks
// -----------------------------------------

const handleFormSubmit = (event) => {
  event.preventDefault();

  if (!validateAllFields()) {
    updateFeePreview();
    return;
  }

  const transaction = createTransaction();
  buildReceipt(transaction);

  currentView = "receipt";
  renderView();
};

const handleNameInput = () => {
  if (nameInput.getAttribute("aria-invalid") === "true") {
    showFieldError("fullName", checkName(nameInput.value));
  }
};

const handlePhoneInput = () => {
  if (phoneInput.getAttribute("aria-invalid") === "true") {
    showFieldError("phoneNumber", checkPhone(phoneInput.value));
  }
};

const handleAmountInput = () => {
  if (amountInput.getAttribute("aria-invalid") === "true") {
    showFieldError("amount", checkAmount(amountInput.value, typeInput.value));
  }

  updateFeePreview();
};

const handleTypeChange = () => {
  if (typeInput.getAttribute("aria-invalid") === "true") {
    showFieldError("transactionType", checkTransactionType(typeInput.value));
  }

  if (amountInput.getAttribute("aria-invalid") === "true") {
    showFieldError("amount", checkAmount(amountInput.value, typeInput.value));
  }

  updateFeePreview();
};

const handleNewTransaction = () => {
  transactionForm.reset();

  clearAllErrors();

  feePreview.textContent =
    "Enter an amount and select a transaction to preview the fee.";
  feePreview.classList.remove("fee-preview-error");

  receiptDetails.replaceChildren();

  currentView = "form";
  renderView();
};

transactionForm.addEventListener("submit", handleFormSubmit);

nameInput.addEventListener("input", handleNameInput);
phoneInput.addEventListener("input", handlePhoneInput);
amountInput.addEventListener("input", handleAmountInput);
typeInput.addEventListener("change", handleTypeChange);

newTransactionButton.addEventListener("click", handleNewTransaction);

// -----------------------------------------
// Fee function tests
// -----------------------------------------

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
