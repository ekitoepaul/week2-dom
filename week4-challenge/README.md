# Duka Stock Manager

The Duka Stock Manager is a mobile-friendly web app for Mama Wairimu, who runs a small duka in Kayole. It helps her track products, avoid running out of popular items, record sales, restock products, and understand her potential profit.

## Live demo

Add your GitHub Pages link here after deployment:

https://your-username.github.io/phase2-javascript/week4-challenge/

## Features

- Add products with a name, category, buying price, selling price, quantity and reorder level.
- Product categories are Food, Drinks, Household and Personal care.
- Prevent duplicate product names, ignoring capital letters.
- Validate that prices are positive numbers.
- Prevent the selling price from being below the buying price.
- Require quantity and reorder level to be whole numbers of 0 or more.
- Show accessible error messages beside invalid fields.
- Focus the first invalid field when validation fails.
- Show each product’s status as text: In stock, Low stock, or Out of stock.
- Mark a product as Low stock when its quantity is at or below its reorder level.
- Sell one unit at a time and record each sale.
- Disable the Sell 1 button when a product is out of stock.
- Restock products and update the last-restocked date to today.
- Edit a product’s name, buying price, selling price and reorder level.
- Delete a product after confirmation.
- Search products by name.
- Filter products by All, Low stock, or a category.
- Show counts on filter buttons.
- Show clear empty-state messages when no products match.
- Show total products, total units, stock value, potential profit, and today’s sales.
- Save products and sales in the browser using localStorage.
- Load saved data safely using try/catch and shape checks.
- Show sample products only on the first visit.
- Show “Restocked today” or “Restocked 3 days ago” using date helper functions.
- Work on a 360px-wide phone screen.
- Support keyboard use with visible focus states.
- Use accessible labels and text-based status messages.

## Product data shape

Each product is stored as an object like this:

```javascript
{
  id: 1,
  name: "Unga (2kg)",
  category: "Food",
  buyPrice: 180,
  sellPrice: 210,
  quantity: 24,
  reorderLevel: 10,
  lastRestocked: "2026-10-12"
}
```

Each sale is stored like this:

```javascript
{
  productId: 1,
  price: 210,
  soldAt: "2026-11-28T18:30:00.000Z"
}
```

## How to use

1. Open the app in a browser.
2. Add a product using the form.
3. Use **Sell 1** when a customer buys an item.
4. Use **Restock** when new stock arrives.
5. Use **Edit** to change a product’s details.
6. Use **Delete** to remove a product.
7. Use the search box and filter buttons to find products.

## Technologies used

- HTML
- CSS
- JavaScript
- localStorage
- DOM manipulation
- HTML templates
- Event delegation
- Array methods
- Date handling
- Form validation

## Code structure

The JavaScript file is organised into these sections:

- **Storage**: saves and safely loads products and sales.
- **State**: stores products, sales, filters and search values.
- **Elements**: stores references to important HTML elements.
- **Helpers**: contains reusable functions for IDs, dates, money and status.
- **Data functions**: add, sell, restock, update and delete products.
- **Validation**: checks form input and shows accessible errors.
- **Filtering**: combines search, stock filters and category filters.
- **Rendering**: displays summary, filters, products and sales.
- **Listeners**: handles user actions.
- **Start**: loads data and starts the app.

## What I found hardest

The hardest part was making search, stock filters and category filters work together. A product should appear only when it matches all three conditions.

Another challenging part was handling dates correctly. Sales made today must appear in today’s summary, while older sales remain saved in localStorage but are not included in today’s figures.

## Accessibility

The app includes:

- Labels for every input and select field.
- Error messages connected to their fields.
- Visible keyboard focus.
- Clear button text.
- Status information as text, not colour alone.
- A responsive layout that works on small phone screens.

## Screenshot

Add a screenshot of the finished app here.

![Duka Stock Manager screenshot](screenshot.png)
