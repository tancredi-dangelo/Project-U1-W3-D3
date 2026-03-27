const form = document.getElementById("taskForm")
const button = document.getElementById("submitButton")
const input = document.getElementById("taskInput")
const taskList = document.getElementById("taskList")

const addTask = function(e) {

    e.preventDefault()

    if (input.value !== "") {

        let inputValue = input.value

        let taskCard = document.createElement("li")
        taskCard.classList.add("task-card")

        let taskMain = document.createElement("div")    // first div of the "li"
        taskMain.classList.add("task-main")

        let taskText = document.createElement("p")      // title of the task
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
        
        taskMain.append(taskText, checkBox, deleteButton, commentButton)
        taskCard.appendChild(taskMain)
        taskList.appendChild(taskCard)

        input.value = ""

    }   else {

        alert("type something")

    }
}

const commentTask = function(e) {

    let commentDiv = document.createElement("div")
    commentDiv.style.display = "none"
    commentDiv.classList.add("comment-div")
        
    let commentInput = document.createElement("input")
    commentInput.type = "text"
    commentInput.placeholder = "write a comment..."
    commentInput.classList.add("comment-input")

    let commentButtonsDiv = document.createElement("div")
    commentButtonsDiv.setAttribute("id", "commentButtonsDiv")

    let submitCommentButton = document.createElement("button")
    submitCommentButton.type = "button"
    submitCommentButton.classList.add("comment-button")
    submitCommentButton.setAttribute("id", "submitComment")
    submitCommentButton.innerText = "Add"
    submitCommentButton.addEventListener("click", submitComment)

    let removeCommentButton = document.createElement("button")
    removeCommentButton.type = "button"
    removeCommentButton.classList.add("comment-button")
    removeCommentButton.setAttribute("id", "discardComment")
    removeCommentButton.innerText = "Discard"
    removeCommentButton.addEventListener("click", removeComment)

    commentButtonsDiv.append(submitCommentButton, removeCommentButton)

    commentDiv.append(commentInput)
        commentDiv.style.display = "block"
        e.target.parentElement.parentElement.append(commentDiv, commentButtonsDiv)
}

const crossTask = function(e) {
    let taskToCross = e.target.parentElement.querySelector("p")
    taskToCross.classList.toggle("task-crossed")
}

const removeTask = function(e) {
    e.target.parentElement.parentElement.remove()
}

const removeComment = function(e) {
    e.target.parentElement.parentElement.querySelector("comment-div").remove()
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



button.addEventListener("click", addTask)