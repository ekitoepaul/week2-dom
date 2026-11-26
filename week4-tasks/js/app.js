// ---- Storage ----

const STORAGE_KEY = "kazi-list-tasks";
const NAME_KEY = "kazi-list-name";
const PRIORITY_KEY = "kazi-list-last-priority";

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (savedTasks === null) {
      return [];
    }

    const parsedTasks = JSON.parse(savedTasks);

    if (!Array.isArray(parsedTasks)) {
      return [];
    }

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
    setStatus("Could not load saved tasks.");
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    setStatus("Tasks saved.");
  } catch (error) {
    console.error("Could not save tasks:", error);
    setStatus("Could not save tasks.");
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
    setStatus("Priority preference saved.");
  } catch (error) {
    console.error("Could not save priority:", error);
    setStatus("Could not save priority.");
  }
}

// ---- State ----

let tasks = loadTasks();
let userName = loadName();
let lastPriority = loadLastPriority();
let editingId = null;

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

// ---- Dates ----

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function startOfToday() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function daysUntil(dueDate) {
  if (!dueDate) {
    return null;
  }

  const due = new Date(`${dueDate}T00:00:00`);
  const today = startOfToday();

  return Math.round((due.getTime() - today.getTime()) / MS_PER_DAY);
}

function formatDate(dueDate) {
  if (!dueDate) {
    return "";
  }

  const due = new Date(`${dueDate}T00:00:00`);

  return due.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCreatedDate(createdAt) {
  if (!createdAt) {
    return "";
  }

  const created = new Date(createdAt);

  if (Number.isNaN(created.getTime())) {
    return "";
  }

  const day = String(created.getDate()).padStart(2, "0");
  const month = String(created.getMonth() + 1).padStart(2, "0");

  return `${day}/${month}/${created.getFullYear()}`;
}

function dueLabel(dueDate) {
  const days = daysUntil(dueDate);

  if (days === null) {
    return "";
  }

  if (days < 0) {
    return `Overdue by ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`;
  }

  if (days === 0) {
    return "Due today";
  }

  if (days === 1) {
    return "Due tomorrow";
  }

  return `Due in ${days} days — ${formatDate(dueDate)}`;
}

// ---- Helpers ----

function showStatus(message) {
  statusEl.textContent = message;
}

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
    showStatus("Please enter your name.");
    return;
  }

  userName = name;
  saveName(userName);
  renderName();
  showStatus(`Name saved. Karibu, ${userName}!`);
}

// ---- Rendering ----

function createTaskItem(task) {
  const li = template.content.firstElementChild.cloneNode(true);

  li.dataset.id = task.id;
  li.dataset.priority = task.priority;
  li.classList.toggle("done", task.done);

  const dueDays = daysUntil(task.dueDate);

  if (!task.done && dueDays !== null && dueDays < 0) {
    li.classList.add("overdue");
  }

  const title = li.querySelector(".task-title");
  title.textContent = task.title;

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

  const summaryParts = [];

  if (overdueCount > 0) {
    summaryParts.push(`${overdueCount} overdue${overdueCount === 1 ? "" : ""}`);
  }

  if (dueTodayCount > 0) {
    summaryParts.push(
      `${dueTodayCount} due today${dueTodayCount === 1 ? "" : ""}`,
    );
  }

  if (summaryParts.length === 0) {
    summaryEl.textContent = "No overdue or due-today tasks.";
    return;
  }

  summaryEl.textContent = summaryParts.join(", ");
}

function renderTasks() {
  list.textContent = "";

  if (tasks.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "No tasks yet.";
    list.append(empty);
  }

  const sortedTasks = tasks.toSorted((a, b) => {
    if (a.priority === b.priority) {
      return 0;
    }

    return a.priority === "high" ? -1 : 1;
  });

  sortedTasks.forEach((task) => list.append(createTaskItem(task)));

  const left = tasks.filter((task) => !task.done).length;
  countEl.textContent = `${left} of ${tasks.length} tasks left`;

  renderSummary();

  clearBtn.disabled = !tasks.some((task) => task.done);
  markAllDoneBtn.disabled = tasks.every((task) => task.done);
  deleteAllBtn.disabled = tasks.length === 0;
}

// ---- Task actions ----

function clearCompleted() {
  for (let i = tasks.length - 1; i >= 0; i -= 1) {
    if (tasks[i].done) {
      tasks.splice(i, 1);
    }
  }

  commit();
  showStatus("Completed tasks cleared");
}

function markAllDone() {
  tasks.forEach((task) => {
    task.done = true;
  });

  commit();
}

function deleteAllTasks() {
  const confirmed = confirm("Delete all tasks?");

  if (!confirmed) {
    showStatus("Delete all cancelled.");
    return;
  }

  tasks = [];
  commit();
  showStatus("Tasks deleted");
}

function exportTasks() {
  exportOutput.textContent = JSON.stringify(tasks, null, 2);
  exportOutput.hidden = false;
  showStatus("Tasks exported below. Copy the JSON to make a backup.");
}

function startEditing(id) {
  const task = tasks.find((item) => item.id === id);

  if (!task) return;

  editingId = id;
  console.log("Start editing:", task);
}

// ---- Events ----

nameForm.addEventListener("submit", handleNameSubmit);

clearBtn.addEventListener("click", clearCompleted);
markAllDoneBtn.addEventListener("click", markAllDone);
deleteAllBtn.addEventListener("click", deleteAllTasks);
exportBtn.addEventListener("click", exportTasks);

addForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = newTitleInput.value.trim();
  const priority = newPriorityInput.value;
  const dueDate = newDueInput.value;

  if (!title) {
    addErrorEl.textContent = "Please enter a task title.";
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
  showStatus("Task added");
});

list.addEventListener("click", (event) => {
  const li = event.target.closest(".task");
  if (!li) return;

  const task = tasks.find((item) => item.id === Number(li.dataset.id));
  if (!task) return;

  if (event.target.closest(".badge")) {
    task.priority = task.priority === "high" ? "normal" : "high";
    commit();
    return;
  }

  if (event.target.closest(".edit-btn")) {
    startEditing(task.id);
    return;
  }

  if (event.target.closest(".delete-btn")) {
    const taskIndex = tasks.findIndex((item) => item.id === task.id);

    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
      commit();
      showStatus("Task deleted");
    }

    return;
  }

  if (event.target.closest(".details-btn")) {
    console.log("Details:", task);
    return;
  }

  if (event.target.closest(".task-check")) {
    task.done = !task.done;
    commit();
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
