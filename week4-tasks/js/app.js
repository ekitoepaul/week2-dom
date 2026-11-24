// ---- Storage ----

const STORAGE_KEY = "kazi-list-tasks";

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

// ---- State ----

let tasks = loadTasks();

// ---- Elements ----

const list = document.querySelector("#task-list");
const countEl = document.querySelector("#task-count");
const template = document.querySelector("#task-template");
const clearBtn = document.getElementById("clear-done");
const markAllDoneBtn = document.getElementById("mark-all-done");
const deleteAllBtn = document.getElementById("delete-all");
const statusEl = document.getElementById("status");

// ---- Helpers ----

function setStatus(message) {
  statusEl.textContent = message;
}

function commit() {
  saveTasks();
  renderTasks();
}

// ---- Rendering ----

function createTaskItem(task) {
  const li = template.content.firstElementChild.cloneNode(true);

  li.dataset.id = task.id;
  li.dataset.priority = task.priority;
  li.classList.toggle("done", task.done);

  const title = li.querySelector(".task-title");
  title.textContent = task.title;

  const badge = li.querySelector(".badge");
  badge.textContent = task.priority === "high" ? "High" : "Normal";
  badge.setAttribute(
    "aria-label",
    `Change priority for "${task.title}". Current priority: ${task.priority}`,
  );

  const checkbox = li.querySelector(".task-check");
  checkbox.checked = task.done;
  checkbox.setAttribute("aria-label", `Mark "${task.title}" as done`);

  return li;
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
    setStatus("Delete all cancelled.");
    return;
  }

  tasks = [];
  commit();
}

function startEditing(id) {
  const task = tasks.find((item) => item.id === id);

  if (!task) return;

  console.log("Start editing:", task);
}

// ---- Events ----

clearBtn.addEventListener("click", clearCompleted);
markAllDoneBtn.addEventListener("click", markAllDone);
deleteAllBtn.addEventListener("click", deleteAllTasks);

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
    console.log("Delete:", task);
    return;
  }

  if (event.target.closest(".details-btn")) {
    console.log("Details:", task);
    return;
  }

  if (event.target.closest(".task-check")) {
    task.done = !task.done;
    commit();

    console.log("Toggle:", task);
  }
});

renderTasks();
