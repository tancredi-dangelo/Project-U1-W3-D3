const submitButton = document.getElementById("submitButton")
const timeScheduleButton = document.getElementById("timeScheduleButton")
const input = document.getElementById("taskInput")
const taskList = document.getElementById("taskList")
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

    // Center selected day
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


// INITIALIZE CALENDAR

renderCalendar(currentDate);




// -----------TASKS-------------- //

// TASK INPUT CAN SCROLL DOWN AS TEXT EXPANDS

const autoResize = (area) => {
  area.addEventListener("input", () => {
    area.style.height = "auto";
    area.style.height = area.scrollHeight + "px";
    area.classList.remove("error");
  });
};

autoResize(input)


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
    checkBtn.innerHTML = `<span class="material-symbols-outlined">check_box</span>`;
    checkBtn.addEventListener("click", crossTask);

    // EXPAND
    let expandBtn = document.createElement("button");
    expandBtn.classList.add("main-task-buttons", "expand-tasks-btn");
    expandBtn.innerHTML = `<span class="material-symbols-outlined">more_horiz</span>`;
    expandBtn.addEventListener("click", toggleTaskOptions);

    mainButtonsDiv.append(checkBtn, expandBtn);
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

    let taskCard = e.currentTarget.closest(".task-card");

    let existingMenu = taskCard.querySelector(".expand-task-div");

    let comments = taskCard.querySelectorAll(".new-comment-div");
    let addCommentDiv = taskCard.querySelector(".add-comment-div");
    let editContainer = taskCard.querySelector(".edit-comment-container");

    // CLOSE MENU
    if (existingMenu) {
        existingMenu.remove();

        // ✅ restore ALL comments
        comments.forEach(c => c.classList.remove("hidden"));

        // ✅ restore input box too (THIS WAS MISSING)
        if (addCommentDiv) addCommentDiv.classList.remove("hidden");
        return;
    }

    // ✅ HIDE ADD-COMMENT-DIV
    if (addCommentDiv) addCommentDiv.classList.add("hidden");


    // CREATE MENU
    let expandTaskDiv = document.createElement("div");
    expandTaskDiv.classList.add("expand-task-div");

    //EDIT
    let editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.classList.add("more-task-buttons", "edit-btn");
    editBtn.innerHTML = `<p>Edit</p>`;
    editBtn.addEventListener("click", editTask);

    //COMMENT
    let commentBtn = document.createElement("button");
    commentBtn.type = "button";
    commentBtn.classList.add("more-task-buttons", "comment-btn");
    commentBtn.innerHTML = `<p>Comment</p>`;
    commentBtn.addEventListener("click", commentTask);

    // ADD TIME
    let addTimeBtn = document.createElement("button");
    addTimeBtn.type = "button";
    addTimeBtn.classList.add("more-task-buttons", "add-time-btn");
    addTimeBtn.innerHTML = `<p>Add Time</p>`;
    addTimeBtn.addEventListener("click", addTimeToTask);

    // MARK IMPORTANT
    let markTaskImportantBtn = document.createElement("button");
    markTaskImportantBtn.type = "button";
    markTaskImportantBtn.classList.add("more-task-buttons", "mark-important-btn");
    markTaskImportantBtn.innerHTML = `<p>Important!</p>`;
    markTaskImportantBtn.addEventListener("click", markTaskImportant);

    //SHARE
    let shareBtn = document.createElement("button");
    shareBtn.type = "button";
    shareBtn.classList.add("more-task-buttons", "share-btn");
    shareBtn.innerHTML = `<p>Share</p>`;
    shareBtn.addEventListener("click", shareTask);

    //DELETE
    let deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.classList.add("more-task-buttons", "delete-btn");
    deleteBtn.innerHTML = `<p>Delete</p>`;
    deleteBtn.addEventListener("click", removeTask);

    expandTaskDiv.append(editBtn, commentBtn, addTimeBtn, markTaskImportantBtn, shareBtn, deleteBtn);

    const secondChild = taskCard.children[1];

    if (secondChild) {
    taskCard.insertBefore(expandTaskDiv, secondChild);
    } else {
    // If there's only 0 or 1 child, just append
    taskCard.appendChild(expandTaskDiv);
    }

};


