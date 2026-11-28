"use strict";

/* =========================================================
   STORAGE SECTION
   Saves and loads app data using localStorage.
========================================================= */

const STORAGE_KEYS = {
  products: "dukaStockManager.products",
  sales: "dukaStockManager.sales",
};

/**
 * Saves the current products and sales to localStorage.
 * Called after every change to the data.
 */
function saveData() {
  try {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(state.products));
    localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(state.sales));
  } catch (error) {
    console.error("Could not save data:", error);
  }
}

/**
 * Loads products and sales from localStorage.
 * If saved data is missing or broken, it starts with sample products.
 * @returns {{products: Array, sales: Array}}
 */
function loadData() {
  let products = [];
  let sales = [];

  try {
    const savedProducts = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.products) || "null",
    );

    const savedSales = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.sales) || "null",
    );

    // Only use saved products if they have the correct shape
    if (isValidProductArray(savedProducts)) {
      products = savedProducts;
    }

    // Only use saved sales if they have the correct shape
    if (isValidSaleArray(savedSales)) {
      sales = savedSales;
    }
  } catch (error) {
    console.error("Could not load saved data:", error);
  }

  // Add sample products only if this is the first visit
  const isFirstVisit = localStorage.getItem(STORAGE_KEYS.products) === null;

  if (isFirstVisit) {
    products = createSampleProducts();
  }

  return { products, sales };
}

/**
 * Checks whether every item in an array is a valid product.
 * @param {*} value
 * @returns {boolean}
 */
function isValidProductArray(value) {
  return Array.isArray(value) && value.every(isValidProduct);
}

/**
 * Checks that a product object has all required properties.
 * @param {*} product
 * @returns {boolean}
 */
function isValidProduct(product) {
  return (
    typeof product === "object" &&
    product !== null &&
    typeof product.id === "number" &&
    typeof product.name === "string" &&
    typeof product.category === "string" &&
    typeof product.buyPrice === "number" &&
    typeof product.sellPrice === "number" &&
    typeof product.quantity === "number" &&
    typeof product.reorderLevel === "number" &&
    typeof product.lastRestocked === "string"
  );
}

/**
 * Checks whether every item in an array is a valid sale.
 * @param {*} value
 * @returns {boolean}
 */
function isValidSaleArray(value) {
  return Array.isArray(value) && value.every(isValidSale);
}

/**
 * Checks that a sale object has all required properties.
 * @param {*} sale
 * @returns {boolean}
 */
function isValidSale(sale) {
  return (
    typeof sale === "object" &&
    sale !== null &&
    typeof sale.productId === "number" &&
    typeof sale.price === "number" &&
    typeof sale.soldAt === "string"
  );
}

/* =========================================================
   STATE SECTION
   Holds the current app data and user choices.
========================================================= */

const state = {
  products: [],
  sales: [],
  filter: "all", // "all" or "low"
  category: "all", // "all" or a product category
  search: "",
  editingProductId: null,
};

/* =========================================================
   ELEMENTS SECTION
   Stores references to HTML elements used by JavaScript.
========================================================= */

const elements = {
  productForm: document.querySelector("#product-form"),
  productList: document.querySelector("#product-list"),
  productTemplate: document.querySelector("#product-template"),
  searchInput: document.querySelector("#search"),
  categoryFilters: document.querySelector("#category-filters"),
  emptyMessage: document.querySelector("#empty-message"),
  salesList: document.querySelector("#sales-list"),
  salesTodayMessage: document.querySelector("#sales-today-message"),
  editDialog: document.querySelector("#edit-dialog"),
  editForm: document.querySelector("#edit-form"),
  cancelEditButton: document.querySelector("#cancel-edit"),
  summaryProducts: document.querySelector("#summary-products"),
  summaryUnits: document.querySelector("#summary-units"),
  summaryStockValue: document.querySelector("#summary-stock-value"),
  summaryProfit: document.querySelector("#summary-profit"),
  summarySalesCount: document.querySelector("#summary-sales-count"),
  summarySalesValue: document.querySelector("#summary-sales-value"),
};

/* =========================================================
   HELPERS SECTION
   Small reusable functions used throughout the app.
========================================================= */

/**
 * Creates a unique numeric product ID.
 * @returns {number}
 */
function createProductId() {
  return Date.now();
}

/**
 * Returns today's date in ISO format, for example "2026-11-28".
 * @returns {string}
 */
