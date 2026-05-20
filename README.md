**Project Overview**
- **Purpose**: This small repo demonstrates DOM basics and how to manipulate HTML using JavaScript. It contains a minimal task manager where users add tasks via a form and JavaScript updates the page dynamically.
- **Learning goals**: Understand selecting elements, handling events, preventing default form behavior, updating the DOM, and rendering lists.

**Files**
- [index.html](index.html): The page markup and structure for the task manager.
- [script.js](script.js): The JavaScript that implements DOM selection, event handling, and rendering.

**How to run**
- Open [index.html](index.html) in any modern browser (double-click or use a local dev server).
- Type a task into the input and click "Add Task" — the task list updates without a page reload.

**Detailed line-by-line explanation**

Below we explain every line in both project files so you can learn what each part does.

**index.html**

Full source (for reference):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

</head>
<body >
    <main>
        <header>
            <h2>My Task Manager</h2>
        </header>

        <div>
            <form action="">
                <input type="text" placeholder="Enter your task here" id="task-input" >
                <button type="submit">Add Task</button>
            </form>
        </div>

        <div class="task-list">
            <ul id="tasks">
                <!-- Tasks will be added here -->
            </ul>

        </div>
    </main>
<script src="./script.js"></script>
</body>
</html>
```

Line-by-line explanation:

- `<!DOCTYPE html>`: Declares the document is HTML5; helps the browser render in standards mode.
- `<html lang="en">`: Root element; `lang` attribute helps accessibility and search engines know the page language.
- `<head>`: Metadata container (content here is not directly visible on the page).
- `<meta charset="UTF-8">`: Declares the character encoding to UTF-8 so characters render correctly.
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`: Ensures responsive scaling on mobile devices.
- `<title>Document</title>`: Title shown in the browser tab; you can change it to something descriptive like "Task Manager".
- `</head>`: Closes the head section.
- `<body >`: Page body; visible content goes here.
- `<main>`: Semantic container for the main content of the page.
- `<header>`: Semantic header inside the main area.
- `<h2>My Task Manager</h2>`: Heading shown at the top of the page.
- `</header>`: Ends the header.
- `<div>`: Generic container used here to group the form.
- `<form action="">`: The form element groups input controls. The empty `action` means the form won't submit to a server; JavaScript will handle submission. If left empty, browsers default to the current URL — but the script calls `event.preventDefault()` to stop navigation.
- `<input type="text" placeholder="Enter your task here" id="task-input" >`: The text input where users type tasks; the `id` can be used to select this element from JavaScript. `placeholder` gives an in-field hint.
- `<button type="submit">Add Task</button>`: A submit button for the form. When clicked, it triggers the form's `submit` event.
- `</form>`: Closes the form.
- `</div>`: Closes the wrapper `div` around the form.
- `<div class="task-list">`: A container with a class `task-list` for styling or selection.
- `<ul id="tasks">`: An unordered list element where the script will append `<li>` items for each task. The `id` `tasks` is used to select it in JavaScript.
- `<!-- Tasks will be added here -->`: An HTML comment for humans reading the file.
- `</ul>`: Closes the list.
- `</div>`: Closes the `task-list` container.
- `</main>`: Closes the main element.
- `<script src="./script.js"></script>`: Loads the JavaScript file. Placing it before `</body>` ensures the DOM is parsed before the script runs (so `document.querySelector` and `getElementById` can find elements).
- `</body>`: Closes the body element.
- `</html>`: Closes the HTML document.

**script.js**

Full source (for reference):

```javascript
let todoForm = document.querySelector("form")


let todoList = [];
todoForm.addEventListener("submit", (event) => {
  event.preventDefault()
  //  validation
  let task = event.target[0].value

  todoList.push(task);
  render()
  event.target[0].value = ""
})

let task_container = document.getElementById('tasks')

function render(){
  task_container.innerHTML = "";

  todoList.forEach(
    (task) =>{
      let li = document.createElement('li')
      li.innerText = task

      task_container.appendChild(li)
    }
  )
}
```

Line-by-line explanation:

- `let todoForm = document.querySelector("form")`: Selects the first `<form>` element in the document and stores it in the variable `todoForm`. `document.querySelector` returns the first match; useful for CSS selectors.
- (blank line): Improves readability; no effect at runtime.
- `let todoList = [];`: Initializes an empty JavaScript array `todoList` that will hold the user's tasks.
- `todoForm.addEventListener("submit", (event) => {`: Attaches an event listener to the form for the `submit` event. When the user clicks the submit button or presses Enter in the input, this callback runs. The callback receives an `event` object.
- `  event.preventDefault()`: Prevents the browser's default submit behavior (which would reload or navigate the page). This lets JavaScript handle the data without a page reload.
- `  //  validation`: A comment indicating where you could add input validation (e.g., check the input isn't empty). Right now no actual validation code is implemented.
- `  let task = event.target[0].value`: Reads the value of the first form control (index 0) from `event.target`, which is the form element. This retrieves the text the user typed. Note: using `event.target.elements` or `document.getElementById('task-input')` is often clearer than numeric indexes.
- `  todoList.push(task);`: Adds the new task string to the `todoList` array.
- `  render()`: Calls the `render` function to update the DOM and show the current tasks.
- `  event.target[0].value = ""`: Clears the input field after adding the task so the user can type a new task.
- `})`: Closes the `submit` event listener callback.
- (blank line): Readability.
- `let task_container = document.getElementById('tasks')`: Selects the `<ul>` with `id="tasks"` and stores it in `task_container` so the script can add `<li>` items.
- (blank line): Readability.
- `function render(){`: Declares the `render` function which updates the visible task list.
- `  task_container.innerHTML = "";`: Empties the `<ul>` before rendering. This prevents duplicate items when re-rendering the entire list.
- (blank line): Readability.
- `  todoList.forEach(`: Iterates over each item in `todoList`.
- `    (task) =>{`: For each `task` string, run the following arrow-function body.
- `      let li = document.createElement('li')`: Creates a new `<li>` element.
- `      li.innerText = task`: Sets the text content of the `<li>` to the task string. `innerText` preserves simple text; `textContent` is an alternative.
- (blank line): Readability.
- `      task_container.appendChild(li)`: Appends the `<li>` to the `<ul>` so it becomes visible on the page.
- `    }`: Close the arrow function body.
- `  )`: Close `forEach`.
- `}`: Close the `render` function.

**Notes & Improvements**

- Validation: Check for empty strings or whitespace before pushing to `todoList`. Example: `if (!task.trim()) return;` before `todoList.push(task)`.
- Use explicit selectors: Replace `event.target[0]` with `document.getElementById('task-input')` or `todoForm.elements['task-input']` for clarity and stability.
- Persisting data: To keep tasks between page reloads, save `todoList` to `localStorage` and load it on page load.
- Removing items: Add a delete button on each `<li>` and remove the corresponding item from `todoList`, then call `render()`.
- Avoid resetting `innerHTML` repeatedly for large lists — consider updating nodes incrementally or using a document fragment for performance.

**Quick example: simple validation change**

Replace the line `let task = event.target[0].value` and the following `push` with:

```javascript
let input = document.getElementById('task-input')
let task = input.value.trim()
if (!task) return // don't add empty tasks
todoList.push(task)
```

This trims whitespace and prevents empty tasks from being added.

---
