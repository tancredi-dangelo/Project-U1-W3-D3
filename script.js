const form = document.getElementById("taskForm")
const button = document.getElementById("submitButton")
const input = document.getElementById("taskInput")
const taskList = document.getElementById("taskList")

const addTask = function(e) {
    e.preventDefault()
    if (input.value !== "") {
        let inputValue = input.value
        let taskCard = document.createElement("li")

        let taskText = document.createElement("p")
        taskText.innerText = inputValue
        
        let checkBox = document.createElement("button")
        checkBox.setAttribute("id", "taskDone")
        checkBox.innerText = "✔️"
        checkBox.addEventListener("click", crossTask)

        let deleteButton = document.createElement("button")
        deleteButton.setAttribute("id", "deleteButton")
        deleteButton.innerText = "❌"
        deleteButton.addEventListener("click", removeTask)
        
        taskCard.append(taskText, checkBox, deleteButton)
        taskList.appendChild(taskCard)

        input.value = ""
    }   else {
        alert("type something")
    }
}

const crossTask = function(e) {
    let taskToCross = e.target.parentElement.querySelector("p")
    taskToCross.setAttribute("style", "text-decoration: line-through;")
}

const removeTask = function(e) {
    e.target.parentElement.remove()
}

button.addEventListener("click", addTask)