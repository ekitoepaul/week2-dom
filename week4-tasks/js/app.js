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

function createTaskItem(task) {
  const li = template.content.firstElementChild.cloneNode(true);

  li.dataset.id = task.id;
  li.dataset.priority = task.priority;
  li.classList.toggle("done", task.done);

  const title = li.querySelector(".task-title");
  title.textContent = task.title;

  const badge = li.querySelector(".badge");
  badge.textContent = task.priority === "high" ? "High" : "Normal";

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

  tasks.forEach((task) => list.append(createTaskItem(task)));

  const left = tasks.filter((task) => !task.done).length;
  countEl.textContent = `${left} of ${tasks.length} tasks left`;
}

list.addEventListener("click", (event) => {
  const li = event.target.closest(".task");
  if (!li) return;

  const task = tasks.find((item) => item.id === Number(li.dataset.id));
  if (!task) return;

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
    li.classList.toggle("done", task.done);

    const left = tasks.filter((item) => !item.done).length;
    countEl.textContent = `${left} of ${tasks.length} tasks left`;

    console.log("Toggle:", task);
  }
});

renderTasks();
