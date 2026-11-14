# Pesa Haraka Fee Calculator

## 1. Project Description

Pesa Haraka Fee Calculator is a simple JavaScript-based transaction fee calculator that simulates a mobile money transaction system. It allows customers to select a transaction type, enter their phone number and transaction amount, calculate the applicable transaction fee, and generate a transaction receipt.

The project demonstrates fundamental JavaScript programming concepts, including variables, constants, strings, numbers, user input, conditional statements, switch statements, regular expressions, mathematical calculations, and template literals.

## 2. Project Objectives

The main objectives of this project are to:

- Collect customer details using `prompt()`.
- Validate customer names and phone numbers.
- Allow customers to select different transaction types.
- Validate transaction amounts against specified limits.
- Calculate transaction fees based on the transaction type and amount.
- Generate a unique six-digit transaction reference number.
- Produce a formatted transaction receipt.
- Practise JavaScript programming fundamentals.

## 3. Key Features

The application provides the following features:

1. **Customer Information:** Requests the customer's full name.
2. **Phone Number Validation:** Accepts Kenyan mobile numbers starting with `07` or `01`.
3. **Phone Number Formatting:** Converts phone numbers into international format beginning with `254`.
4. **Transaction Selection:** Supports three transaction types:
   - Send Money
   - Withdraw Cash
   - Pay a Business
5. **Transaction Amount Validation:** Checks that the amount is a valid positive number.
6. **Transaction Limits:** Enforces the maximum transaction amount of KSh 150,000 and a minimum withdrawal amount of KSh 50.
7. **Fee Calculation:** Calculates transaction fees according to the transaction type and amount.
8. **Reference Number Generation:** Generates a random six-digit transaction reference number.
9. **Receipt Generation:** Displays a formatted receipt containing customer details, transaction information, fees, and the total amount.

## 4. Transaction Limits

| Description | Limit |
|---|---:|
| Minimum withdrawal | KSh 50 |
| Maximum transaction amount | KSh 150,000 |
| Send money below or equal to KSh 100 | Free |
| Pay a business | Free in this implementation |

## 5. Transaction Fee Structure

The calculator uses the following fee structure:

| Transaction Amount (KSh) | Send Money (KSh) | Withdraw Cash (KSh) |
|---|---:|---:|
| 1–100 | Free | 11 |
| 101–1,000 | 13 | 29 |
| 1,001–5,000 | 53 | 69 |
| 5,001–20,000 | 87 | 185 |
| 20,001–150,000 | 108 | 309 |

**Note:** These are illustrative fee rules implemented for this programming exercise. They should not be interpreted as official or current mobile money provider tariffs.

## 6. Technologies Used

- **JavaScript:** Main programming language.
- **HTML:** Provides the browser environment for executing JavaScript.
- **Browser Console:** Displays validation messages and transaction receipts.

## 7. JavaScript Concepts Demonstrated

| JavaScript Concept | Application |
|---|---|
| `const` | Declaring fixed values and customer information |
| `let` | Storing transaction fees and transaction types |
| `prompt()` | Collecting customer input |
| `console.log()` | Displaying messages and receipts |
| `if...else` | Validating customer information and transaction amounts |
| `switch` | Selecting transaction types |
| `Number()` | Converting transaction input into numbers |
| `Number.isNaN()` | Checking invalid numerical input |
| `.trim()` | Removing unnecessary spaces |
| `.replace()` | Removing spaces from phone numbers |
| Regular expressions | Validating Kenyan phone numbers |
| Ternary operator | Displaying free or paid transaction fees |
| Template literals | Generating formatted transaction receipts |
| `Math.random()` | Generating transaction reference numbers |
| `.toLocaleString()` | Formatting amounts with thousands separators |

## 8. How to Run the Project

Follow these steps to execute the program:

1. Clone or download the project repository from GitHub.
2. Open the project folder using Visual Studio Code.
3. Create or open the JavaScript file containing the Pesa Haraka code.
4. Save the file as `app.js`.
5. Create an HTML file and link the JavaScript file using:

   ```html
   <script src="app.js"></script>
   ```

