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