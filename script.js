const form = document.getElementById("taskForm")
const submitButton = document.getElementById("submitButton")
const timeScheduleButton = document.getElementById("timeScheduleButton")
const input = document.getElementById("taskInput")
const taskList = document.getElementById("taskList")
const textarea = document.getElementsByTagName("textarea")
// calendar

// =========================
// GLOBAL STATE
// =========================
const calendarTrack = document.querySelector(".calendar-track");

let selectedDate = new Date(); // single source of truth
let selectedQuickDay = null;

// =========================
// QUICK TRACKER
// =========================
const generateCalendar = () => {
    calendarTrack.innerHTML = "";

    const centerDate = new Date(selectedDate);
    const today = new Date();

    for (let i = -14; i <= 14; i++) {
        let date = new Date(centerDate);
        date.setDate(centerDate.getDate() + i);

        let dayDiv = document.createElement("div");
        dayDiv.classList.add("calendar-day");

        let dayName = date.toLocaleDateString("en-US", { weekday: "short" });
        let dayNumber = date.getDate();

        dayDiv.innerHTML = `
            <p>${dayName}</p>
            <strong>${dayNumber}</strong>
        `;

        // 🔴 Always mark TODAY
        if (date.toDateString() === today.toDateString()) {
            dayDiv.classList.add("today-border");
        }

        // 🔵 Selected day
        if (date.toDateString() === selectedDate.toDateString()) {
            dayDiv.classList.add("active");
            selectedQuickDay = dayDiv;
        }

        // Click selection
        dayDiv.addEventListener("click", () => {
            selectedDate = new Date(date);
            generateCalendar(); // re-render & re-center
        });

        dayDiv.dataset.date = date.toDateString();
        calendarTrack.appendChild(dayDiv);
    }

    // 🎯 Center selected day
    setTimeout(() => {
        if (selectedQuickDay) {
            selectedQuickDay.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest"
            });
        }
    }, 50);
};

generateCalendar();

// =========================
// POPUP CALENDAR
// =========================
const modal = document.getElementById("calendarModal");
const openBtn = document.getElementById("openCalendarBtn");
const closeBtn = document.getElementById("closeCalendarBtn");

const daysContainer = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

let currentDate = new Date();

// =========================
// OPEN / CLOSE
// =========================
openBtn.onclick = () => modal.classList.add("active");
closeBtn.onclick = () => modal.classList.remove("active");

// =========================
// RENDER POPUP CALENDAR
// =========================
function renderCalendar(date) {
    daysContainer.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();

    let firstDay = new Date(year, month, 1).getDay();
    firstDay = firstDay === 0 ? 6 : firstDay - 1;

    const lastDate = new Date(year, month + 1, 0).getDate();

    monthYear.textContent = date.toLocaleString("default", {
        month: "long",
        year: "numeric"
    });

    // Weekdays header
    weekDays.forEach(day => {
        const el = document.createElement("div");
        el.innerHTML = `<h4>${day}</h4>`;
        daysContainer.appendChild(el);
    });

    // Empty slots
    for (let i = 0; i < firstDay; i++) {
        daysContainer.appendChild(document.createElement("div"));
    }

    const today = new Date();

    for (let i = 1; i <= lastDate; i++) {
        const day = document.createElement("div");
        day.classList.add("popup-calendar-day");
        day.textContent = i;

        const thisDate = new Date(year, month, i);

        // Today highlight
        if (thisDate.toDateString() === today.toDateString()) {
            day.classList.add("today");
        }

        // Selected highlight (optional but recommended)
        if (thisDate.toDateString() === selectedDate.toDateString()) {
            day.classList.add("active");
        }

        day.onclick = () => {
            selectedDate = new Date(thisDate);

            document.getElementById("selectedDate").value =
                selectedDate.toLocaleDateString();

            modal.classList.remove("active");

            renderCalendar(currentDate);
            generateCalendar(); // 🔥 sync quick tracker
        };

        daysContainer.appendChild(day);
    }
}

// =========================
// NAVIGATION
// =========================
document.getElementById("prevMonth").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
};

document.getElementById("nextMonth").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
};

// =========================
// INIT
// =========================
renderCalendar(currentDate);

// TASK INPUT CAN SCROLL DOWN AS TEXT EXPANDS

Array.from(textarea).forEach((area) => area.addEventListener("input", () => {
  area.style.height = "auto";
  area.style.height = input.scrollHeight + "px";
  area.classList.remove("error"); 
}));