// =========================
// COMMENT TASK
// =========================
const commentTask = function(e) {

    let taskCard = e.currentTarget.closest(".task-card");

    // close ONLY expand menus (not comments)
    document.querySelectorAll(".expand-task-div").forEach(el => {
        if (!el.classList.contains("add-comment-div") && !el.classList.contains("new-comment-div")) {
            el.classList.add("hidden");
        }
    });

    // prevent multiple input boxes in SAME task (optional but recommended)
    if (taskCard.querySelector(".add-comment-div")) return;

    // ensure comments container exists
    let commentsContainer = taskCard.querySelector(".comments-container");
    if (!commentsContainer) {
        commentsContainer = document.createElement("div");
        commentsContainer.classList.add("comments-container");
        taskCard.appendChild(commentsContainer);
    }

    // CREATE COMMENT INPUT BOX
    let addCommentDiv = document.createElement("div");
    addCommentDiv.classList.add("add-comment-div");

    let commentInput = document.createElement("textarea");
    commentInput.placeholder = "Write a comment...";
    commentInput.classList.add("comment-input");

    autoResize(commentInput);

    commentInput.addEventListener("input", () => {
        commentInput.classList.remove("error");
    });

    let buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("comment-buttons-div");

    let submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.classList.add("comment-button");
    submitBtn.innerText = "Add Comment";

    submitBtn.addEventListener("click", function() {
        let text = commentInput.value.trim();

        if (text === "") {
            commentInput.classList.add("error");
            return;
        }

        // CREATE COMMENT
        let newCommentDiv = document.createElement("div");
        newCommentDiv.classList.add("new-comment-div");

        let newCommentText = document.createElement("p");
        newCommentText.innerText = text;
        newCommentText.classList.add("comment-text");

        let newCommentButtonsDiv = document.createElement("div");
        newCommentButtonsDiv.classList.add("new-comment-buttons-div");

        let modifyBtn = document.createElement("button");
        modifyBtn.innerText = "Edit";
        modifyBtn.classList.add("new-comment-action-buttons");
        modifyBtn.addEventListener("click", modifyComment);

        let deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.classList.add("new-comment-action-buttons");
        deleteBtn.addEventListener("click", deleteComment);

        function updateButtons() {
            const buttons = newCommentButtonsDiv.querySelectorAll("button");

            if (taskCard.classList.contains("disabled-state")) {
                buttons.forEach(btn => btn.disabled = true);
            } else {
                buttons.forEach(btn => btn.disabled = false);
            }
        }

        // Run once immediately
        updateButtons();

        // Observe class changes on taskCard
        const observer = new MutationObserver(updateButtons);
        observer.observe(taskCard, { attributes: true, attributeFilter: ["class"] });

        deleteBtn.addEventListener("click", () => {
            observer.disconnect();6
            deleteComment();
        });


        // append buttons to div
        newCommentButtonsDiv.append(modifyBtn, deleteBtn);
        newCommentDiv.append(newCommentText, newCommentButtonsDiv);

        // append div to container 
        commentsContainer.appendChild(newCommentDiv);

        // remove input box
        addCommentDiv.remove();
    });

    let discardBtn = document.createElement("button");
    discardBtn.type = "button";
    discardBtn.classList.add("comment-button");
    discardBtn.innerText = "Discard";
    discardBtn.addEventListener("click", () => addCommentDiv.remove());

    buttonsDiv.append(submitBtn, discardBtn);
    addCommentDiv.append(commentInput, buttonsDiv);

    // ✅ append input BELOW existing comments
    taskCard.appendChild(addCommentDiv);

    // nice UX
    commentInput.focus();
};


// =========================
// CROSS TASK
// =========================
const crossTask = function(e) {

    let taskCard = e.currentTarget.closest(".task-card");

    taskCard.classList.toggle("opaque");

    let text = taskCard.querySelector(".task-main > p");
    text.classList.toggle("task-crossed");

    // hide expand menu if exists
    let expandMenu = taskCard.querySelector(".expand-task-div");
    if (expandMenu) expandMenu.remove();

    // hide comment if exists
    let comment = taskCard.querySelector(".add-comment-div");
    if (comment) comment.classList.add("hidden");

    // hide expand button 
    taskCard.querySelector(".expand-tasks-btn").classList.toggle("hidden")

    // hide important flag if exist
    let flag = taskCard.querySelector(".important-flag");
    if (flag) flag.classList.toggle("hidden");

    // hide comment buttons
    let commentButtons = taskCard.querySelector(".new-comment-buttons-div")
    if (commentButtons) commentButtons.classList.toggle("hidden")



};