function getTodayISODate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Calculates how many days ago a product was restocked.
 * @param {string} isoDate - Date in the format "YYYY-MM-DD"
 * @returns {number}
 */
function getDaysAgo(isoDate) {
  const restockedDate = new Date(`${isoDate}T00:00:00`);
  const today = new Date(`${getTodayISODate()}T00:00:00`);
  const differenceInTime = today.getTime() - restockedDate.getTime();

  return Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
}

/**
 * Converts a restocked date into readable text.
 * @param {string} isoDate
 * @returns {string}
 */
function formatRestockedDate(isoDate) {
  const daysAgo = getDaysAgo(isoDate);

  if (daysAgo === 0) {
    return "Restocked today";
  }

  if (daysAgo === 1) {
    return "Restocked 1 day ago";
  }

  return `Restocked ${daysAgo} days ago`;
}

/**
 * Formats a number as Kenyan Shillings.
 * @param {number} amount
 * @returns {string}
 */
function formatMoney(amount) {
  return `KSh ${amount.toLocaleString("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Formats a sale timestamp as a short time.
 * @param {string} isoTimestamp
 * @returns {string}
 */
function formatSaleTime(isoTimestamp) {
  return new Date(isoTimestamp).toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Determines whether a product is in stock, low in stock, or out of stock.
 * @param {object} product
 * @returns {string}
 */
function getProductStatus(product) {
  if (product.quantity === 0) {
    return "Out of stock";
  }

  if (product.quantity <= product.reorderLevel) {
    return "Low stock";
  }

  return "In stock";
}

/**
 * Returns a CSS class for a product status.
 * @param {string} status
 * @returns {string}
 */
function getStatusClass(status) {
  if (status === "Out of stock") {
    return "status-out-of-stock";
  }

  if (status === "Low stock") {
    return "status-low-stock";
  }

  return "status-in-stock";
}

/**
 * Finds one product using its numeric ID.
 * @param {number} productId
 * @returns {object|undefined}
 */
function findProductById(productId) {
  return state.products.find((product) => product.id === productId);
}

/**
 * Removes all validation error messages from a form.
 * @param {HTMLFormElement} form
 */
function clearErrors(form) {
  form.querySelectorAll(".error").forEach((errorElement) => {
    errorElement.textContent = "";
    errorElement.hidden = true;
  });

  form
    .querySelectorAll("[aria-invalid='true']")
    .forEach((field) => field.removeAttribute("aria-invalid"));
}

/**
 * Shows an error message beside a form field.
 * @param {HTMLFormElement} form
 * @param {string} fieldName
 * @param {string} message
 */
function showError(form, fieldName, message) {
  const errorElement = form.querySelector(`#${fieldName}-error`);

  if (!errorElement) {
    console.warn(`Missing error element: #${fieldName}-error`);
    return;
  }

  errorElement.textContent = message;
  errorElement.hidden = false;

  const fieldIdMap = {
    name: "product-name",
    "buy-price": "buy-price",
    "sell-price": "sell-price",
    quantity: "quantity",
    "reorder-level": "reorder-level",
  };

  const field = form.querySelector(`#${fieldIdMap[fieldName]}`);

  if (field) {
    field.setAttribute("aria-invalid", "true");
  }
}

/**
 * Moves keyboard focus to the first invalid form field.
 * @param {HTMLFormElement} form
 */
function focusFirstError(form) {
  const firstError = form.querySelector(".error:not([hidden])");

  if (!firstError) {
    return;
  }

  // Maps an error ID to the correct input ID
  const fieldIdMap = {
    "name-error": "product-name",
    "buy-price-error": "buy-price",
    "sell-price-error": "sell-price",
    "quantity-error": "quantity",
    "reorder-level-error": "reorder-level",
  };

  const fieldId = fieldIdMap[firstError.id];

  if (fieldId) {
    const field = form.querySelector(`#${fieldId}`);

    if (field) {
      field.focus();
    }
  }
}

/* =========================================================
   DATA FUNCTIONS SECTION
   Every change to products or sales goes through these functions.
========================================================= */

/**
 * Creates starter products for Mama Wairimu's first visit.
 * @returns {Array} A list of sample products.
 */
