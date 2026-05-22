# ✨ Taskly: Build a Task Manager from Scratch

Welcome to **Taskly**! This repository is a beginner-friendly project designed to teach you the fundamentals of modern frontend web development.

> [!NOTE]
> **Main Focus**: This project and step-by-step guide focus primarily on **HTML structure** and **JavaScript logic**. The CSS styling (`style.css`) is provided to give the application a premium look, but styling concepts and techniques are not the main focus of this tutorial.

By building this project, you will learn how to:

1. **Structure webpages** using Semantic HTML5 and `<dialog>` modals.
2. **Add behavior** using JavaScript (handling event listeners, arrays, and DOM manipulation).
3. **Persist data** across page reloads using the browser's `localStorage` API.

---

## 📁 Project Architecture
The project is built using only three files:
- **`index.html`** — Holds the page structure, UI components, and the modal dialog skeleton.
- **`style.css`** — Houses our stylesheet, layout styles, and color variables.
- **`script.js`** — Handles adding, editing, deleting, rendering, and saving tasks.

---

## 🛠️ Step-by-Step Build Guide

### Phase 1: Structure the Interface (`index.html`)
Open [index.html](index.html) to see the markup. Here is how it is structured:

1. **Header & Trigger**: A `<header>` holding the title and the "Add Task" button.
2. **Task List Area**: A `<main>` container with a `<ul id="tasks">` where our task items are added dynamically by JavaScript.
3. **Task Creation Modal (`<dialog>`)**: 
   - We use the native HTML `<dialog>` element.
   - We trigger and close it using modern HTML **Invoker Commands** (`command="show-modal"` and `commandfor="dialog_box"`) which lets the browser open and close the modal without writing manual JS trigger scripts.

#### Complete `index.html` Code:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Taskly // Task Manager</title>
    <!-- Google Fonts for premium typography -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./style.css">
</head>
<body>
    <!-- Background decorative blobs -->
    <div class="bg-blob blob-1"></div>
    <div class="bg-blob blob-2"></div>
    <div class="bg-blob blob-3"></div>

    <!-- Main Container -->
    <main class="glass-container">
        <header class="app-header">
            <h2>My Task Manager</h2>
            <button class="btn btn-primary" command="show-modal" commandfor="dialog_box">
                <span class="btn-icon">+</span> Add Task
            </button>
        </header>

        <div class="task-list">
            <ul id="tasks">
                <!-- Tasks will be added dynamically here -->
            </ul>
        </div>
    </main>

    <!-- Modal dialog box -->
    <dialog id="dialog_box" class="glass-dialog">
        <div class="dialog-content">
            <header class="dialog-header">
                <h3>Create New Task</h3>
                <button class="btn-close" commandfor="dialog_box" command="close" aria-label="Close dialog">×</button>
            </header>
            <form action="" id="todo-form">
                <div class="form-group">
                    <input type="text" placeholder="Enter your task here..." id="task-input" required autocomplete="off">
                </div>
                <div class="form-actions">
                    <button type="submit" id="add_task_btn" class="btn btn-primary btn-block">Add Task</button>
                </div>
            </form>
        </div>
    </dialog>
    <script src="./script.js"></script>
</body>
</html>
```

---

### Phase 2: Implement the Application Logic (`script.js`)
Open [script.js](script.js). Let's explain how the code manages state, handles forms, and performs CRUD operations.

#### 1. DOM Elements & State Setup
We fetch DOM handles using `document.getElementById` and fetch our saved list (or default to an empty array) from local storage. We also add an event listener to the "Add Task" button on the main container to reset the modal state to "Add Task" mode (preventing residual "Edit Task" state if the user cancels an edit).

```javascript
let add_task_btn = document.getElementById("add_task_btn");
let dialog_box = document.getElementById("dialog_box");
let task_input = document.getElementById("task-input");
let open_dialog_btn = document.getElementById("open_dialog_btn");
let todoForm = document.getElementById("todo-form");
let task_container = document.getElementById('tasks');

let EDITABLE = false;          // True when we are in edit mode
let indexNoToChange = null;    // Tracks index of task being edited
let todoList = getDataFromLocalStorage();

