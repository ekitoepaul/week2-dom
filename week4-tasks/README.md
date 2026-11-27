# Kazi List – Task Management App

## 1. Project overview

Kazi List is a simple task-management web application. It allows a user to add tasks, set a priority and optional due date, mark tasks as completed, search for tasks, and view tasks using filters. The app also displays the current date and time and saves task information in the browser using `localStorage`.

The project is organised into three main files:

```text
kazi-list-updated/
├── index.html       # Page structure and content
├── css/
│   └── styles.css   # Appearance and responsive layout
├── js/
│   └── app.js       # Application behaviour and functionality
└── README.md        # Project documentation
```

## 2. What is `index.html`?

`index.html` is the **structure of the web page**. It contains the HTML elements that the browser displays and that JavaScript uses to interact with the user.

In this project, `index.html`:

- Sets the page title to **Kazi List** and includes the viewport setting for mobile devices.
- Links the stylesheet using `<link rel="stylesheet" href="css/styles.css">`.
- Loads the JavaScript file using `<script src="js/app.js" defer></script>`. The `defer` attribute allows the HTML to be parsed before the script runs.
- Provides the name form and greeting area.
- Provides the search box and task-filter buttons: **All**, **To do**, **Completed**, **Overdue**, **Due today**, and **Due this week**.
- Provides the task list, task summary, and actions for marking all tasks complete, clearing completed tasks, deleting all tasks, and exporting task data.
- Provides the form for adding a task, including its title, priority, and optional due date.
- Defines a `<template>` for the layout of an individual task. JavaScript clones this template whenever it displays a task.

**In simple terms:** HTML provides the page elements and their arrangement. It does not contain most of the task-management logic or visual styling.

## 3. What is `css/styles.css`?

`css/styles.css` controls the **appearance and layout** of Kazi List. CSS makes the HTML page easier to read and use on different screen sizes.

In this project, the stylesheet:

- Sets the general font, text colour, background colour, spacing, and box sizing.
- Styles the main task card and the add-task card.
- Styles forms, text fields, select controls, buttons, filter buttons, and task items.
- Highlights the active filter so the user can see which view is selected.
- Gives high-priority tasks a distinct badge and overdue tasks a red warning style.
- Shows completed task titles with a line through them.
- Adds visible keyboard-focus outlines to inputs, select controls, and buttons to support keyboard navigation.
- Uses a media query (`@media (max-width: 520px)`) to adjust the layout for smaller screens, including phones.

**In simple terms:** CSS controls how the page looks, including colours, sizes, spacing, alignment, and mobile responsiveness. It does not create, save, or filter tasks; those actions are handled by JavaScript.

## 4. What is `js/app.js`?

`js/app.js` contains the **functionality and behaviour** of Kazi List. It uses JavaScript to respond to user actions, update the page, and save information.

The main responsibilities are:

### a. Saving and loading information

- Uses `localStorage` to save and retrieve tasks, the user's name, and the last selected priority.
- Uses `JSON.stringify()` to convert task data into text before saving it.
- Uses `JSON.parse()` to turn saved text back into JavaScript data.
- Uses `try...catch` to handle possible storage or data-reading errors.
- Checks that loaded task data is an array and that each task has the expected basic properties.

### b. Managing application state

The file keeps track of the tasks and the current view using variables such as `tasks`, `userName`, `lastPriority`, and `activeFilter`. The `FILTERS` array lists the filter identifiers recognised by the application:

```js
const FILTERS = ["all", "open", "done", "overdue", "today", "week"];
```

The `week` value is used by the **Due this week** filter.

### c. Working with dates and time

- Displays the current date and a live clock.
- Calculates whether a task is overdue or due today.
- Calculates the current calendar week from Monday to Sunday.
- Uses `isDueThisWeek()` to determine whether a task's due date falls within that week.
- Displays helpful due-date labels, such as “Due today”, “Due tomorrow”, or “Overdue by 2 days”.

### d. Adding and displaying tasks

When a user submits the add-task form, JavaScript reads the title, priority, and optional due date. It creates a task object with an ID, completion status, and creation date, adds it to the `tasks` array, saves the updated array, and refreshes the displayed task list.

The `renderTasks()` function clears the old displayed list and builds it again using the current task data, search text, and selected filter. It also updates the task count, summary, filter-button state, and the enabled or disabled state of list-action buttons.

### e. Searching and filtering

- The search input filters tasks by matching the task title.
- The filter buttons show all tasks, tasks still to do, completed tasks, overdue tasks, tasks due today, or unfinished tasks due during the current Monday-to-Sunday week.
- The filter-button click listener uses event delegation: it checks whether the click came from a button with a `data-filter` attribute.

### f. Keyboard shortcut for search

The document listens for the `/` key. If the user is not already typing in an input, textarea, select control, or editable area, pressing `/` moves focus to the search box. The code calls `event.preventDefault()` so the slash is not entered as search text.

### g. Task actions

JavaScript also handles:

- Marking an individual task as complete or to do.
- Changing a task's priority by clicking its priority badge.
- Editing a task title.
- Viewing task details.
- Deleting an individual task after confirmation.
- Marking all tasks as completed.
- Clearing completed tasks.
- Deleting all tasks after confirmation.
- Exporting the task data as formatted JSON text for copying or backup.

## 5. How the three files work together

The three files have different responsibilities but work together:

1. **HTML (`index.html`)** creates the elements, forms, buttons, task list, and task template.
2. **CSS (`css/styles.css`)** styles those elements and adjusts their layout for different screen sizes.
3. **JavaScript (`js/app.js`)** listens for user actions, updates the HTML, applies search and filters, manages task data, and saves information in the browser.

For example, when a user adds a task:

1. The user enters a task in the form created in `index.html`.
2. JavaScript in `app.js` listens for the form's submit event and creates the task object.
3. JavaScript saves the task in `localStorage` and displays it in the task list.
4. CSS in `styles.css` controls how the new task looks on the page.

## 6. How to run the project

1. Keep the files in the folder structure shown above.
2. Open `index.html` in a modern web browser, or use the **Live Server** extension in Visual Studio Code.
3. Enter your name and save it.
4. Add a task, choose its priority, and optionally select a due date.
5. Try the search box and each filter. Press `/` when you are not typing in another field to jump to search.
6. Refresh the page to confirm that saved tasks and your name are still available in the same browser.

## 7. Important notes

- Tasks and the saved name are stored in the browser's `localStorage`. They are not automatically synchronised between different browsers or devices.
- Clearing browser site data may remove the saved information.
- The **Due this week** filter uses the current calendar week, Monday through Sunday, and shows unfinished tasks with a due date in that period.
- The Export action displays the task data as JSON. Copy it somewhere safe if you want a manual backup.
- Use a modern browser that supports the JavaScript features used in the project.

## 8. Summary

| File             | Main responsibility                               | Easy way to remember     |
| ---------------- | ------------------------------------------------- | ------------------------ |
| `index.html`     | Page structure and content                        | What appears on the page |
| `css/styles.css` | Design, colours, spacing, and responsive layout   | How the page looks       |
| `js/app.js`      | Events, task logic, filtering, clock, and storage | How the page works       |

**Remember:** HTML is the structure, CSS is the presentation, and JavaScript is the behaviour of the Kazi List application.