function createSampleProducts() {
  return [
    {
      id: 1,
      name: "Unga (2kg)",
      category: "Food",
      buyPrice: 180,
      sellPrice: 210,
      quantity: 24,
      reorderLevel: 10,
      lastRestocked: "2026-11-28",
    },
    {
      id: 2,
      name: "Cooking oil (1L)",
      category: "Food",
      buyPrice: 280,
      sellPrice: 350,
      quantity: 3,
      reorderLevel: 5,
      lastRestocked: "2026-11-28",
    },
    {
      id: 3,
      name: "Sugar (1kg)",
      category: "Food",
      buyPrice: 130,
      sellPrice: 170,
      quantity: 0,
      reorderLevel: 4,
      lastRestocked: "2026-11-27",
    },
    {
      id: 4,
      name: "Rice (2kg)",
      category: "Food",
      buyPrice: 250,
      sellPrice: 320,
      quantity: 15,
      reorderLevel: 6,
      lastRestocked: "2026-11-26",
    },
    {
      id: 5,
      name: "Soda (500ml)",
      category: "Drinks",
      buyPrice: 45,
      sellPrice: 70,
      quantity: 36,
      reorderLevel: 12,
      lastRestocked: "2026-11-28",
    },
    {
      id: 6,
      name: "Water (500ml)",
      category: "Drinks",
      buyPrice: 20,
      sellPrice: 30,
      quantity: 48,
      reorderLevel: 24,
      lastRestocked: "2026-11-28",
    },
    {
      id: 7,
      name: "Bar soap",
      category: "Household",
      buyPrice: 70,
      sellPrice: 100,
      quantity: 20,
      reorderLevel: 6,
      lastRestocked: "2026-11-25",
    },
    {
      id: 8,
      name: "Washing powder (500g)",
      category: "Household",
      buyPrice: 150,
      sellPrice: 200,
      quantity: 2,
      reorderLevel: 5,
      lastRestocked: "2026-11-28",
    },
    {
      id: 9,
      name: "Toothpaste",
      category: "Personal care",
      buyPrice: 90,
      sellPrice: 130,
      quantity: 10,
      reorderLevel: 4,
      lastRestocked: "2026-11-27",
    },
    {
      id: 10,
      name: "Toilet paper",
      category: "Household",
      buyPrice: 35,
      sellPrice: 50,
      quantity: 0,
      reorderLevel: 8,
      lastRestocked: "2026-11-26",
    },
  ];
}

/**
 * Adds a new product to the product list.
 * @param {object} formData - Valid values from the add-product form
 */
function addProduct(formData) {
  const newProduct = {
    id: createProductId(),
    name: formData.name.trim(),
    category: formData.category,
    buyPrice: Number(formData.buyPrice),
    sellPrice: Number(formData.sellPrice),
    quantity: Number(formData.quantity),
    reorderLevel: Number(formData.reorderLevel),
    lastRestocked: getTodayISODate(),
  };

  state.products.push(newProduct);
  saveData();
  renderApp();
}

/**
 * Reduces a product's quantity by one and records the sale.
 * @param {number} productId
 */
function sellProduct(productId) {
  const product = findProductById(productId);

  // Do not sell an item that is out of stock
  if (!product || product.quantity === 0) {
    return;
  }

  product.quantity -= 1;

  state.sales.push({
    productId: product.id,
    price: product.sellPrice,
    soldAt: new Date().toISOString(),
  });

  saveData();
  renderApp();
}

/**
 * Adds new stock to a product and updates its restocked date.
 * @param {number} productId
 * @param {number} units - Whole number of units received
 */
function restockProduct(productId, units) {
  const product = findProductById(productId);

  if (!product) {
    return;
  }

  product.quantity += units;
  product.lastRestocked = getTodayISODate();

  saveData();
  renderApp();
}

/**
 * Updates an existing product using values from the edit form.
 * @param {number} productId
 * @param {object} formData
 */
function updateProduct(productId, formData) {
  const product = findProductById(productId);

  if (!product) {
    return;
  }

  product.name = formData.name.trim();
  product.buyPrice = Number(formData.buyPrice);
  product.sellPrice = Number(formData.sellPrice);
  product.reorderLevel = Number(formData.reorderLevel);

  saveData();
  renderApp();
}

/**
 * Removes a product from the product list by ID.
 * @param {number} productId
 */
function deleteProduct(productId) {
  state.products = state.products.filter((product) => product.id !== productId);

  saveData();
  renderApp();
}

/* =========================================================
   VALIDATION SECTION
   Checks that user input follows the business rules.
========================================================= */