6. Open the HTML file in a web browser.
7. Follow the prompts to enter the customer's details and transaction information.
8. Open the browser Developer Tools using `F12`.
9. Select the **Console** tab to view validation messages and the generated transaction receipt.

## 9. Testing the Application

The following test cases can be used to verify the program:

| Test Case | Input | Expected Result |
|---|---|---|
| Valid customer name | Paul Ekitoe | Accepted |
| Empty customer name | Blank input | Transaction cancelled |
| Valid phone number | 0712345678 | Accepted |
| Invalid phone number | 123456 | Rejected |
| Valid transaction type | 1, 2 or 3 | Accepted |
| Invalid transaction type | 4 | Rejected |
| Valid transaction amount | 5,000 | Accepted |
| Invalid transaction amount | three | Rejected |
| Zero transaction amount | 0 | Rejected |
| Amount above maximum | 160,000 | Rejected |
| Withdrawal below minimum | 30 | Rejected |
| Valid transaction | 1,000 | Receipt generated |

## 10. Project Limitations

- The application runs in a browser and uses prompt-based input.
- Transaction information is not stored in a database.
- The reference number is randomly generated and is not guaranteed to be unique.
- The application does not connect to an actual mobile money service.
- The transaction fee structure is illustrative and can be modified.

## 11. Future Improvements

The project can be enhanced by:

- Developing a graphical user interface (GUI).
- Adding transaction history.
- Integrating a database for storing transactions.
- Implementing stronger phone number validation.
- Introducing downloadable and printable receipts.
- Integrating an actual mobile money payment API.

## 9. Testing the Application – Test Cases and Expected Outputs

The following test cases are designed to verify the functionality of the Pesa Haraka Fee Calculator, including customer information validation, phone number validation, transaction selection, amount validation, fee calculation, and receipt generation.

### 9.1 Test Cases

| Test Case | Customer Name | Phone Number | Transaction Type | Amount (KSh) | Expected Output |
|---|---|---|---|---:|---|
| TC01 | PAUL EKITOE | 0717544278| Send Money | 100 | Transaction successful. Fee: FREE. Total: KSh 100. |
| TC02 | NAPEIKAR JAMES | 0707088524 | Send Money | 1,000 | Transaction successful. Fee: KSh 13. Total: KSh 1,013. |
| TC03 | DORCAS NATIIR | 0790151004 | Withdraw Cash | 1001 | Transaction successful. Fee: KSh 69. Total: KSh 1070. |
| TC04 |SHARON AKUWAM | 0795619240 | Withdraw Cash | 4589 | Transaction successful. Fee: KSh 69. Total: KSh 4658. |
| TC05| AMBROSE ETABO | 0757264304 | Pay a Business | 20,001 | Transaction successful. Fee: FREE. Total: KSh 20,001. |
| TC06 | Alice Chebet | 0712345678 | Withdraw Cash | 25 | Transaction refused: Minimum withdrawal is KSh 50. |
| TC07 | PETER NJOROGE | 0713254876 | Send Money | 155,000 | Transaction refused: Maximum amount is KSh 150,000. |
| TC08 | KELVIN KIPKETER | 1234567890 | Invalid phone number. Enter 10 digits starting with 07 or 01. |
| TC09 |FRANCIS KARANJA  | 0724419793 | Send Money | TEN | Invalid amount. Please enter a valid number. |
| TC10 | Blank | 0795858748 | Send Money | 500 | Transaction cancelled: A valid customer name is required. |

### 9.2 Sample Expected Transaction Receipt

**Test Case TC02: Send Money – KSh 500**

Sample console output:

