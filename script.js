const form = document.getElementById("taskForm")
const button = document.getElementById("submitButton")
const input = document.getElementById("taskInput")
const taskList = document.getElementById("taskList")

taskInput.addEventListener("input", () => {
  taskInput.style.height = "auto";              // reset height
  taskInput.style.height = taskInput.scrollHeight + "px"; // expand
});

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

        let taskButtonsDiv = document.createElement("div") // buttons div
        taskButtonsDiv.classList.add("task-buttons-div")
        
        let checkBox = document.createElement("button") 
        checkBox.setAttribute("type", "button")
        checkBox.classList.add("task-buttons")
        checkBox.innerHTML = `<span class="material-symbols-outlined">
check
</span>`
        checkBox.addEventListener("click", crossTask)

        let deleteButton = document.createElement("button")
        deleteButton.setAttribute("type", "button")
        deleteButton.classList.add("task-buttons")
        deleteButton.innerHTML = `<ion-icon name="close"></ion-icon>`
        deleteButton.addEventListener("click", removeTask)

        let commentButton = document.createElement("button")
        commentButton.setAttribute("type", "button")
        commentButton.classList.add("task-buttons")
        commentButton.innerHTML = `<ion-icon name="pencil" style="font-size: 20px"></ion-icon>`
        commentButton.addEventListener("click", commentTask)

        let shareButton = document.createElement("button")
        shareButton.setAttribute("type", "button")
        shareButton.classList.add("task-buttons")
        shareButton.innerHTML = `<ion-icon name="share-social-outline"></ion-icon>`
        shareButton.addEventListener("click", shareTask)

        taskButtonsDiv.append(checkBox, commentButton, deleteButton, shareButton)
        taskMain.append(taskText, taskButtonsDiv)
        taskCard.appendChild(taskMain)
        taskList.appendChild(taskCard)

        input.value = ""
        input.style.height = "40px"; // reset height

    }   else {

        input.setAttribute("style", "border: 1px solid red;")
        input.setAttribute("style", "box-shadow: 0 0 5px 1px red;")

    }
}

const commentTask = function(e) {

    // CREATE COMMENT DIV
    let commentDiv = document.createElement("div")
    commentDiv.style.display = "none"
    commentDiv.classList.add("comment-div")
     
    //CREATE COMMENT INPUT
    let commentInput = document.createElement("input")
    commentInput.type = "text"
    commentInput.placeholder = "write a comment..."
    commentInput.classList.add("comment-input")
    commentInput.setAttribute("id", "commentInput")

    //CREATE COMMENT BUTTONS DIV
    let commentButtonsDiv = document.createElement("div")
    commentButtonsDiv.classList.add("comment-buttons-div")

    //CREATE COMMENT SUBMIT BUTTON
    let submitCommentButton = document.createElement("button")
    submitCommentButton.type = "button"
    submitCommentButton.classList.add("comment-button")
    submitCommentButton.setAttribute("id", "submitComment")
    submitCommentButton.innerText = "Add"
    submitCommentButton.addEventListener("click", submitComment)

    //CREATE DISCARD COMMENT BUTTON
    let removeCommentButton = document.createElement("button")
    removeCommentButton.type = "button"
    removeCommentButton.classList.add("comment-button")
    removeCommentButton.setAttribute("id", "discardComment")
    removeCommentButton.innerText = "Discard"
    removeCommentButton.addEventListener("click", discardCommentFunc)


    // APPEND ELEMENTS TO COMMENT DIV
    commentButtonsDiv.append(submitCommentButton, removeCommentButton)

    commentDiv.append(commentInput, commentButtonsDiv)
        commentDiv.style.display = "block"
        e.target.parentElement.parentElement.parentElement.append(commentDiv)
}

const crossTask = function(e) {
    let taskToCross = e.target.parentElement.parentElement.querySelector("p")
    taskToCross.classList.toggle("task-crossed")
}

const removeTask = function(e) {
    e.target.parentElement.parentElement.parentElement.remove()
}

const shareTask = function(e) {

}

const discardCommentFunc = function(e) {
    e.target.parentElement.parentElement.remove()
}

const modifyComment = function(e) {

    // Get the current comment container
    let commentContainer = e.target.parentElement.parentElement

    // Get existing text
    let oldText = commentContainer.querySelector("p").innerText

    // CREATE COMMENT DIV (same as commentTask)
    let commentDiv = document.createElement("div")
    commentDiv.classList.add("comment-div")

    let commentInput = document.createElement("input")
    commentInput.type = "text"
    commentInput.classList.add("comment-input")
    commentInput.setAttribute("id", "commentInput")
    commentInput.value = oldText  

    let commentButtonsDiv = document.createElement("div")
    commentButtonsDiv.classList.add("comment-buttons-div")

    let submitCommentButton = document.createElement("button")
    submitCommentButton.innerText = "Save"
    submitCommentButton.classList.add("new-comment-action-buttons")
    submitCommentButton.addEventListener("click", submitComment)

    let removeCommentButton = document.createElement("button")
    removeCommentButton.innerText = "Discard"
    removeCommentButton.classList.add("new-comment-action-buttons")
    removeCommentButton.addEventListener("click", discardCommentFunc)

    commentButtonsDiv.append(submitCommentButton, removeCommentButton)
    commentDiv.append(commentInput, commentButtonsDiv)

    // Replace old comment with editable version
    commentContainer.replaceWith(commentDiv)
}
    

const submitComment = function(e) {

    let commentDiv = e.target.parentElement.parentElement
    let commentInput = commentDiv.querySelector(".comment-input")
    let text = commentInput.value.trim()

    if (text === "") {

        commentInput.setAttribute("style", "border: 2px solid red;")

    } else {

        //CREATE NEW COMMENT TEXT
        let newCommentDiv = document.createElement("div")
        newCommentDiv.classList.add("new-comment-div")

        let newCommentText = document.createElement("p")
        newCommentText.innerText = text
        newCommentText.classList.add("comment-created")

        //CREATE NEW COMMENT BUTTONS
        let newCommentButtonsDiv = document.createElement("div")
        newCommentButtonsDiv.classList.add("new-comment-buttons-div")

        let modifyCommentButton = document.createElement("button")
        modifyCommentButton.classList.add("new-comment-action-buttons")
        modifyCommentButton.innerText = "Modify"
        modifyCommentButton.addEventListener("click", modifyComment)

        let deleteCommentButton = document.createElement("button")
        deleteCommentButton.classList.add("new-comment-action-buttons")
        deleteCommentButton.innerText = "Delete"
        deleteCommentButton.addEventListener("click", discardCommentFunc)


        //APPENDING ELEMENTS TO THEIR DIV
        newCommentButtonsDiv.append(modifyCommentButton, deleteCommentButton)

        newCommentDiv.append(newCommentText, newCommentButtonsDiv)

        commentDiv.parentElement.appendChild(newCommentDiv)

        //REMOVING ADD-COMMENT DIV
        commentDiv.remove()

        //RESET COMMENT INPUT VALUE
        commentInput.value = ""

    }

}

button.addEventListener("click", addTask)