/**
 * Validates either the add-product form or edit-product form.
 * @param {HTMLFormElement} form
 * @param {number|null} currentProductId - Used to allow a product to keep its own name
 * @param {boolean} isEditForm - True when validating the edit form
 * @returns {object|null} Valid form data, or null when there are errors
 */
function validateProductForm(
  form,
  currentProductId = null,
  isEditForm = false,
) {
  clearErrors(form);

  const formData = Object.fromEntries(new FormData(form));
  const errors = [];

  const name = String(formData.name || "").trim();
  const category = String(formData.category || "").trim();
  const buyPrice = Number(formData.buyPrice);
  const sellPrice = Number(formData.sellPrice);
  const quantity = Number(formData.quantity);
  const reorderLevel = Number(formData.reorderLevel);

  // Name must be entered and must not duplicate another product
  if (!name) {
    showError(form, "name", "Product name is required.");
    errors.push("name");
  } else {
    const duplicate = state.products.some(
      (product) =>
        product.id !== currentProductId &&
        product.name.toLowerCase() === name.toLowerCase(),
    );

    if (duplicate) {
      showError(form, "name", "This product name already exists.");
      errors.push("name");
    }
  }

  // Category is only required when adding a new product
  if (!isEditForm && !category) {
    showError(form, "category", "Please choose a category.");
    errors.push("category");
  }

  // Buying price must be a positive number
  if (!Number.isFinite(buyPrice) || buyPrice <= 0) {
    showError(form, "buy-price", "Buying price must be a positive number.");
    errors.push("buy-price");
  }

  // Selling price must be a positive number
  if (!Number.isFinite(sellPrice) || sellPrice <= 0) {
    showError(form, "sell-price", "Selling price must be a positive number.");
    errors.push("sell-price");
  }

  // Selling price cannot be lower than buying price
  if (
    Number.isFinite(buyPrice) &&
    Number.isFinite(sellPrice) &&
    sellPrice < buyPrice
  ) {
    showError(
      form,
      "sell-price",
      "Selling price cannot be below buying price.",
    );
    errors.push("sell-price");
  }

  // Quantity is only required when adding a new product
  if (!isEditForm && (!Number.isInteger(quantity) || quantity < 0)) {
    showError(
      form,
      "quantity",
      "Quantity must be a whole number of 0 or more.",
    );
    errors.push("quantity");
  }

  // Reorder level must be a whole number of 0 or more
  if (!Number.isInteger(reorderLevel) || reorderLevel < 0) {
    showError(
      form,
      "reorder-level",
      "Reorder level must be a whole number of 0 or more.",
    );
    errors.push("reorder-level");
  }

  // If there are errors, focus the first invalid field
  if (errors.length > 0) {
    focusFirstError(form);
    return null;
  }

  return formData;
}

/* =========================================================
   FILTERING SECTION
   Combines search, stock filter and category filter.
========================================================= */

/**
 * Returns only the products that match the current search and filters.
 * @returns {Array}
 */
function getVisibleProducts() {
  const search = state.search.trim().toLowerCase();

  return state.products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search);

    const matchesStockFilter =
      state.filter === "all" ||
      (state.filter === "low" && product.quantity <= product.reorderLevel);

    const matchesCategory =
      state.category === "all" || product.category === state.category;

    return matchesSearch && matchesStockFilter && matchesCategory;
  });
}

/**
 * Returns a list of unique product categories.
 * @returns {Array}
 */
function getCategories() {
  return [...new Set(state.products.map((product) => product.category))];
}

/* =========================================================
   RENDERING SECTION
   Displays data on the page without putting user input in innerHTML.
========================================================= */

/**
 * Renders the summary, filters, products and sales.
 */
function renderApp() {
  renderSummary();
  renderFilters();
  renderProducts();
  renderSales();
}

/**
 * Calculates and displays all summary figures.
 */
