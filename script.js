const form = document.getElementById("taskForm")
const submitButton = document.getElementById("submitButton")
const timeScheduleButton = document.getElementById("timeScheduleButton")
const input = document.getElementById("taskInput")
const taskList = document.getElementById("taskList")
const textarea = document.getElementsByTagName("textarea")
let isScheduleActive = false


// CALENDAR

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


// POPUP CALENDAR

const modal = document.getElementById("calendarModal");
const openBtn = document.getElementById("openCalendarBtn");
const closeBtn = document.getElementById("closeCalendarBtn");

const daysContainer = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

let currentDate = new Date();


// OPEN / CLOSE

openBtn.onclick = () => modal.classList.add("active");
closeBtn.onclick = () => modal.classList.remove("active");


// RENDER POPUP CALENDAR

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


// NAVIGATION
document.getElementById("prevMonth").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
};

document.getElementById("nextMonth").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
};


// INIT

renderCalendar(currentDate);


// -----------TASKS-------------- //

// TASK INPUT CAN SCROLL DOWN AS TEXT EXPANDS

Array.from(textarea).forEach((area) => area.addEventListener("input", () => {
  area.style.height = "auto";
  area.style.height = input.scrollHeight + "px";
  area.classList.remove("error"); 
}));


// ADD A TASK FUNCTION

// =========================
// ADD TASK
// =========================
const addTask = function(e) {
    e.preventDefault();

    if (input.value === "") {
        input.classList.add("error");
        return;
    }

    let taskCard = document.createElement("div");
    taskCard.classList.add("task-card");

    if (isScheduleActive) {
        taskCard.classList.add("schedule-mode");
    }

    let taskMain = document.createElement("div");
    taskMain.classList.add("task-main");

    let taskText = document.createElement("p");
    taskText.innerText = input.value;

    // MAIN BUTTONS
    let mainButtonsDiv = document.createElement("div");
    mainButtonsDiv.classList.add("main-buttons-div");

    // CHECK
    let checkBtn = document.createElement("button");
    checkBtn.type = "button";
    checkBtn.classList.add("main-task-buttons", "check-btn");
    checkBtn.innerHTML = `<span class="material-symbols-outlined">check</span>`;
    checkBtn.addEventListener("click", crossTask);

    // DELETE
    let deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.classList.add("main-task-buttons", "delete-btn");
    deleteBtn.innerHTML = `<span class="material-symbols-outlined">delete</span>`;
    deleteBtn.addEventListener("click", removeTask);

    // EXPAND
    let expandBtn = document.createElement("button");
    expandBtn.classList.add("main-task-buttons", "expand-tasks-btn");
    expandBtn.innerHTML = `<span class="material-symbols-outlined">more_horiz</span>`;
    expandBtn.addEventListener("click", toggleTaskOptions);

    mainButtonsDiv.append(checkBtn, deleteBtn, expandBtn);
    taskMain.append(taskText, mainButtonsDiv);
    taskCard.append(taskMain);
    taskList.append(taskCard);

    input.value = "";
    input.style.height = "40px";
};


// =========================
// TOGGLE EXPAND MENU
// =========================
const toggleTaskOptions = function(e) {

    let taskCard = e.target.closest(".task-card");

    let existing = taskCard.querySelector(".expand-task-div");

    // TOGGLE
    if (existing) {
        existing.remove();
        return;
    }

    let expandTaskDiv = document.createElement("div");
    expandTaskDiv.classList.add("expand-task-div");

    // EDIT
    let editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.classList.add("more-task-buttons", "edit-btn");
    editBtn.innerHTML = `<span class="material-symbols-outlined">edit</span> <p>Edit</p>`;
    editBtn.addEventListener("click", editTask);

    // COMMENT
    let commentBtn = document.createElement("button");
    commentBtn.type = "button";
    commentBtn.classList.add("more-task-buttons", "comment-btn");
    commentBtn.innerHTML = `<span class="material-symbols-outlined">add_comment</span> <p>Add Comment</p>`;
    commentBtn.addEventListener("click", commentTask);

    // SHARE
    let shareBtn = document.createElement("button");
    shareBtn.type = "button";
    shareBtn.classList.add("more-task-buttons", "share-btn");
    shareBtn.innerHTML = `<span class="material-symbols-outlined">send</span> <p>Share</p>`;
    shareBtn.addEventListener("click", shareTask);

    expandTaskDiv.append(editBtn, commentBtn, shareBtn);
    taskCard.append(expandTaskDiv);
};


