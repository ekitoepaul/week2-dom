const tasks = [
  { id: 1, title: "Pay KPLC token", done: false, priority: "high" },
  { id: 2, title: "Buy unga", done: true, priority: "normal" },
  { id: 3, title: "Revise loops", done: false, priority: "high" },
  { id: 4, title: "Call mum", done: false, priority: "normal" },
  {
    id: 5,
    title: "Learn about <b> tags in JavaScript",
    done: false,
    priority: "normal",
  },
];

const list = document.querySelector("#task-list");
const countEl = document.querySelector("#task-count");
const template = document.querySelector("#task-template");
const clearBtn = document.getElementById("clear-done");
const markAllDoneBtn = document.getElementById("mark-all-done");

const STORAGE_KEY = "kazi-list-tasks";

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

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
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
}

function clearCompleted() {
  for (let i = tasks.length - 1; i >= 0; i -= 1) {
    if (tasks[i].done) {
      tasks.splice(i, 1);
    }
  }

  saveTasks();
  renderTasks();
}

function markAllDone() {
  tasks.forEach((task) => {
    task.done = true;
  });

  saveTasks();
  renderTasks();
}

function startEditing(id) {
  const task = tasks.find((item) => item.id === id);

  if (!task) return;

  console.log("Start editing:", task);
}

clearBtn.addEventListener("click", clearCompleted);
markAllDoneBtn.addEventListener("click", markAllDone);

list.addEventListener("click", (event) => {
  const li = event.target.closest(".task");
  if (!li) return;

  const task = tasks.find((item) => item.id === Number(li.dataset.id));
  if (!task) return;

  if (event.target.closest(".badge")) {
    task.priority = task.priority === "high" ? "normal" : "high";

    saveTasks();
    renderTasks();
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

    saveTasks();
    renderTasks();

    console.log("Toggle:", task);
  }
});

renderTasks();
