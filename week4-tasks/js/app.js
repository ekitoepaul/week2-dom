// ---- Storage ----

const STORAGE_KEY = "kazi-list-tasks";
const NAME_KEY = "kazi-list-name";
const PRIORITY_KEY = "kazi-list-last-priority";

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks === null) return [];

    const parsedTasks = JSON.parse(savedTasks);
    if (!Array.isArray(parsedTasks)) return [];

    return parsedTasks.filter(
      (task) =>
        task &&
        typeof task.id === "number" &&
        typeof task.title === "string" &&
        typeof task.done === "boolean" &&
        (task.priority === "high" || task.priority === "normal"),
    );
  } catch (error) {
    console.error("Could not load saved tasks:", error);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    setStatus("Tasks saved.");
  } catch (error) {
    console.error("Could not save tasks:", error);
    setStatus("Could not save tasks. Check your browser storage settings.");
  }
}

function loadName() {
  try {
    return localStorage.getItem(NAME_KEY) || "";
  } catch (error) {
    console.error("Could not load saved name:", error);
    return "";
  }
}

function saveName(name) {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch (error) {
    console.error("Could not save name:", error);
    setStatus("Could not save name.");
  }
}

function loadLastPriority() {
  try {
    const savedPriority = localStorage.getItem(PRIORITY_KEY);
    return savedPriority === "high" || savedPriority === "normal"
      ? savedPriority
      : "normal";
  } catch (error) {
    console.error("Could not load saved priority:", error);
    return "normal";
  }
}

function saveLastPriority(priority) {
  try {
    localStorage.setItem(PRIORITY_KEY, priority);
  } catch (error) {
    console.error("Could not save priority:", error);
  }
}

// ---- State ----

let tasks = loadTasks();
let userName = loadName();
let lastPriority = loadLastPriority();
let editingId = null;
let activeFilter = "all";

// Add new filter names here when you introduce another filter.
const FILTERS = ["all", "open", "done", "overdue", "today", "week"];

// ---- Elements ----

const list = document.querySelector("#task-list");
const countEl = document.querySelector("#task-count");
const summaryEl = document.querySelector("#task-summary");
const template = document.querySelector("#task-template");
const clearBtn = document.getElementById("clear-done");
const markAllDoneBtn = document.getElementById("mark-all-done");
const deleteAllBtn = document.getElementById("delete-all");
const statusEl = document.getElementById("status");

const todayDateEl = document.getElementById("today-date");
const liveClockEl = document.getElementById("live-clock");

const greetingEl = document.getElementById("greeting");
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("user-name");

const addForm = document.getElementById("add-form");
const newTitleInput = document.getElementById("new-title");
const newPriorityInput = document.getElementById("new-priority");
const newDueInput = document.getElementById("new-due");
const addErrorEl = document.getElementById("add-error");

const exportBtn = document.getElementById("export-tasks");
const exportOutput = document.getElementById("export-output");
const searchInput = document.getElementById("search-input");
const filterButtons = document.getElementById("filter-buttons");

