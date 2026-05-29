export function saveDataToLocalStorage(todoListArray) {
      localStorage.setItem('todolist', JSON.stringify(todoListArray))
}

export function getDataFromLocalStorage() {
      return JSON.parse(localStorage.getItem('todolist')) || [];
}