function renderSummary() {
  // Total units currently available across all products
  const totalUnits = state.products.reduce(
    (total, product) => total + product.quantity,
    0,
  );

  // Total value of stock based on buying price
  const stockValue = state.products.reduce(
    (total, product) => total + product.buyPrice * product.quantity,
    0,
  );

  // Potential profit if all current stock is sold
  const potentialProfit = state.products.reduce(
    (total, product) =>
      total + (product.sellPrice - product.buyPrice) * product.quantity,
    0,
  );

  // Sales made today only; older sales remain saved but are not counted
  const today = getTodayISODate();

  const salesToday = state.sales.filter((sale) => {
    return sale.soldAt.slice(0, 10) === today;
  });

  const salesValueToday = salesToday.reduce(
    (total, sale) => total + sale.price,
    0,
  );

  elements.summaryProducts.textContent = state.products.length;
  elements.summaryUnits.textContent = totalUnits;
  elements.summaryStockValue.textContent = formatMoney(stockValue);
  elements.summaryProfit.textContent = formatMoney(potentialProfit);
  elements.summarySalesCount.textContent = salesToday.length;
  elements.summarySalesValue.textContent = formatMoney(salesValueToday);
}

/**
 * Creates and updates the stock and category filter buttons.
 */
function renderFilters() {
  const categories = getCategories();

  // Remove old category buttons before creating new ones
  elements.categoryFilters.replaceChildren();

  // Create the "All categories" button
  const allButton = document.createElement("button");
  allButton.type = "button";
  allButton.className = "filter-button";
  allButton.dataset.filter = "all";
  allButton.setAttribute("aria-pressed", String(state.category === "all"));
  allButton.textContent = `All categories (${state.products.length})`;

  elements.categoryFilters.append(allButton);

  // Create one button for every category
  categories.forEach((category) => {
    const count = state.products.filter(
      (product) => product.category === category,
    ).length;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button";
    button.dataset.filter = category;
    button.setAttribute("aria-pressed", String(state.category === category));
    button.textContent = `${category} (${count})`;

    elements.categoryFilters.append(button);
  });

  // Update the low-stock filter count
  const lowStockCount = state.products.filter(
    (product) => product.quantity <= product.reorderLevel,
  ).length;

  const lowButton = document.querySelector('[data-filter="low"]');
  lowButton.textContent = `Low stock (${lowStockCount})`;
  lowButton.setAttribute("aria-pressed", String(state.filter === "low"));

  // Update the all-products filter count
  const allStockButton = document.querySelector('[data-filter="all"]');
  allStockButton.textContent = `All (${state.products.length})`;
  allStockButton.setAttribute("aria-pressed", String(state.filter === "all"));
}

/**
 * Renders the visible product cards from product data.
 */
function renderProducts() {
  const visibleProducts = getVisibleProducts();

  // Clear the list before rendering fresh products
  elements.productList.replaceChildren();

  // Show a helpful message when no products match
  if (visibleProducts.length === 0) {
    elements.emptyMessage.hidden = false;

    if (state.search.trim()) {
      elements.emptyMessage.textContent =
        "No products match your search. Try another product name.";
    } else if (state.filter === "low") {
      elements.emptyMessage.textContent =
        "No products are low in stock or out of stock.";
    } else if (state.category !== "all") {
      elements.emptyMessage.textContent = `No products found in the ${state.category} category.`;
    } else {
      elements.emptyMessage.textContent =
        "No products yet. Add your first product above.";
    }

    return;
  }

  elements.emptyMessage.hidden = true;

  // Render each visible product using the HTML template
  visibleProducts.forEach((product) => {
    const productCard = elements.productTemplate.content.cloneNode(true);
    const status = getProductStatus(product);

    const listItem = productCard.querySelector("li");
    listItem.dataset.id = product.id;

    // textContent is used so user input is never inserted as HTML
    productCard.querySelector(".product-name").textContent = product.name;
    productCard.querySelector(".product-category").textContent =
      product.category;
    productCard.querySelector(".product-status").textContent = status;
    productCard.querySelector(".product-status").className =
      `product-status ${getStatusClass(status)}`;

    productCard.querySelector(".sell-price").textContent = formatMoney(
      product.sellPrice,
    );
    productCard.querySelector(".quantity").textContent = product.quantity;
    productCard.querySelector(".reorder-level").textContent =
      product.reorderLevel;
    productCard.querySelector(".last-restocked").textContent =
      formatRestockedDate(product.lastRestocked);

    // Disable Sell 1 when there is no stock
    const sellButton = productCard.querySelector(".sell-button");
    sellButton.disabled = product.quantity === 0;

    // Give screen-reader users a clearer button label
    sellButton.setAttribute(
      "aria-label",
      product.quantity === 0
        ? `Sell 1 ${product.name}. Out of stock.`
        : `Sell 1 ${product.name}`,
    );

    elements.productList.append(productCard);
  });
}

