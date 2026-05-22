let add_task_btn = document.getElementById("add_task_btn")
let dialog_box = document.getElementById("dialog_box")
let task_input = document.getElementById("task-input")
let open_dialog_btn = document.getElementById("open_dialog_btn")

// Form reference by id
let todoForm = document.getElementById("todo-form")

let EDITABLE = false
let indexNoToChange = null

let todoList = getDataFromLocalStorage();

// Open modal and reset state to "Add Task" mode
if (open_dialog_btn) {
  open_dialog_btn.addEventListener('click', (event) => {
    // If the browser supports invoker commands naturally, we don't call showModal to avoid double opens
    if (!event.target.closest('button').hasAttribute('command')) {
      dialog_box.showModal()
    }
    // Always reset form state
    EDITABLE = false
    indexNoToChange = null
    add_task_btn.innerText = "Add Task"
    task_input.value = ""
  })
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault()
  
  // Validation: trim input and prevent empty items
  let task = task_input.value.trim()
  if (!task) {
    alert("Please enter a valid task.")
    return
  }

  // edit + add logic
  if (EDITABLE) {
    todoList[indexNoToChange] = task
    EDITABLE = false
    indexNoToChange = null
    add_task_btn.innerText = "Add Task"
    saveDataToLocalStorage(todoList)
  } else {
    todoList.push(task);
    saveDataToLocalStorage(todoList)
  }
  
  render()
  task_input.value = ""
  dialog_box.close() // Automatically close dialog on submit
})

let task_container = document.getElementById('tasks')

function render() {
  task_container.innerHTML = "";
  
  todoList.forEach((task, index) => {
    let li = document.createElement('li')
    
    // Wrap task text in span for cleaner styling and wrapping
    let task_text = document.createElement('span')
    task_text.className = 'task-content'
    task_text.innerText = task
    li.appendChild(task_text)

    // Action buttons container
    let actions_container = document.createElement('div')
    actions_container.className = 'task-actions'

    // Edit button styling
    let edit_btn = document.createElement('button')
    edit_btn.type = 'button'
    edit_btn.className = 'btn-edit'
    edit_btn.innerText = 'Edit'
    edit_btn.addEventListener('click', () => {
      dialog_box.showModal()
      task_input.value = task
      add_task_btn.innerText = "Edit Task"
      EDITABLE = true
      indexNoToChange = index
    })

    // Delete button styling
    let del_btn = document.createElement('button')
    del_btn.type = 'button'
    del_btn.className = 'btn-del'
    del_btn.innerText = 'Delete'
    del_btn.addEventListener('click', () => {
      let conf = confirm('Do you really want to delete this task?');
      if (conf) {
        todoList.splice(index, 1)
        saveDataToLocalStorage(todoList)
        render()
      }
    })

    actions_container.appendChild(edit_btn)
    actions_container.appendChild(del_btn)
    li.appendChild(actions_container)

    task_container.appendChild(li)
  })
}

// Initial render of saved tasks
render()

// Local Storage Helper Functions
function saveDataToLocalStorage(todoListArray) {
  localStorage.setItem('todolist', JSON.stringify(todoListArray))
}

function getDataFromLocalStorage() {
  return JSON.parse(localStorage.getItem('todolist')) || [];
}