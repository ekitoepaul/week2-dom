// Monthly contribution expected from every member.
const MONTHLY_TARGET = 1000;

// Number of months covered so far: January, February and March.
const MONTHS_SO_FAR = 3;

// Total amount each member is expected to have paid by now.
const EXPECTED_TOTAL = MONTHLY_TARGET * MONTHS_SO_FAR;

// Stores the eight members and their payment records.
// This is the only place where the member data is kept.
const members = [
  {
    id: 1,
    name: "Wanjiru Kamau",
    phone: "0712345678",
    payments: [1000, 1000, 1000],
  },
  {
    id: 2,
    name: "Otieno Odhiambo",
    phone: "0722111222",
    payments: [1000, 500],
  },
  {
    id: 3,
    name: "Akinyi Achieng",
    phone: "0733444555",
    payments: [3200],
  },
  {
    id: 4,
    name: "Mutua Musyoka",
    phone: "0700987654",
    payments: [],
  },
  {
    id: 5,
    name: "Chebet Kiprono",
    phone: "0711222333",
    payments: [1000, 1000],
  },
  {
    id: 6,
    name: "Hassan Abdi",
    phone: "0799888777",
    payments: [500, 500, 500, 500],
  },
  {
    id: 7,
    name: "Njeri Mwangi",
    phone: "0745678901",
    payments: [1000, 1000, 1500],
  },
  {
    id: 8,
    name: "Kibet Langat",
    phone: "0768123456",
    payments: [200],
  },
];

// Finds the HTML elements once and stores them in constants.
// This avoids repeating document.querySelector many times.
const searchInput = document.querySelector("#search-input");
const statusFilter = document.querySelector("#status-filter");
const sortSelect = document.querySelector("#sort-select");
const membersBody = document.querySelector("#members-body");
const noMembers = document.querySelector("#no-members");
const totalCollected = document.querySelector("#total-collected");
const membersCurrent = document.querySelector("#members-current");
const membersOwing = document.querySelector("#members-owing");
const totalOwed = document.querySelector("#total-owed");
const topContributor = document.querySelector("#top-contributor");
const paymentForm = document.querySelector("#payment-form");
const memberSelect = document.querySelector("#member-select");
const amountInput = document.querySelector("#amount-input");
const formMessage = document.querySelector("#form-message");

// Calculates the total amount one member has paid.
// reduce adds all payments together, starting from 0.
function totalPaid(member) {
  return member.payments.reduce((total, payment) => total + payment, 0);
}

// Calculates whether a member has paid enough, too little, or too much.
// balance = total paid - expected amount.
function balance(member) {
  return totalPaid(member) - EXPECTED_TOTAL;
}

// Decides whether a member owes, is up to date, or is ahead.
function status(member) {
  const memberBalance = balance(member);

  // A negative balance means the member has not paid enough.
  if (memberBalance < 0) {
    return "Owes";
  }

  // A balance of zero means the member has paid exactly what is expected.
  if (memberBalance === 0) {
    return "Up to date";
  }

  // A positive balance means the member has paid more than expected.
  return "Ahead";
}

// Calculates the total paid by every member in a list.
function groupTotal(list) {
  return list.reduce((total, member) => total + totalPaid(member), 0);
}

// Turns a number into money format, for example KSh 1,000.
function formatMoney(amount) {
  return `KSh ${amount.toLocaleString("en-KE")}`;
}

// Shows negative balances with a minus sign.
function formatBalance(amount) {
  if (amount < 0) {
    return `-${formatMoney(Math.abs(amount))}`;
  }

  return formatMoney(amount);
}

// Gets the members that should appear in the table.
// It applies search, status filter, and sorting.
function getVisibleMembers() {
  // Removes spaces and changes search text to lowercase.
  const searchText = searchInput.value.trim().toLowerCase();
  const selectedStatus = statusFilter.value;

  // Keeps only members that match both the search and the filter.
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchText) ||
      member.phone.includes(searchText);

    const matchesStatus =
      selectedStatus === "all" || status(member) === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Sorts a copy by name from A to Z.
  if (sortSelect.value === "name") {
    return [...filteredMembers].sort((first, second) =>
      first.name.localeCompare(second.name),
    );
  }

  // Sorts a copy by balance, from lowest to highest.
  return [...filteredMembers].sort(
    (first, second) => balance(first) - balance(second),
  );
}

// Creates one table cell and puts text inside it.
function createCell(className, text) {
  const cell = document.createElement("td");
  cell.textContent = text;

  // Adds a CSS class only if one was provided.
  if (className) {
    cell.className = className;
  }

  return cell;
}

// Clears the table and builds it again using the current member data.
function renderMembers() {
  const visibleMembers = getVisibleMembers();

  // Removes old table rows before adding new ones.
  membersBody.textContent = "";

  // Shows the “No members match” message when the table is empty.
  if (visibleMembers.length === 0) {
    noMembers.hidden = false;
    return;
  }

  noMembers.hidden = true;

  // Creates one row for every visible member.
  visibleMembers.forEach((member) => {
    const row = document.createElement("tr");
    const memberStatus = status(member);

    // Adds a red background to members who owe money.
    if (memberStatus === "Owes") {
      row.className = "owes";
    }

    // Adds the member details into the table cells.
    row.appendChild(createCell("", member.name));
    row.appendChild(createCell("", member.phone));
    row.appendChild(createCell("", member.payments.length));
    row.appendChild(createCell("", formatMoney(totalPaid(member))));
    row.appendChild(createCell("", formatBalance(balance(member))));

    // Adds the status text, such as Owes, Up to date, or Ahead.
    const statusCell = createCell(
      `status-${memberStatus.toLowerCase().replace(" ", "-")}`,
      memberStatus,
    );
    row.appendChild(statusCell);

    // Adds the completed row to the table.
    membersBody.appendChild(row);
  });
}