// REATTACH EVENT LISTENERS
const reattachTaskEvents = function(taskCard) {
    taskCard.querySelector(".check-btn")?.addEventListener("click", crossTask)
    taskCard.querySelector(".delete-btn")?.addEventListener("click", removeTask)
    taskCard.querySelector(".expand-tasks-btn")?.addEventListener("click", toggleTaskOptions)
}


// =========================
// REMOVE TASK  
// =========================
const removeTask = function(e) {

    let taskCard = e.target.closest(".task-card");

    // prevent duplicate confirm
    if (taskCard.querySelector(".confirm-delete")) return;

    let taskMain = taskCard.querySelector(".task-main");
    let expandMenu = taskCard.querySelector(".expand-task-div");
    let newCommentDiv = taskCard.querySelectorAll(".new-comment-div")

    let confirmDiv = document.createElement("div");
    confirmDiv.classList.add("confirm-delete");

    let text = document.createElement("p");
    text.innerText = "Are you sure?";

    let yesBtn = document.createElement("button");
    yesBtn.innerText = "Yes";
    yesBtn.classList.add("comment-button");
    yesBtn.onclick = () => taskCard.remove();

    let noBtn = document.createElement("button");
    noBtn.innerText = "No";
    noBtn.classList.add("comment-button");

    noBtn.onclick = () => {
        taskMain.classList.remove("hidden");
        taskCard.querySelectorAll(".new-comment-div").forEach(c => {
            c.classList.remove("hidden");
        });
        confirmDiv.remove();
    };

    // hide content
    taskMain.classList.add("hidden");
    if (expandMenu) expandMenu.classList.add("hidden");

    if (newCommentDiv) newCommentDiv.forEach((div) => div.classList.add("hidden"))

    confirmDiv.append(text, yesBtn, noBtn);
    taskCard.append(confirmDiv);
};

const shareTask = function(e) {

}

//=====================
// MARK TASK IMPORTANT 
//====================
const markTaskImportant = function(e) {

    let taskCard = e.currentTarget.closest(".task-card");
    let taskMain = taskCard.querySelector(".task-main");

    // check if already marked
    let existingFlag = taskMain.querySelector(".important-flag");

    if (existingFlag) {
        existingFlag.remove(); // unmark
        return;
    }

    // create flag
    let exclamationPointDiv = document.createElement("div");
    exclamationPointDiv.classList.add("important-flag");

    let exclamationPoint = document.createElement("p");
    exclamationPoint.innerHTML = `<span class="material-symbols-outlined">exclamation</span>`;

    exclamationPointDiv.append(exclamationPoint);

    // add at top
    taskMain.prepend(exclamationPointDiv);
    taskCard.querySelector(".expand-task-div").classList.toggle("hidden")
};

const addTimeToTask = function(e)  {

}