// ---- Dates ----

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function parseLocalDate(dateString) {
  if (!dateString) return null;
  const date = new Date(`${dateString}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function daysUntil(dueDate) {
  const due = parseLocalDate(dueDate);
  if (!due) return null;

  return Math.round((due.getTime() - startOfToday().getTime()) / MS_PER_DAY);
}

// Monday through Sunday of the current calendar week.
function isDueThisWeek(dueDate) {
  const due = parseLocalDate(dueDate);
  if (!due) return false;

  const today = startOfToday();
  const dayOfWeek = (today.getDay() + 6) % 7; // Monday = 0
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayOfWeek);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return due >= monday && due <= sunday;
}

function formatDate(dueDate) {
  const due = parseLocalDate(dueDate);
  if (!due) return "";

  return due.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCreatedDate(createdAt) {
  if (!createdAt) return "";
  const created = new Date(createdAt);
  if (Number.isNaN(created.getTime())) return "";

  const day = String(created.getDate()).padStart(2, "0");
  const month = String(created.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${created.getFullYear()}`;
}

function dueLabel(dueDate) {
  const days = daysUntil(dueDate);
  if (days === null) return "";
  if (days < 0)
    return `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`;
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days — ${formatDate(dueDate)}`;
}

// ---- Helpers ----

function setStatus(message) {
  statusEl.textContent = message;
}

function commit() {
  saveTasks();
  renderTasks();
}

// ---- Clock ----

function renderClock() {
  const now = new Date();

  todayDateEl.textContent = now.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  liveClockEl.textContent = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// ---- Name ----

function renderName() {
  if (userName) {
    greetingEl.textContent = `Karibu, ${userName}`;
    greetingEl.hidden = false;
    nameForm.hidden = true;
  } else {
    greetingEl.hidden = true;
    nameForm.hidden = false;
  }
}

function handleNameSubmit(event) {
  event.preventDefault();
  const name = nameInput.value.trim();

  if (!name) {
    setStatus("Please enter your name.");
    return;
  }

  userName = name;
  saveName(userName);
  renderName();
  setStatus(`Name saved. Karibu, ${userName}!`);
}

// ---- Filtering and rendering ----

function taskMatchesFilter(task) {
  const days = daysUntil(task.dueDate);

  switch (activeFilter) {
    case "open":
      return !task.done;
    case "done":
      return task.done;
    case "overdue":
      return !task.done && days !== null && days < 0;
    case "today":
      return !task.done && days === 0;
    case "week":
      return !task.done && isDueThisWeek(task.dueDate);
    case "all":
    default:
      return true;
  }
}

function getVisibleTasks() {
  const searchTerm = searchInput.value.trim().toLocaleLowerCase();

  return tasks
    .filter(taskMatchesFilter)
    .filter((task) => task.title.toLocaleLowerCase().includes(searchTerm))
    .toSorted((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority === "high" ? -1 : 1;
      }
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });
}

function createTaskItem(task) {
  const li = template.content.firstElementChild.cloneNode(true);

  li.dataset.id = task.id;
  li.dataset.priority = task.priority;
  li.classList.toggle("done", task.done);

  const dueDays = daysUntil(task.dueDate);
  if (!task.done && dueDays !== null && dueDays < 0) {
    li.classList.add("overdue");
  }

  li.querySelector(".task-title").textContent = task.title;

  const badge = li.querySelector(".badge");
  badge.textContent = task.priority === "high" ? "High" : "Normal";
  badge.setAttribute(
    "aria-label",
    `Change priority for "${task.title}". Current priority: ${task.priority}`,
  );

  const due = li.querySelector(".due");
  due.dateTime = task.dueDate || "";
  due.textContent = dueLabel(task.dueDate);

  const created = li.querySelector(".created");
  created.textContent = task.createdAt
    ? `Added ${formatCreatedDate(task.createdAt)}`
    : "";

  const checkbox = li.querySelector(".task-check");
  checkbox.checked = task.done;
  checkbox.setAttribute("aria-label", `Mark "${task.title}" as done`);

  return li;
}

function renderSummary() {
  const overdueCount = tasks.filter(
    (task) => !task.done && daysUntil(task.dueDate) < 0,
  ).length;

  const dueTodayCount = tasks.filter(
    (task) => !task.done && daysUntil(task.dueDate) === 0,
  ).length;

  const dueWeekCount = tasks.filter(
    (task) => !task.done && isDueThisWeek(task.dueDate),
  ).length;

  const summaryParts = [];
  if (overdueCount > 0) summaryParts.push(`${overdueCount} overdue`);
  if (dueTodayCount > 0) summaryParts.push(`${dueTodayCount} due today`);
  if (dueWeekCount > 0) summaryParts.push(`${dueWeekCount} due this week`);

  summaryEl.textContent = summaryParts.length
    ? summaryParts.join(" · ")
    : "No overdue or upcoming tasks this week.";
}

function renderFilterButtons() {
  filterButtons.querySelectorAll("[data-filter]").forEach((button) => {
    const isActive = button.dataset.filter === activeFilter;
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderTasks() {
  list.textContent = "";

  const visibleTasks = getVisibleTasks();

  if (visibleTasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";

    if (tasks.length === 0) {
      empty.textContent = "No tasks yet. Add your first task below.";
    } else if (searchInput.value.trim()) {
      empty.textContent = "No tasks match your search and selected filter.";
    } else {
      empty.textContent = "No tasks in this view. Try another filter.";
    }

    list.append(empty);
  } else {
    visibleTasks.forEach((task) => list.append(createTaskItem(task)));
  }

  const left = tasks.filter((task) => !task.done).length;
  countEl.textContent = `${left} of ${tasks.length} tasks left`;

  renderSummary();
  renderFilterButtons();

  clearBtn.disabled = !tasks.some((task) => task.done);
  markAllDoneBtn.disabled =
    tasks.length === 0 || tasks.every((task) => task.done);
  deleteAllBtn.disabled = tasks.length === 0;
}

// ---- Task actions ----

function clearCompleted() {
  tasks = tasks.filter((task) => !task.done);
  commit();
  setStatus("Completed tasks cleared.");
}

function markAllDone() {
  tasks.forEach((task) => {
    task.done = true;
  });
  commit();
  setStatus("All tasks marked as completed.");
}

function deleteAllTasks() {
  if (!confirm("Delete all tasks? This cannot be undone.")) {
    setStatus("Delete all cancelled.");
    return;
  }

  tasks = [];
  commit();
  setStatus("All tasks deleted.");
}

function exportTasks() {
  exportOutput.textContent = JSON.stringify(tasks, null, 2);
  exportOutput.hidden = false;
  setStatus("Tasks exported below. Select and copy the JSON to make a backup.");
}

function startEditing(id) {
  const task = tasks.find((item) => item.id === id);
  if (!task) return;

  editingId = id;
  const updatedTitle = prompt("Edit task title:", task.title);
  if (updatedTitle === null) {
    editingId = null;
    return;
  }

  const cleanTitle = updatedTitle.trim();
  if (!cleanTitle) {
    setStatus("A task title cannot be empty.");
    editingId = null;
    return;
  }

  task.title = cleanTitle;
  editingId = null;
  commit();
  setStatus("Task updated.");
}

// ---- Events ----

nameForm.addEventListener("submit", handleNameSubmit);

clearBtn.addEventListener("click", clearCompleted);
markAllDoneBtn.addEventListener("click", markAllDone);
deleteAllBtn.addEventListener("click", deleteAllTasks);
exportBtn.addEventListener("click", exportTasks);

searchInput.addEventListener("input", renderTasks);

filterButtons.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button || !FILTERS.includes(button.dataset.filter)) return;

  activeFilter = button.dataset.filter;
  renderTasks();
});

// Press / to focus search, except while the user is typing in a form field.
document.addEventListener("keydown", (event) => {
  const activeElement = document.activeElement;
  const isTyping =
    activeElement &&
    (activeElement.matches("input, textarea, select") ||
      activeElement.isContentEditable);

  if (
    event.key === "/" &&
    !isTyping &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey
  ) {
    event.preventDefault();
    searchInput.focus();
  }
});

addForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = newTitleInput.value.trim();
  const priority = newPriorityInput.value;
  const dueDate = newDueInput.value;

  if (!title) {
    addErrorEl.textContent = "Please enter a task title.";
    newTitleInput.focus();
    return;
  }

  tasks.push({
    id: Date.now(),
    title,
    done: false,
    priority,
    dueDate,
    createdAt: new Date().toISOString(),
  });

  lastPriority = priority;
  saveLastPriority(lastPriority);

  newTitleInput.value = "";
  newDueInput.value = "";
  addErrorEl.textContent = "";
  commit();
  setStatus("Task added.");
  newTitleInput.focus();
});

list.addEventListener("click", (event) => {
  const li = event.target.closest(".task");
  if (!li) return;

  const task = tasks.find((item) => item.id === Number(li.dataset.id));
  if (!task) return;

  if (event.target.closest(".badge")) {
    task.priority = task.priority === "high" ? "normal" : "high";
    commit();
    setStatus("Task priority updated.");
    return;
  }

  if (event.target.closest(".edit-btn")) {
    startEditing(task.id);
    return;
  }

  if (event.target.closest(".delete-btn")) {
    if (!confirm(`Delete "${task.title}"?`)) return;
    tasks = tasks.filter((item) => item.id !== task.id);
    commit();
    setStatus("Task deleted.");
    return;
  }

  if (event.target.closest(".details-btn")) {
    const dueText = task.dueDate ? formatDate(task.dueDate) : "No due date";
    alert(
      `Task: ${task.title}\nPriority: ${task.priority}\nStatus: ${
        task.done ? "Completed" : "To do"
      }\nDue: ${dueText}`,
    );
    return;
  }

  if (event.target.closest(".task-check")) {
    task.done = event.target.checked;
    commit();
    setStatus(task.done ? "Task marked completed." : "Task marked as to do.");
  }
});

// ---- Start ----

newPriorityInput.value = lastPriority;
renderName();
renderClock();
renderTasks();

let shownDay = startOfToday().getTime();

setInterval(renderClock, 1000);

setInterval(() => {
  const today = startOfToday().getTime();

  if (today !== shownDay && editingId === null) {
    shownDay = today;
    renderTasks();
  }
}, 60000);
