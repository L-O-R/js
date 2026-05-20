let add_task_btn = document.getElementById("add_task_btn")
let dialog_box = document.getElementById("dialog_box")
let task_input = document.getElementById("task-input")
add_task_btn.addEventListener('click', () => dialog_box.close())








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

function render() {
  task_container.innerHTML = "";

  todoList.forEach(
    (task, index) => {
      let li = document.createElement('li')
      li.innerText = task

      let edit_btn = document.createElement('button')
      edit_btn.type = 'button'
      edit_btn.innerText = 'edit'
      edit_btn.addEventListener('click', () => {
        dialog_box.showModal()
        task_input.value = task
      })



      let del_btn = document.createElement('button')
      del_btn.type = 'button'
      del_btn.addEventListener('click', () => {
        let conf = confirm('du u really want to delete the task ?');
        if (conf) {
          // console.log(conf, + "task deleted" + todoList)
          todoList.splice(index, 1)
          // console.log(todoList)
          render()
        }
      })

      del_btn.innerText = 'del'

      li.appendChild(edit_btn)
      li.appendChild(del_btn)

      task_container.appendChild(li)
    }
  )
}