const editTask = function(e) {

    let taskCard = e.currentTarget.closest(".task-card");
    let taskMain = taskCard.querySelector(".task-main")
    let expandMenu = taskCard.querySelector(".expand-task-div")

    // prevent multiple editors
    if (taskCard.querySelector(".edit-container")) return;

    let taskTextElement = taskMain.querySelector(".task-main > p");
    let oldText = taskTextElement.innerText;

    // CREATE INPUT
    let editInput = document.createElement("textarea");
    editInput.value = oldText;
    editInput.classList.add("edit-input");

    autoResize(editInput)

    // HIDE BUTTONS
    let buttonsDiv = taskMain.querySelector(".main-buttons-div");
    buttonsDiv.classList.add("hidden");

    // HIDE IMPORTANT FLAG
    let importantFlag = taskCard.querySelector(".important-flag")
    if (importantFlag) importantFlag.classList.add("hidden")

    // CREATE BUTTONS DIV
    let editButtonsDiv = document.createElement("div");
    editButtonsDiv.classList.add("comment-buttons-div");

    // SAVE BUTTON
    let saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    saveButton.classList.add("new-comment-action-buttons");

    // CANCEL BUTTON
    let cancelButton = document.createElement("button");
    cancelButton.innerText = "Cancel";
    cancelButton.classList.add("new-comment-action-buttons");

    // CONTAINER
    let editContainer = document.createElement("div");
    editContainer.classList.add("edit-container");
    editContainer.append(editInput, editButtonsDiv);

    // SAVE LOGIC
    saveButton.addEventListener("click", function() {
        let newText = editInput.value.trim();
        if (newText === "") return;

        taskTextElement.innerText = newText;

        taskMain.replaceChild(taskTextElement, editContainer);
        buttonsDiv.classList.remove("hidden");
        if (importantFlag) importantFlag.classList.remove("hidden");
    });

    // CANCEL LOGIC
    cancelButton.addEventListener("click", function() {
        taskMain.replaceChild(taskTextElement, editContainer);
        buttonsDiv.classList.remove("hidden");
        if (importantFlag) importantFlag.classList.remove("hidden")
    });

    editButtonsDiv.append(saveButton, cancelButton);

    // HIDE EXPAND MENU 
    if (expandMenu) expandMenu.classList.add("hidden")

    // REPLACE TEXT WITH INPUT
    taskMain.replaceChild(editContainer, taskTextElement);


    // 👉 auto focus (nice UX)
    editInput.focus();
};


// DELETE COMMENT

const deleteComment = function(e) {
    e.target.parentElement.parentElement.remove()
}


// MODIFY COMMENT

const modifyComment = function(e) {

    let commentContainer = e.currentTarget.closest(".new-comment-div");
    let taskCard = e.currentTarget.closest(".task-card");
    let expandMenu = taskCard.querySelector(".expand-task-div");

    if (!commentContainer) return;

    let textElement = commentContainer.querySelector("p");
    let oldText = textElement.innerText;

    // hide expand menu
    if (expandMenu) expandMenu.classList.add("hidden");

    // prevent duplicate editors
    if (commentContainer.querySelector(".edit-comment-container")) return;

    // CREATE INPUT
    let input = document.createElement("textarea");
    input.value = oldText;
    input.classList.add("comment-input");

    // BUTTONS
    let buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("comment-buttons-div");

    let saveBtn = document.createElement("button");
    saveBtn.innerText = "Save";
    saveBtn.classList.add("new-comment-action-buttons");

    let cancelBtn = document.createElement("button");
    cancelBtn.innerText = "Cancel";
    cancelBtn.classList.add("new-comment-action-buttons");

    // CONTAINER
    let editContainer = document.createElement("div");
    editContainer.classList.add("edit-comment-container");
    editContainer.append(input, buttonsDiv);

    buttonsDiv.append(saveBtn, cancelBtn);

    // HIDE ORIGINAL TEXT + BUTTONS
    textElement.classList.add("hidden");
    let actionButtons = commentContainer.querySelector(".new-comment-buttons-div");
    if (actionButtons) actionButtons.classList.add("hidden");

    commentContainer.append(editContainer);

    // SAVE
    saveBtn.addEventListener("click", () => {
        let newText = input.value.trim();
        if (newText === "") return;

        textElement.innerText = newText;

        editContainer.remove();
        textElement.classList.remove("hidden");
        if (actionButtons) actionButtons.classList.remove("hidden");
    });

    // CANCEL
    cancelBtn.addEventListener("click", () => {
        editContainer.remove();
        textElement.classList.remove("hidden");
        if (actionButtons) actionButtons.classList.remove("hidden");
    });

    // autofocus
    input.focus();
};
    

const submitComment = function(e) {

    let commentDiv = e.target.closest(".add-comment-div")
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

//Toggle time schedule mode
timeScheduleButton.onclick = function (e) {
  e.preventDefault();

  // toggle button style
  timeScheduleButton.classList.toggle("button-active");

  // toggle schedule mode on list
  taskList.classList.toggle("schedule-mode");

  // toggle schedule mode on all cards
  const taskCards = document.querySelectorAll(".task-card");
  taskCards.forEach((card) => {
    card.classList.toggle("schedule-mode");
  });
};