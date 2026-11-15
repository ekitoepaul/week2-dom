# Pesa Haraka Transaction Calculator

A responsive, accessible browser-based version of the Pesa Haraka console fee calculator. It replaces `prompt()` and `alert()` with a labelled form, live fee preview, inline validation and an on-page receipt.

## What the app does

- Collects a customer's full name, phone number, transaction type and amount.
- Supports **Send money**, **Withdraw cash** and **Pay a business**.
- Previews the fee as the amount or transaction type changes.
- Validates all fields on submission and displays all errors beside their fields.
- Moves keyboard focus to the first invalid field.
- Displays a receipt with the customer's phone in `254` format, a six-digit reference, date/time, fee and total.
- Allows the user to start a new transaction without reloading the page.

## Project structure

```text
pesa-haraka/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── app.js
├── README.md
└── screenshot.png
```

## How to run

1. Download or clone this folder.
2. Open `index.html` in a modern browser, or use the VS Code **Live Server** extension.
3. Open the browser developer console to see the fee-function boundary assertions. A failed assertion is reported by the browser.

No framework, package installation or build step is required.

## Fee rules used

| Amount range       | Send money | Withdraw cash | Pay a business |
| ------------------ | ---------: | ------------: | -------------: |
| KSh 1–100          |       FREE |      KSh 11\* |           FREE |
| KSh 101–1,000      |     KSh 13 |        KSh 29 |           FREE |
| KSh 1,001–5,000    |     KSh 53 |        KSh 69 |           FREE |
| KSh 5,001–20,000   |     KSh 87 |       KSh 185 |           FREE |
| KSh 20,001–150,000 |    KSh 108 |       KSh 309 |           FREE |

`*` Withdrawals below KSh 50 are not allowed. The maximum transaction amount is KSh 150,000. The fee schedule follows the supplied console program.

## Test results

The following boundary cases are included as `console.assert()` checks at the bottom of `js/app.js`:

| Test | Input                              |      Expected result |
| ---- | ---------------------------------- | -------------------: |
| 1    | `calculateFee("send", 100)`        |           `0` (FREE) |
| 2    | `calculateFee("withdraw", 100)`    |                 `11` |
| 3    | `calculateFee("send", 101)`        |                 `13` |
| 4    | `calculateFee("send", 1000)`       |                 `13` |
| 5    | `calculateFee("send", 1001)`       |                 `53` |
| 6    | `calculateFee("withdraw", 49)`     | `null` (not allowed) |
| 7    | `calculateFee("withdraw", 50)`     |                 `11` |
| 8    | `calculateFee("send", 20000)`      |                 `87` |
| 9    | `calculateFee("send", 20001)`      |                `108` |
| 10   | `calculateFee("business", 150000)` |           `0` (FREE) |
| 11   | `calculateFee("send", 150001)`     | `null` (not allowed) |

The checkers also cover empty names, empty or malformed phone numbers, missing amounts, non-numeric values, zero/negative amounts, the maximum amount and the minimum withdrawal.

## Accessibility and responsive checks

- Every input has a visible `<label>`.
- Transaction type uses a native `<select>`.
- The form submits with a native submit button and works with keyboard navigation.
- Validation messages are written using `textContent`; invalid fields receive `aria-invalid` and `aria-describedby`.
- Correcting a field clears its error message and invalid state.
- Layout adapts for narrow phone screens (including 360px) and larger laptop screens.
- The receipt is assembled with `createElement()` and `textContent`; user-provided values are never inserted with `innerHTML`.

## Screenshot

![Pesa Haraka app screenshot](Screenshot 2026-11-15 020451.png)
![Pesa Haraka app screenshot](Screenshot 2026-11-15 020517.png)
![Pesa Haraka app screenshot](Screenshot 2026-11-15 021045.png)
![Pesa Haraka app screenshot](Screenshot widrawal.png)
![Pesa Haraka app screenshot](Screenshot 2026-11-15 165003.png)
![Pesa Haraka app screenshot](Screenshot 2026-11-15 165452.png)
![Pesa Haraka app screenshot](Screenshot 2026-11-15 165903.png)

## Suggested Git commit history

Make these as separate commits as you complete each stage (run commands from the repository root):

```bash
git add index.html
git commit -m "Create accessible Pesa Haraka form"

git add css/styles.css
git commit -m "Add responsive Pesa Haraka styling"

git add js/app.js
git commit -m "Implement fee calculation and validation"

git add js/app.js index.html
git commit -m "Add live fee preview and accessible receipt"

git add README.md screenshot.png
git commit -m "Document app and add screenshot"
```

Then push your branch:

```bash
git push origin main
```

If your default branch is not `main`, replace `main` with the branch name shown by `git branch --show-current`.

## Optional: publish with GitHub Pages

In the GitHub repository, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save. GitHub Pages will publish the app after deployment completes.
