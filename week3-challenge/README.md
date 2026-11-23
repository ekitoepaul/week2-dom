# Umoja Chama Savings Tracker

This is a simple web page for the treasurer of Umoja Chama, a savings group with eight members in Githurai.

Each member is expected to contribute KSh 1,000 every month. The page helps the treasurer see who has paid, who owes money, and who has paid ahead.

## How to use the page

1. Open `index.html` in a web browser.
2. Type a member’s name or phone number in the search box.
3. Choose a status in the filter dropdown to see members who owe, are up to date, or are ahead.
4. Choose how to arrange the table using the sort dropdown.
5. Choose a member, enter an amount, and click **Record payment** to save a contribution.

## What the page shows

- Each member’s name, phone number, number of payments, total paid, balance, and status.
- Members who owe are clearly marked with the word **Owes** and a light red background.
- The summary shows the total collected, members who are up to date or ahead, members who owe, total amount owed, and the member who has paid the most.
- The page shows **No members match** when search and filter do not find anyone.

## How the code works

- `members` is an array that stores all eight members and their payments.
- `totalPaid(member)` uses `reduce` to add all payments for one member.
- `balance(member)` calculates the amount paid minus the expected amount.
- `status(member)` returns `Owes`, `Up to date`, or `Ahead`.
- `groupTotal(list)` uses `reduce` to calculate the total paid by all members.
- `renderMembers()` clears the table and creates new rows using `createElement` and `textContent`.
- `renderSummary()` calculates the summary figures from the member data.
- `renderMemberOptions()` fills the payment dropdown with member names.
- `handlePayment()` checks the amount, adds the payment, clears the input, and updates the page.

## Console tests

Open browser DevTools and run these tests. Each test passes one member object, except `groupTotal()`, which passes the full `members` array.

```js
const akinyi = members.find((member) => member.name === "Akinyi Achieng");
const chebet = members.find((member) => member.name === "Chebet Kiprono");
const hassan = members.find((member) => member.name === "Hassan Abdi");
const kibet = members.find((member) => member.name === "Kibet Langat");
const mutua = members.find((member) => member.name === "Mutua Musyoka");
const njeri = members.find((member) => member.name === "Njeri Mwangi");
const otieno = members.find((member) => member.name === "Otieno Odhiambo");
const wanjiru = members.find((member) => member.name === "Wanjiru Kamau");

totalPaid(akinyi); // 3200 — Akinyi has paid KSh 3,200
balance(akinyi); // 200 — Akinyi is ahead by KSh 200
status(akinyi); // "Ahead"

totalPaid(chebet); // 2000 — Chebet has paid KSh 2,000
balance(chebet); // -1000 — Chebet owes KSh 1,000
status(chebet); // "Owes"

totalPaid(hassan); // 2000 — Hassan has paid KSh 2,000
balance(hassan); // -1000 — Hassan owes KSh 1,000
status(hassan); // "Owes"

totalPaid(kibet); // 200 — Kibet has paid KSh 200
balance(kibet); // -2800 — Kibet owes KSh 2,800
status(kibet); // "Owes"

totalPaid(mutua); // 0 — Mutua has no payments
balance(mutua); // -3000 — Mutua owes KSh 3,000
status(mutua); // "Owes"

totalPaid(njeri); // 3500 — Njeri has paid KSh 3,500
balance(njeri); // 500 — Njeri is ahead by KSh 500
status(njeri); // "Ahead"

totalPaid(otieno); // 1500 — Otieno has paid KSh 1,500
balance(otieno); // -1500 — Otieno owes KSh 1,500
status(otieno); // "Owes"

totalPaid(wanjiru); // 3000 — Wanjiru is up to date
balance(wanjiru); // 0 — Wanjiru has paid exactly the expected amount
status(wanjiru); // "Up to date"

groupTotal(members); // 15400 — total collected before new payments


### Results observed

| Test | Result |
|---|---:|
| `totalPaid(akinyi)` | `3200` |
| `balance(akinyi)` | `200` |
| `status(akinyi)` | `"Ahead"` |
| `totalPaid(chebet)` | `2000` |
| `balance(chebet)` | `-1000` |
| `status(chebet)` | `"Owes"` |
| `totalPaid(hassan)` | `2000` |
| `balance(hassan)` | `-1000` |
| `status(hassan)` | `"Owes"` |
| `totalPaid(kibet)` | `200` |
| `balance(kibet)` | `-2800` |
| `status(kibet)` | `"Owes"` |
| `totalPaid(mutua)` | `0` |
| `balance(mutua)` | `-3000` |
| `status(mutua)` | `"Owes"` |
| `totalPaid(njeri)` | `3500` |
| `balance(njeri)` | `500` |
| `status(njeri)` | `"Ahead"` |
| `totalPaid(otieno)` | `1500` |
| `balance(otieno)` | `-1500` |
| `status(otieno)` | `"Owes"` |
| `totalPaid(wanjiru)` | `3000` |
| `balance(wanjiru)` | `0` |
| `status(wanjiru)` | `"Up to date"` |
| `groupTotal(members)` | `15400` |

## Expected starter figures

Before recording any new payment:

- Total collected: KSh 15,400
- Wanjiru Kamau: up to date
- Akinyi Achieng: ahead by KSh 200
- Njeri Mwangi: ahead by KSh 500
- Otieno Odhiambo: owes KSh 1,500
- Mutua Musyoka: owes KSh 3,000
- Five members owe a total of KSh 9,300
- Top contributor: Njeri Mwangi, KSh 3,500

## Screenshot

![alt text](image.png)



```