// ADD A TASK FUNCTION

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
        checkBox.classList.add("check-btn")
        checkBox.innerHTML = `<span class="material-symbols-outlined">check</span>`
        checkBox.addEventListener("click", crossTask)

        let deleteButton = document.createElement("button")
        deleteButton.setAttribute("type", "button")
        deleteButton.classList.add("task-buttons")
        deleteButton.innerHTML = `<span class="material-symbols-outlined">delete</span>`
        deleteButton.addEventListener("click", removeTask)

        let editButton = document.createElement("button")
        editButton.setAttribute("type", "button")
        editButton.classList.add("task-buttons")
        editButton.innerHTML = `<span class="material-symbols-outlined">edit</span>`
        editButton.addEventListener("click", editTask)

        let commentButton = document.createElement("button")
        commentButton.setAttribute("type", "button")
        commentButton.classList.add("task-buttons")
        commentButton.innerHTML = `<span class="material-symbols-outlined">add_comment</span>`
        commentButton.addEventListener("click", commentTask)

        let shareButton = document.createElement("button")
        shareButton.setAttribute("type", "button")
        shareButton.classList.add("task-buttons")
        shareButton.innerHTML = `<span class="material-symbols-outlined">send</span>`
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

    let taskCard = e.target.closest(".task-card")

    // prevent duplicates
    if (taskCard.querySelector(".comment-div")) return

    // CREATE COMMENT DIV
    let commentDiv = document.createElement("div")
    commentDiv.style.display = "none"
    commentDiv.classList.add("comment-div")
     
    //CREATE COMMENT INPUT
    let commentInput = document.createElement("textarea")
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
    removeCommentButton.addEventListener("click", deleteComment)


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
    task.classList.toggle("task-done")
}

const removeTask = function(e) {

    let taskCard = e.target.closest(".task-card")

    // Save original content (so we can restore it if "No")
    let originalContent = taskCard.innerHTML

    // Clear the card
    taskCard.innerHTML = ""

    // Create confirmation text
    let confirmText = document.createElement("p")
    confirmText.innerText = "Are you sure?"

    // Buttons container
    let confirmButtons = document.createElement("div")
    confirmButtons.classList.add("comment-buttons-div")

    // YES button
    let yesBtn = document.createElement("button")
    yesBtn.innerText = "Yes"
    yesBtn.classList.add("new-comment-action-buttons")

    yesBtn.addEventListener("click", function() {
        taskCard.remove()
    })

    // NO button
    let noBtn = document.createElement("button")
    noBtn.innerText = "No"
    noBtn.classList.add("new-comment-action-buttons")

    noBtn.addEventListener("click", function() {
        taskCard.innerHTML = originalContent

        // reattach event listeners!
        reattachTaskEvents(taskCard)
    })

    confirmButtons.append(yesBtn, noBtn)
    taskCard.append(confirmText, confirmButtons)
}

const reattachTaskEvents = function(taskCard) {
    taskCard.querySelector(".task-buttons:nth-child(1)")?.addEventListener("click", crossTask)
    taskCard.querySelector(".task-buttons:nth-child(2)")?.addEventListener("click", editTask)
    taskCard.querySelector(".task-buttons:nth-child(3)")?.addEventListener("click", commentTask)
    taskCard.querySelector(".task-buttons:nth-child(4)")?.addEventListener("click", removeTask)
    taskCard.querySelector(".task-buttons:nth-child(5)")?.addEventListener("click", shareTask)
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
    e.target.parentElement.parentElement.remove()
}

const deleteComment = function(e) {
    e.target.parentElement.parentElement.remove()
}

const modifyComment = function(e) {

    // Get the current comment container
    let commentContainer = e.target.closest(".new-comment-div") || e.target.closest(".comment-div")

    // Get existing text
    let oldText = commentContainer.querySelector("p").innerText

    // CREATE COMMENT DIV (same as commentTask)
    let commentDiv = document.createElement("div")
    commentDiv.classList.add("comment-div")

    let commentInput = document.createElement("textarea")
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
    removeCommentButton.addEventListener("click", function() { 
        
        let originalCommentDiv = document.createElement("div")
        originalCommentDiv.classList.add("new-comment-div")

        let originalText = document.createElement("p")
        originalText.innerText = oldText
        originalText.classList.add("comment-created")

        let buttonsDiv = document.createElement("div")
        buttonsDiv.classList.add("new-comment-buttons-div")

        let modifyBtn = document.createElement("button")
        modifyBtn.classList.add("new-comment-action-buttons")
        modifyBtn.innerText = "Modify"
        modifyBtn.addEventListener("click", modifyComment)

        let deleteBtn = document.createElement("button")
        deleteBtn.classList.add("new-comment-action-buttons")
        deleteBtn.innerText = "Delete"
        deleteBtn.addEventListener("click", deleteComment)

        buttonsDiv.append(modifyBtn, deleteBtn)
        originalCommentDiv.append(originalText, buttonsDiv)

        // restore original comment
        commentDiv.replaceWith(originalCommentDiv)
        }

    )

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
        deleteCommentButton.addEventListener("click", deleteComment)


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

submitButton.addEventListener("click", addTask)
timeScheduleButton.onclick = function() {
    this.classList.toggle("buttonActive")
}