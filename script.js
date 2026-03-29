const form = document.getElementById("taskForm")
const button = document.getElementById("submitButton")
const input = document.getElementById("taskInput")
const taskList = document.getElementById("taskList")

input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = input.scrollHeight + "px";
  input.classList.remove("error"); 
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
        checkBox.innerText = `✔️`
        checkBox.addEventListener("click", crossTask)

        let deleteButton = document.createElement("button")
        deleteButton.setAttribute("type", "button")
        deleteButton.classList.add("task-buttons")
        deleteButton.innerText = `❌`
        deleteButton.addEventListener("click", removeTask)

        let editButton = document.createElement("button")
        editButton.setAttribute("type", "button")
        editButton.classList.add("task-buttons")
        editButton.innerText = `✏️`
        editButton.addEventListener("click", editTask)

        let commentButton = document.createElement("button")
        commentButton.setAttribute("type", "button")
        commentButton.classList.add("task-buttons")
        commentButton.innerHTML = `💬`
        commentButton.addEventListener("click", commentTask)

        let shareButton = document.createElement("button")
        shareButton.setAttribute("type", "button")
        shareButton.classList.add("task-buttons")
        shareButton.innerText = `🔗`
        shareButton.addEventListener("click", shareTask)

        taskButtonsDiv.append(checkBox, editButton, commentButton, deleteButton, shareButton)
        taskMain.append(taskText, taskButtonsDiv)
        taskCard.appendChild(taskMain)
        taskList.appendChild(taskCard)

        input.value = ""
        input.style.height = "40px"; // reset height

    }   else {

        input.classList.add("error")

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

    commentInput.addEventListener("input", () => {
        commentInput.classList.remove("error");
    })

    //CREATE COMMENT BUTTONS DIV
    let commentButtonsDiv = document.createElement("div")
    commentButtonsDiv.classList.add("comment-buttons-div")

    //CREATE COMMENT SUBMIT BUTTON
    let submitCommentButton = document.createElement("button")
    submitCommentButton.type = "button"
    submitCommentButton.classList.add("comment-button")
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
    e.target.closest(".task-card").append(commentDiv)
}

const crossTask = function(e) {
    let task = e.target.closest(".task-card")
    let taskToCross = task.querySelector("p")
    taskToCross.classList.toggle("task-crossed")
}

const removeTask = function(e) {
    e.target.closest(".task-card").remove()
}

const shareTask = function(e) {

}

const editTask = function(e) {
    let taskMain = e.target.closest(".task-main")
    let taskTextElement = taskMain.querySelector("p")

    let oldText = taskTextElement.innerText

    // CREATE INPUT
    let editInput = document.createElement("input")
    editInput.type = "text"
    editInput.value = oldText
    editInput.classList.add("comment-input")
    editInput.setAttribute("style", "margin-top: 20px;")

    // HIDE TASK BUTTONS
    taskMain.querySelector(".task-buttons-div").setAttribute("style", "display: none;") 

    // CREATE BUTTONS DIV
    let editButtonsDiv = document.createElement("div")
    editButtonsDiv.classList.add("comment-buttons-div")

    // SAVE BUTTON
    let saveButton = document.createElement("button")
    saveButton.innerText = "Save"
    saveButton.classList.add("new-comment-action-buttons")

    saveButton.addEventListener("click", function() {
        let newText = editInput.value.trim()

        if (newText === "") return

        taskTextElement.innerText = newText

        // restore original UI
        taskMain.replaceChild(taskTextElement, editContainer)
        taskMain.querySelector(".task-buttons-div").setAttribute("style", "display: flex;")
    })

    // CANCEL BUTTON
    let cancelButton = document.createElement("button")
    cancelButton.innerText = "Cancel"
    cancelButton.classList.add("new-comment-action-buttons")

    cancelButton.addEventListener("click", function() {
        taskMain.replaceChild(taskTextElement, editContainer)
        taskMain.querySelector(".task-buttons-div").setAttribute("style", "display: flex;")
    })

    editButtonsDiv.append(saveButton, cancelButton)

    // CONTAINER FOR INPUT + BUTTONS
    let editContainer = document.createElement("div")
    editContainer.append(editInput, editButtonsDiv)

    // REPLACE TEXT WITH INPUT
    taskMain.replaceChild(editContainer, taskTextElement)
}

const discardCommentFunc = function(e) {
    e.target.closest(".comment-div")?.remove()
}

const modifyComment = function(e) {

    // Get the current comment container
    let commentContainer = e.target.closest(".new-comment-div") || e.target.closest(".comment-div")

    // Get existing text
    let oldText = commentContainer.querySelector("p").innerText

    // CREATE COMMENT DIV (same as commentTask)
    let commentDiv = document.createElement("div")
    commentDiv.classList.add("comment-div")

    let commentInput = document.createElement("input")
    commentInput.type = "text"
    commentInput.classList.add("comment-input")
    commentInput.value = oldText  
    commentInput.addEventListener("input", () => {
        commentInput.classList.remove("error");
    });

    let commentButtonsDiv = document.createElement("div")
    commentButtonsDiv.classList.add("comment-buttons-div")

    let submitCommentButton = document.createElement("button")
    submitCommentButton.innerText = "Save"
    submitCommentButton.classList.add("new-comment-action-buttons")
    submitCommentButton.addEventListener("click", submitComment)

    let removeCommentButton = document.createElement("button")
    removeCommentButton.innerText = "Cancel"
    removeCommentButton.classList.add("new-comment-action-buttons")
    removeCommentButton.addEventListener("click", discardCommentFunc)

    commentButtonsDiv.append(submitCommentButton, removeCommentButton)
    commentDiv.append(commentInput, commentButtonsDiv)

    // Replace old comment with editable version
    commentContainer.replaceWith(commentDiv)
}
    

const submitComment = function(e) {

    let commentDiv = e.target.closest(".comment-div")
    let commentInput = commentDiv.querySelector(".comment-input")
    let text = commentInput.value.trim()

    if (text === "") {

        commentInput.classList.add("error")
        return

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