// Open modal and reset state to "Add Task" mode
if (open_dialog_btn) {
  open_dialog_btn.addEventListener('click', (event) => {
    // If the browser supports invoker commands naturally, we don't call showModal to avoid double opens
    if (!event.target.closest('button').hasAttribute('command')) {
      dialog_box.showModal();
    }
    // Always reset form state
    EDITABLE = false;
    indexNoToChange = null;
    add_task_btn.innerText = "Add Task";
    task_input.value = "";
  });
}
```

#### 2. Managing Form Submission (Adding or Editing)
When the user submits the form, we:
- Call `event.preventDefault()` to stop the browser from refreshing the page.
- Grab the trimmed input text. If it is empty, we abort.
- If in editing mode (`EDITABLE = true`), we overwrite the value at `todoList[indexNoToChange]`, reset variables, and change the button label back to "Add Task".
- If in regular mode, we push the new task to the array.
- Save to localStorage, render the list, empty the text input, and close the dialog modal.

```javascript
todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let task = task_input.value.trim();
  if (!task) return;

  if (EDITABLE) {
    todoList[indexNoToChange] = task;
    EDITABLE = false;
    indexNoToChange = null;
    add_task_btn.innerText = "Add Task";
  } else {
    todoList.push(task);
  }
  
  saveDataToLocalStorage(todoList);
  render();
  task_input.value = "";
  dialog_box.close();
});
```

#### 3. Dynamic DOM Rendering (Read, Update, Delete)
Instead of hardcoding HTML structure, JavaScript builds each task item inside the `render()` function:
- We clear `task_container.innerHTML = ""` to start fresh.
- We loop through `todoList` using `forEach`.
- For each task, we create a list item (`<li>`) and wrap the text in a `<span class="task-content">`.
- We create an **Edit** and **Delete** button:
  - **Edit Button Listener**: Triggers the modal dialog, populates the input with the current task text, sets the button to say "Edit Task", and enables `EDITABLE = true`.
  - **Delete Button Listener**: Confirms the delete action. If approved, removes the task from the array using `todoList.splice(index, 1)`, updates storage, and triggers a re-render.
- We append elements into the DOM tree.

```javascript
function render() {
  task_container.innerHTML = "";
  
  todoList.forEach((task, index) => {
    let li = document.createElement('li');
    
    let task_text = document.createElement('span');
    task_text.className = 'task-content';
    task_text.innerText = task;
    li.appendChild(task_text);

    let actions_container = document.createElement('div');
    actions_container.className = 'task-actions';

    // Edit Button
    let edit_btn = document.createElement('button');
    edit_btn.className = 'btn-edit';
    edit_btn.innerText = 'Edit';
    edit_btn.addEventListener('click', () => {
      dialog_box.showModal();
      task_input.value = task;
      add_task_btn.innerText = "Edit Task";
      EDITABLE = true;
      indexNoToChange = index;
    });

    // Delete Button
    let del_btn = document.createElement('button');
    del_btn.className = 'btn-del';
    del_btn.innerText = 'Delete';
    del_btn.addEventListener('click', () => {
      if (confirm('Do you really want to delete this task?')) {
        todoList.splice(index, 1);
        saveDataToLocalStorage(todoList);
        render();
      }
    });

    actions_container.appendChild(edit_btn);
    actions_container.appendChild(del_btn);
    li.appendChild(actions_container);
    task_container.appendChild(li);
  });
}
```

#### 4. Local Storage Engine
`localStorage` only stores strings. We use `JSON.stringify` to transform our array into a JSON string before saving, and `JSON.parse` to turn it back into a JavaScript array when reading:
```javascript
function saveDataToLocalStorage(todoListArray) {
  localStorage.setItem('todolist', JSON.stringify(todoListArray));
}

function getDataFromLocalStorage() {
  return JSON.parse(localStorage.getItem('todolist')) || [];
}
```

---

## 🚀 How to Run the App
Since this is a standard client-side project, you do not need to build, install, or run anything from the command line!
1. Double-click [index.html](index.html) to open it in your browser.
2. Alternatively, if you use VS Code, right-click `index.html` and choose **Open with Live Server** to run it on a local port.

---

## 🌟 Challenges for Beginners
Ready to level up? Try adding these features on your own:
- **Task Checkboxes**: Add a checkbox next to each task to mark them as "completed". Apply a line-through styling (`text-decoration: line-through`) to completed tasks.
- **Priority Badges**: Add a priority selector (Low, Medium, High) in the dialog modal and display color-coded tags on each task.
- **Theme Switcher**: Add a button to toggle between a light theme and a sleek dark theme by swapping out the CSS root variables.