```text
app.js:159 
========================================
          PESA HARAKA RECEIPT
========================================
Customer Name : PAUL EKITOE
Phone Number  : 254717544278
Reference No. : 257902
----------------------------------------
Transaction   : Send Money
----------------------------------------
Description           Amount (KSh)
Transaction                    100
Transaction Fee               FREE
----------------------------------------
TOTAL                          100
========================================
       Thank you for using Pesa Haraka!
========================================

app.js:159 
========================================
          PESA HARAKA RECEIPT
========================================
Customer Name : NAPEIKAR JAMES
Phone Number  : 254707088524
Reference No. : 292975
----------------------------------------
Transaction   : Send Money
----------------------------------------
Description           Amount (KSh)
Transaction                  1,000
Transaction Fee             KSh 13
----------------------------------------
TOTAL                        1,013
========================================
       Thank you for using Pesa Haraka!
========================================


app.js:159 
========================================
          PESA HARAKA RECEIPT
========================================
Customer Name : DORCAS NATIIR
Phone Number  : 254790151004
Reference No. : 190552
----------------------------------------
Transaction   : Withdraw Cash
----------------------------------------
Description           Amount (KSh)
Transaction                  1,001
Transaction Fee             KSh 69
----------------------------------------
TOTAL                        1,070
========================================
       Thank you for using Pesa Haraka!
========================================

app.js:159 
========================================
          PESA HARAKA RECEIPT
========================================
Customer Name : SHARON AKUWAM
Phone Number  : 254795619240
Reference No. : 163036
----------------------------------------
Transaction   : Withdraw Cash
----------------------------------------
Description           Amount (KSh)
Transaction                  4,589
Transaction Fee             KSh 69
----------------------------------------
TOTAL                        4,658
========================================
       Thank you for using Pesa Haraka!
========================================

app.js:159 
========================================
          PESA HARAKA RECEIPT
========================================
Customer Name : AMBROSE ETABO
Phone Number  : 254757264304
Reference No. : 850312
----------------------------------------
Transaction   : Pay a Business
----------------------------------------
Description           Amount (KSh)
Transaction                 20,001
Transaction Fee               FREE
----------------------------------------
TOTAL                       20,001
========================================
       Thank you for using Pesa Haraka!
========================================

app.js:86 Transaction refused: Minimum withdrawal is KSh 50.

app.js:82 Transaction refused: Maximum amount is KSh 150,000.

app.js:28 Invalid phone number. Enter 10 digits starting with 07 or 01.

app.js:78 Invalid amount. Please enter a valid number.

app.js:13 Transaction cancelled: A valid customer name is required.

```

*Note: The reference number is randomly generated and will differ each time the program runs.*

### 9.3 Sample Pay a Business Receipt

**Test Case TC05: Pay a Business Cash – KSh 20,001**

```text
app.js:159 
========================================
          PESA HARAKA RECEIPT
========================================
Customer Name : AMBROSE ETABO
Phone Number  : 254757264304
Reference No. : 850312
----------------------------------------
Transaction   : Pay a Business
----------------------------------------
Description           Amount (KSh)
Transaction                 20,001
Transaction Fee               FREE
----------------------------------------
TOTAL                       20,001
========================================
       Thank you for using Pesa Haraka!
========================================
```

### 9.4 Test Results

The application is expected to demonstrate the following:

1. Correct collection of customer names and phone numbers.
2. Successful validation of Kenyan mobile phone numbers.
3. Correct selection of transaction types using a switch statement.
4. Accurate conversion of transaction amounts using `Number()`.
5. Rejection of invalid numerical input using `Number.isNaN()`.
6. Enforcement of minimum withdrawal and maximum transaction limits.
7. Correct calculation of transaction fees.
8. Successful generation of formatted transaction receipts.

**Conclusion:** The test cases demonstrate how the Pesa Haraka Fee Calculator handles valid transactions, invalid customer information, transaction limits, and fee calculations. The expected outputs provide a basis for verifying that the JavaScript program performs according to its requirements.

## 12. Author

**Paul Ekitoe**

JavaScript Programming Practice Project

## 13. License

This project is intended for educational and learning purposes.