// Calculates and displays the summary figures.
function renderSummary() {
  // Finds members whose status is “Owes”.
  const owingMembers = members.filter((member) => status(member) === "Owes");

  // Finds members who are up to date or ahead.
  const currentMembers = members.filter((member) => status(member) !== "Owes");

  // Finds the member who has paid the most money.
  const topMember = [...members].sort(
    (first, second) => totalPaid(second) - totalPaid(first),
  )[0];

  // Puts the calculated values into the summary section.
  totalCollected.textContent = formatMoney(groupTotal(members));
  membersCurrent.textContent = `${currentMembers.length} member(s)`;
  membersOwing.textContent = `${owingMembers.length} member(s)`;
  totalOwed.textContent = formatMoney(
    owingMembers.reduce(
      (total, member) => total + Math.abs(balance(member)),
      0,
    ),
  );
  topContributor.textContent = `${topMember.name} — ${formatMoney(
    totalPaid(topMember),
  )}`;
}

// Fills the payment form dropdown with member names.
function renderMemberOptions() {
  memberSelect.textContent = "";

  // Creates one dropdown option for every member.
  members.forEach((member) => {
    const option = document.createElement("option");
    option.value = member.id;
    option.textContent = member.name;
    memberSelect.appendChild(option);
  });
}

// Renders both the members table and summary panel.
function renderAll() {
  renderMembers();
  renderSummary();
}

// Runs when the user types in search or changes filter or sort.
function handleSearchOrFilter() {
  renderMembers();
}

// Runs when the treasurer submits the payment form.
function handlePayment(event) {
  event.preventDefault(); // Stops the page from reloading.

  // Gets the selected member and entered amount.
  const selectedMemberId = Number(memberSelect.value);
  const amount = Number(amountInput.value);

  // Finds the selected member using their id.
  const selectedMember = members.find(
    (member) => member.id === selectedMemberId,
  );

  // Checks that a member was selected.
  if (!selectedMember) {
    formMessage.textContent = "Please choose a member.";
    return;
  }

  // Checks that the amount is a whole number between 50 and 100,000.
  if (!Number.isInteger(amount) || amount < 50 || amount > 100000) {
    formMessage.textContent =
      "Enter a whole amount between KSh 50 and KSh 100,000.";
    return;
  }

  // Adds the payment to the selected member’s payments array.
  selectedMember.payments.push(amount);

  // Clears the amount field after saving.
  amountInput.value = "";

  // Shows a short confirmation message.
  formMessage.textContent = `Recorded ${formatMoney(
    amount,
  )} for ${selectedMember.name}.`;

  // Updates the table and summary with the new payment.
  renderAll();
}

// Makes the page respond when the user types or chooses an option.
searchInput.addEventListener("input", handleSearchOrFilter);
statusFilter.addEventListener("change", handleSearchOrFilter);
sortSelect.addEventListener("change", handleSearchOrFilter);

// Makes the payment form work when submitted.
paymentForm.addEventListener("submit", handlePayment);

// Builds the dropdown and shows the page when it loads.
renderMemberOptions();
renderAll();

// Console tests required by the README.
// Each function receives one member, except groupTotal(),
// which receives the full members array.

const akinyi = members.find((member) => member.name === "Akinyi Achieng");
const chebet = members.find((member) => member.name === "Chebet Kiprono");
const hassan = members.find((member) => member.name === "Hassan Abdi");
const kibet = members.find((member) => member.name === "Kibet Langat");
const mutua = members.find((member) => member.name === "Mutua Musyoka");
const njeri = members.find((member) => member.name === "Njeri Mwangi");
const otieno = members.find((member) => member.name === "Otieno Odhiambo");
const wanjiru = members.find((member) => member.name === "Wanjiru Kamau");


console.log(totalPaid(akinyi)); // 3200
console.log(balance(akinyi)); // 200
console.log(status(akinyi)); // "Ahead"

console.log(totalPaid(chebet)); // 2000
console.log(balance(chebet)); // -1000
console.log(status(chebet)); // "Owes"

console.log(totalPaid(hassan)); // 2000
console.log(balance(hassan)); // -1000
console.log(status(hassan)); // "Owes"

console.log(totalPaid(kibet)); // 200
console.log(balance(kibet)); // -2800
console.log(status(kibet)); // "Owes"

console.log(totalPaid(mutua)); // 0
console.log(balance(mutua)); // -3000
console.log(status(mutua)); // "Owes"

console.log(totalPaid(njeri)); // 3500
console.log(balance(njeri)); // 500
console.log(status(njeri)); // "Ahead"

console.log(totalPaid(otieno)); // 1500
console.log(balance(otieno)); // -1500
console.log(status(otieno)); // "Owes"

console.log(totalPaid(wanjiru)); // 3000
console.log(balance(wanjiru)); // 0
console.log(status(wanjiru)); // "Up to date"

console.log(groupTotal(members)); // 15400