// =========================
// COMMENT TASK
// =========================
const commentTask = function(e) {

    let taskCard = e.target.closest(".task-card");

    // prevent duplicate comments
    if (taskCard.querySelector(".comment-div")) return;

    let commentDiv = document.createElement("div");
    commentDiv.classList.add("comment-div");

    let commentInput = document.createElement("textarea");
    commentInput.placeholder = "write a comment...";
    commentInput.classList.add("comment-input");

    commentInput.addEventListener("input", () => {
        commentInput.classList.remove("error");
    });

    let buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("comment-buttons-div");

    let submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.classList.add("comment-button");
    submitBtn.innerText = "Add Comment";
    submitBtn.addEventListener("click", submitComment);

    let discardBtn = document.createElement("button");
    discardBtn.type = "button";
    discardBtn.classList.add("comment-button");
    discardBtn.innerText = "Discard";
    discardBtn.addEventListener("click", () => commentDiv.remove());

    buttonsDiv.append(submitBtn, discardBtn);
    commentDiv.append(commentInput, buttonsDiv);

    taskCard.append(commentDiv);
};


// =========================
// CROSS TASK
// =========================
const crossTask = function(e) {

    let task = e.target.closest(".task-card");

    task.classList.toggle("opaque");

    let text = task.querySelector(".task-main p");
    text.classList.toggle("task-crossed");

    // hide expand menu if exists
    let expandMenu = task.querySelector(".expand-task-div");
    if (expandMenu) expandMenu.classList.add("hidden");

    // hide comment if exists
    let comment = task.querySelector(".comment-div");
    if (comment) comment.classList.add("hidden");
};



// REATTACH EVENT LISTENERS
const reattachTaskEvents = function(taskCard) {
    taskCard.querySelector(".check-btn")?.addEventListener("click", crossTask)
    taskCard.querySelector(".delete-btn)")?.addEventListener("click", removeTask)
    taskCard.querySelector(".expand-tasks-btn")?.addEventListener("click", toggleTaskOptions)
    taskCard.querySelector(".task-buttons:nth-child(4)")?.addEventListener("click", removeTask)
    taskCard.querySelector(".task-buttons:nth-child(5)")?.addEventListener("click", shareTask)
}


// =========================
// REMOVE TASK  
// =========================
const removeTask = function(e) {

    let taskCard = e.target.closest(".task-card");

    let originalContent = taskCard.innerHTML;

    taskCard.innerHTML = "";

    let confirmDiv = document.createElement("div");
    confirmDiv.classList.add("confirm-delete");

    let text = document.createElement("p");
    text.innerText = "Are you sure?";

    let yesBtn = document.createElement("button");
    yesBtn.classList.add("new-comment-action-button")
    yesBtn.innerText = "Yes";
    yesBtn.onclick = () => taskCard.remove();

    let noBtn = document.createElement("button");
    noBtn.innerText = "No";
    yesBtn.classList.add("new-comment-action-button")
    noBtn.onclick = () => {
        confirmDiv.remove();
        taskCard.innerHTML = originalContent
    }

    confirmDiv.append(text, yesBtn, noBtn);
    taskCard.append(confirmDiv);
    reattachTaskEvents(taskCard)
};

const shareTask = function(e) {

}

const editTask = function(e) {
    let taskMain = e.target.closest(".task-main")
    let taskTextElement = taskMain.querySelector("p")

    let oldText = taskTextElement.innerText

    // CREATE INPUT
    let editInput = document.createElement("textarea")
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


// ADD EVENT LISTENERS TO MAIN BUTTONS

//Submit new task
submitButton.addEventListener("click", addTask)

//Toggle schedule mode
timeScheduleButton.onclick = function() {

    this.classList.toggle("buttonActive")

    if (!isScheduleActive) {
        isScheduleActive = true
        taskList.classList.add("schedule-mode")
        let taskCard = document.querySelectorAll(".task-card")
        taskCard.forEach((card) => {
            card.classList.add("schedule-mode")
        })
    } else {
        isScheduleActive = false
        taskList.classList.remove("schedule-mode")
        let taskCard = document.querySelectorAll(".task-card")
        taskCard.forEach((card) => {
            card.classList.remove("schedule-mode")
        })
    }  
}