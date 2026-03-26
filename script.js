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
        checkBox.setAttribute("type", "button")
        checkBox.classList.add("task-buttons")
        checkBox.innerText = "✔️"
        checkBox.addEventListener("click", crossTask)

        let deleteButton = document.createElement("button")
        deleteButton.setAttribute("type", "button")
        deleteButton.classList.add("task-buttons")
        deleteButton.innerText = "❌"
        deleteButton.addEventListener("click", removeTask)

        let commentButton = document.createElement("button")
        commentButton.setAttribute("type", "button")
        commentButton.classList.add("task-buttons")
        commentButton.innerText = "✏️"
        commentButton.addEventListener("click", commentTask)
        
        taskCard.append(taskText, checkBox, deleteButton, commentButton)
        taskList.appendChild(taskCard)

        input.value = ""
    }   else {
        alert("type something")
    }
}

const commentTask = function(e) {
    commentDiv.style.display = "block"
    e.target.parentElement.appendChild(commentDiv)
}

const crossTask = function(e) {
    let taskToCross = e.target.parentElement.querySelector("p")
    taskToCross.classList.toggle("task-crossed")
}

const removeTask = function(e) {
    e.target.parentElement.remove()
}

const removeComment = function(e) {
    e.target.parentElement.remove()
}

const submitComment = function(e) {
    const commentDiv = e.target.parentElement
    const commentInput = commentDiv.querySelector(".comment-input")
    const text = commentInput.value.trim()

    if (text === "") return 

    const comment = document.createElement("p")
    comment.innerText = text
    comment.classList.add("comment-created")

    commentDiv.parentElement.appendChild(comment)

    commentDiv.style.display = "none"

    commentInput.value = ""
}

let commentDiv = document.createElement("div")
commentDiv.classList.add("comment-div")
commentDiv.style.display = "none"
    
let commentInput = document.createElement("input")
commentInput.type = "text"
commentInput.placeholder = "write a comment..."
commentInput.classList.add("comment-input")

let submitCommentButton = document.createElement("button")
submitCommentButton.type = "button"
submitCommentButton.classList.add("comment-button")
submitCommentButton.innerText = "✅"
submitCommentButton.addEventListener("click", submitComment)

let removeCommentButton = document.createElement("button")
removeCommentButton.type = "button"
removeCommentButton.classList.add("comment-button")
removeCommentButton.innerText = "⛔️"
removeCommentButton.addEventListener("click", removeComment)

commentDiv.append(commentInput, submitCommentButton, removeCommentButton)


button.addEventListener("click", addTask)