/**
 * Renders sales made today.
 */
function renderSales() {
  const today = getTodayISODate();

  const salesToday = state.sales.filter(
    (sale) => sale.soldAt.slice(0, 10) === today,
  );

  elements.salesList.replaceChildren();

  if (salesToday.length === 0) {
    elements.salesTodayMessage.hidden = false;
    elements.salesTodayMessage.textContent = "No sales recorded today.";
    return;
  }

  elements.salesTodayMessage.hidden = true;

  salesToday.forEach((sale) => {
    const product = findProductById(sale.productId);
    const listItem = document.createElement("li");

    listItem.textContent =
      `${product ? product.name : "Unknown product"} sold for ` +
      `${formatMoney(sale.price)} at ${formatSaleTime(sale.soldAt)}`;

    elements.salesList.append(listItem);
  });
}

/* =========================================================
   LISTENERS SECTION
   Handles user actions using event delegation.
========================================================= */

/**
 * Handles adding a new product.
 */
elements.productForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = validateProductForm(elements.productForm);

  // Stop if validation failed
  if (!formData) {
    return;
  }

  addProduct(formData);

  // Clear the form and prepare it for another product
  elements.productForm.reset();
  document.querySelector("#product-name").focus();
});

/**
 * Updates the search value whenever the user types.
 */
elements.searchInput.addEventListener("input", () => {
  state.search = elements.searchInput.value;
  renderProducts();
});

/**
 * Handles stock-level filter buttons.
 */
document.querySelector(".filters").addEventListener("click", (event) => {
  const button = event.target.closest(".filter-button");

  if (!button) {
    return;
  }

  state.filter = button.dataset.filter;
  renderFilters();
  renderProducts();
});

/**
 * Handles category filter buttons.
 */
elements.categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-button");

  if (!button) {
    return;
  }

  state.category = button.dataset.filter;
  renderFilters();
  renderProducts();
});

/**
 * One delegated listener handles sell, restock, edit and delete.
 */
elements.productList.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const productCard = button.closest(".product-card");
  const productId = Number(productCard.dataset.id);

  // Sell one unit
  if (button.classList.contains("sell-button")) {
    sellProduct(productId);
  }

  // Restock a product
  if (button.classList.contains("restock-button")) {
    const answer = prompt("How many units arrived?");

    // User cancelled the prompt
    if (answer === null) {
      return;
    }

    const units = Number(answer);

    if (!Number.isInteger(units) || units <= 0) {
      alert("Please enter a whole number greater than 0.");
      return;
    }

    restockProduct(productId, units);
  }

  // Open the edit dialog
  if (button.classList.contains("edit-button")) {
    openEditDialog(productId);
  }

  // Delete a product after confirmation
  if (button.classList.contains("delete-button")) {
    const product = findProductById(productId);

    if (product && confirm(`Delete ${product.name}? This cannot be undone.`)) {
      deleteProduct(productId);
    }
  }
});

/**
 * Opens the edit dialog and fills it with the selected product's details.
 * @param {number} productId
 */
function openEditDialog(productId) {
  const product = findProductById(productId);

  if (!product) {
    return;
  }

  state.editingProductId = productId;

  elements.editForm.elements.name.value = product.name;
  elements.editForm.elements.buyPrice.value = product.buyPrice;
  elements.editForm.elements.sellPrice.value = product.sellPrice;
  elements.editForm.elements.reorderLevel.value = product.reorderLevel;

  clearErrors(elements.editForm);
  elements.editDialog.showModal();
  elements.editForm.elements.name.focus();
}

/**
 * Saves edited product details.
 */
elements.editForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // The third value, true, tells the function this is the edit form.
  // It prevents validation of category and quantity.
  const formData = validateProductForm(
    elements.editForm,
    state.editingProductId,
    true,
  );

  if (!formData) {
    return;
  }

  updateProduct(state.editingProductId, formData);
  elements.editDialog.close();
});

/**
 * Closes the edit dialog without saving.
 */
elements.cancelEditButton.addEventListener("click", () => {
  elements.editDialog.close();
});

/* =========================================================
   START SECTION
   Loads saved data and displays the app.
========================================================= */

/**
 * Starts the app by loading data, saving it safely, and rendering the page.
 */
function start() {
  const loadedData = loadData();

  state.products = loadedData.products;
  state.sales = loadedData.sales;

  saveData();
  renderApp();
}

start();
