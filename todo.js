const saveButton = document.getElementById("saveButton");
const deleteButton = document.getElementById("deleteButton");
// var inputText = document.getElementById("inputText");
const taskList = document.getElementById("taskList");
const notice = document.getElementById("notice");
const dueDate = document.getElementById("dueDate");
const taskTitle = document.getElementById("taskTitle");
const taskContent = document.getElementById("taskContent");
const category = document.getElementById("category");
const priority = document.getElementById("priority");
const filterDueDateStart = document.getElementById("filterDueDateStart");
const filterDueDateEnd = document.getElementById("filterDueDateEnd");
const filterCategory = document.getElementById("filterCategory");
const filterPriority = document.getElementById("filterPriority");
const sortBy = document.getElementById("sortBy");
const showBacklogs = document.getElementById("showBacklogs");
const inputTags = document.getElementById("inputTags");
const addbut = document.getElementById("to_add");

addbut.addEventListener('click',function (){
  const contt = document.getElementById("container");
const adding_task = document.getElementById("abc");
  contt.style.display="flex";
  adding_task.style.display="none";
});

var tasks = []; // Array of Objects to store tasks
var count = 0; // To store unique id for every task

// Search Function

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", function () {
  logActivity(`Searched for: ${searchInput.value}`);
  renderTasks();
});

//Activity Log

const activityLogButton = document.getElementById("activityLogButton");

activityLogButton.addEventListener("click", function () {
  showActivityLog();
});

// Home Navigation

const homeButton = document.getElementById("homeButton");

homeButton.addEventListener("click", function () {
  var act_log = document.getElementById("logss");
  act_log.style.display = "none";
  var cont = document.getElementById("to_hide");
  cont.style.display = "block";
});


function showActivityLog() {
  const activityLogs = getFromLocalStorage("activityLogs");
  let logText = "Activity Log:\n\n";
  if (activityLogs && activityLogs.length > 0) {
    activityLogs.forEach((log, index) => {
      logText += `${index + 1}. ${log}\n`;
    });
  } else {
    logText += "No activity logs yet.";
  }
  var act_log = document.getElementById("logss");
  act_log.textContent = logText;
  act_log.style.display = "flex";
  var cont = document.getElementById("to_hide");
  cont.style.display = "none";
}

function logActivity(activity) {
  const activityLogs = getFromLocalStorage("activityLogs") || [];
  activityLogs.push(activity + "  " + new Date().toLocaleString());
  saveToLocalStorage("activityLogs", activityLogs);
}

// Saving and Retrieving Logs from Local Storage

function getFromLocalStorage(key) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}



//Drag Functionality

let draggedTask;

function dragStart(event) {
  draggedTask = event.target;
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const dropTarget = event.target;
  const taskList = document.getElementById("taskList");

  if (dropTarget.classList.contains("task-item")) {
    taskList.insertBefore(draggedTask, dropTarget); // Move the dragged task before the drop target
  } else if (dropTarget.classList.contains("task-container")) {
    taskList.appendChild(draggedTask); // Move the dragged task to the end of the container
  }

  // Reorder the tasks in the tasks array based on their new order in the task list

  const updatedTasks = [];
  taskList.querySelectorAll(".task-item").forEach((taskItem) => {
    const taskId = parseInt(taskItem.id.split("-")[1]);
    const task = tasks.find((t) => t.id === taskId);
    updatedTasks.push(task);
  });
  tasks = updatedTasks;

  saveNotes();
}

// Filter Functionality

[filterDueDateStart, filterDueDateEnd, filterCategory, filterPriority].forEach((filter) => {
  filter.addEventListener("change", () => {
    renderTasks();
  });
});

//Sort functionality

sortBy.addEventListener("change", () => {
  renderTasks();
});

//Search functionality

searchInput.addEventListener("input", () => {
  renderTasks();
});

//Backlog section

showBacklogs.addEventListener("change", () => {
  renderTasks();
});

// Save notes to Local Storage and count as well for unique id
function saveNotes() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("count", JSON.stringify(count));
}

// Preserve tasks and logs from local storage on reloading

window.addEventListener('load', function () {
  var storedNotes = localStorage.getItem("tasks");
  var storedCount = localStorage.getItem("count");
  if (storedNotes) {
    tasks = JSON.parse(storedNotes);
    count = JSON.parse(storedCount);
  }
  fetchLocalNotes();
});

//fetch local notes

function fetchLocalNotes() {
  var storedNotes = localStorage.getItem("tasks");
  if (storedNotes) {
    tasks = JSON.parse(storedNotes);
    renderTasks();
  }
}

//Filter Function. This will include Search and Backlog functionality as well.

function applyFilters() {
  const filterDueDateStart = document.getElementById("filterDueDateStart").value;
  const filterDueDateEnd = document.getElementById("filterDueDateEnd").value;
  const filterCategory = document.getElementById("filterCategory").value;
  const filterPriority = document.getElementById("filterPriority").value;
  const showBacklogs = document.getElementById("showBacklogs").checked;
  const searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();
  //   return (showBacklogs && !task.done && dueDate < currentDate);

  const filteredTasks = tasks.filter((task) => {
    const dueDateMatch = !filterDueDateStart || !filterDueDateEnd || (
      task.dueDate >= filterDueDateStart && task.dueDate <= filterDueDateEnd
    );
    const categoryMatch = !filterCategory || task.category === filterCategory;
    const priorityMatch = !filterPriority || task.priority === filterPriority;

    const dueDate = new Date(task.dueDate);
    const currentDate = new Date();
    const blmatch = !showBacklogs || (showBacklogs && !task.done && dueDate < currentDate);

    const searching = !searchTerm || task.content.toLowerCase().includes(searchTerm) || task.title.toLowerCase() === searchTerm || (task.subtasks.some((subtask) => subtask.title.toLowerCase().includes(searchTerm))) || task.title.toLowerCase().includes(searchTerm) || task.tags.some((tag) => tag.toLowerCase().includes(searchTerm))

    return searching && blmatch && dueDateMatch && categoryMatch && priorityMatch;
  });

  return filteredTasks;
}

// Save Button Event Listener

saveButton.addEventListener("click", () => {
  const contt = document.getElementById("container");
const adding_task = document.getElementById("abc");
  contt.style.display="none";
  adding_task.style.display="flex";
  const title = taskTitle.value.trim();
  const content = taskContent.value.trim();
  let date = "";
  if (dueDate.value != "") {
    date = dueDate.value;
  }
  else {
    date = parseDueDateFromText(content);
  }
  var tags = inputTags.value.trim();
  // const date= dueDate.value;
  const cat = category.value;
  const prio = priority.value;



  if (title !== "" && content != "") {
    const newTask = {
      title: title,
      dueDate: date,
      category: cat,
      content: content,
      priority: prio,
      done: false,
      id: ++count,
      tags: tags.split(",").map(tag => tag.trim()),
      subtasks: [],
    };

    tasks.push(newTask);
    logActivity(`Added task: ${title}`);
    // console.log(`Added task: ${newTask}`);
    renderTasks();
    saveNotes();
    taskTitle.value = "";
    taskContent.value = "";
    dueDate.value = "";
    inputTags.value = "";
    category.value = "personal";
    priority.value = "low";

  }
  
});

// Delete function using task Id

function deleteTask(taskId) {
  var task = tasks.find(function (task) {
    return task.id === taskId;
  });
  logActivity(`Deleted task: ${task.title}`);
  tasks = tasks.filter(function (task) {
    return task.id !== taskId;
  });

  renderTasks();
  saveNotes();
}

// Edit Functionality. Editing Tasks in a form like structure

function showEditForm(task) {
  const form = document.createElement("form");

  const titleInput = createInputField("text", "title", "Task Title", task.title);
  const dueDateInput = createInputField("date", "dueDate", "Due Date", task.dueDate);
  const categoryInput = createInputField("text", "category", "Category", task.category);
  const priorityInput = createInputField("text", "priority", "Priority (low, medium, high)", task.priority);
  const contentInput = createInputField("text", "content", "Task Content", task.content);
 
  const submitButton = document.createElement("button");
  submitButton.type = "button";
  submitButton.textContent = "Save";
  submitButton.classList.add("btn");
  submitButton.addEventListener("click", function () {
    logActivity(`Edited task: ${task.title}`);
    editTask(task.id, form); 
  });

  
  form.appendChild(titleInput);
  form.appendChild(contentInput);
  form.appendChild(dueDateInput);
  form.appendChild(categoryInput);
  form.appendChild(priorityInput);
  form.appendChild(submitButton);

  
  taskList.innerHTML = "";
  const headed=document.createElement("h1");
  headed.textContent="TASKS";
  headed.style.alignSelf="center";
  taskList.appendChild(headed);
  taskList.appendChild(form);
}
function createInputField(type, name, placeholder, value) {
  const input = document.createElement("input");
  input.type = type;
  input.name = name;
  input.placeholder = placeholder;
  input.value = value;
  input.classList.add("form-input");
  return input;
}

//edittask function

function editTask(taskId, form) {
  const task = tasks.find((task) => task.id === taskId);

  task.title = form.title.value;
  task.dueDate = form.dueDate.value;
  task.category = form.category.value;
  task.priority = form.priority.value;
  task.content = form.content.value;

  saveNotes(); 

  // Recreate the task item with the updated details
  const taskItem = document.createElement("div");

  taskItem.classList.add("task-item");
  taskItem.id = "task-" + task.id;
  taskItem.draggable = "true";
  taskItem.addEventListener("dragstart", dragStart);
  taskItem.addEventListener("dragover", dragOver);
  taskItem.addEventListener("drop", drop);

  // Create and append the reminder text

  if (task.priority === "high") {
    taskItem.classList.add("high-priority");
    const reminderText = document.createElement("div");
    reminderText.textContent = "Important";
    reminderText.classList.add("reminder");
    taskItem.appendChild(reminderText);

    setTimeout(() => {
      taskItem.removeChild(reminderText);
    }, 5000);
  }
  if (task.subtasks) {
    
    const subtaskList = document.createElement("div");
    subtaskList.classList.add("subtask-list");

    
    task.subtasks.forEach(function (subtask) {
      const subtaskItem = document.createElement("div");
      subtaskItem.classList.add("subtask-item");

      const subtaskTextElem = document.createElement("div");
      subtaskTextElem.textContent = subtask.title;
      subtaskTextElem.classList.add("subtask-text");

      const subtaskCheckbox = document.createElement("input");
      subtaskCheckbox.type = "checkbox";
      subtaskCheckbox.checked = subtask.done;
      subtaskCheckbox.addEventListener("change", () => {
        subtask.done = subtaskCheckbox.checked;
        saveNotes();
        renderTasks();
      });

      subtaskItem.appendChild(subtaskCheckbox);
      subtaskItem.appendChild(subtaskTextElem);
      subtaskList.appendChild(subtaskItem);
    });
    taskItem.appendChild(subtaskList);
  }

  
  var subTaskInput = document.createElement("input");
  subTaskInput.type = "text";
  subTaskInput.placeholder = "Enter subtask";
  var addSubtaskButton = document.createElement("button");
  addSubtaskButton.classList.add("subTask-button", "btn");
  addSubtaskButton.textContent = "Add SubTask";

  addSubtaskButton.addEventListener("click", function () {

    const subtaskTitle = subTaskInput.value.trim();

    if (subtaskTitle !== "") {
      addSubtask(task.id, subtaskTitle);
      subTaskInput.value = ""; 
    }
    logActivity(`Added subtask to task: ${task.title}`);
  });

  // Tags

  if (task.tags && task.tags.length > 0) {
    const tagsContainer = document.createElement("div");
    tagsContainer.classList.add("tags");
    task.tags.forEach(tag => {
      const tagElem = document.createElement("span");
      tagElem.textContent = tag;
      tagsContainer.appendChild(tagElem);
    });
    taskItem.appendChild(tagsContainer);
  }

  var taskTextElem = document.createElement("div");
  taskTextElem.classList.add("task-text");
  taskTextElem.textContent = task.id + ". " + `${task.title} - Due: ${task.dueDate} - Category: ${task.category} - Priority: ${task.priority} \n ${task.content}`;

  //Edit

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.classList.add("edit-button", "btn");
  editButton.addEventListener("click", function () {
    showEditForm(task); 
  });

  //mark_done/undone_checkbox

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.addEventListener("change", () => {
    task.done = checkbox.checked;
    renderTasks();
    saveNotes();
  });

  //delete button for  each task

  var deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button", "btn");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", function () {
    deleteTask(task.id);
  });



  taskItem.appendChild(taskTextElem);

  taskItem.appendChild(editButton);
  taskItem.appendChild(checkbox);

  taskItem.appendChild(subTaskInput);
  taskItem.appendChild(addSubtaskButton);
  taskItem.appendChild(deleteButton);
  form.replaceWith(taskItem);

  // Re-render the tasks to update the UI
  renderTasks();
}

// date auto detection

function parseDueDateFromText(text) {
  const dueDatePattern = /(?:tomorrow|today|yesterday|Tomorrow|Today|Yesterday(\d{1,2}(?:th|st|nd)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}(?:\s+\d{1,2}:\d{2}\s+(?:am|pm))?)|(?:\d{1,2}:\d{2}\s+(?:am|pm)))/i;
  const dueDateMatch = text.match(dueDatePattern);
  console.log(dueDateMatch);
  if (dueDateMatch) {
    // Extract the due date text from the input
    const dueDateText = dueDateMatch[0];
    const d = new Date();

    if (dueDateText.toLowerCase().includes("tomorrow")) {
      return ` ${d.getFullYear()}-0${d.getMonth() + 1}-${d.getDate() + 1}`;
    } else if (dueDateText.toLowerCase().includes("today")) {
      return ` ${d.getFullYear()}-0${d.getMonth() + 1}-${d.getDate()}`;
    } else if (dueDateText.toLowerCase().includes("yesterday")) {
      // If none of the keywords found, use the original due date text as is
      return ` ${d.getFullYear()}-0${d.getMonth() + 1}-${d.getDate() - 1}`;
    } else {
      return dueDateText;
    }
  }
  else {
    return "";
  }
}

//Priority sorting

function priorityToNumber(priority) {
  switch (priority) {
    case "low":
      return 3;
    case "medium":
      return 2;
    case "high":
      return 1;
    default:
      return 0;
  }
}

// generate unique is  for subtasks

function generateUniqueId() {
  return Date.now().toString(36);
}

// adding subtask to main task

function addSubtask(taskId, subtaskTitle) {
  const task = tasks.find((task) => task.id === taskId);
  if (task) {
    const subtask = {
      id: generateUniqueId(), 
      title: subtaskTitle,
      done: false
    };
    task.subtasks.push(subtask);
    saveNotes(); 
    renderTasks(); 
  }
}

//                                                              RENDER TASKS


function renderTasks() {
  taskList.innerHTML = "";
  const headed=document.createElement("h1");
  headed.style.width="100%";
  headed.style.backgroundColor="#19f7e1"
  headed.textContent="TASKS";
  headed.style.alignSelf="center";
  taskList.appendChild(headed);

  //Filtering

  const filteredTasks = applyFilters();

  //Sorting 

  const sortBy = document.getElementById("sortBy").value;
  switch (sortBy) {
    case "dueDate":
      filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      break;
    case "priority":
      filteredTasks.sort((a, b) => priorityToNumber(a.priority) - priorityToNumber(b.priority));
      break;
    default:
      break;
  }

  if (Array.isArray(filteredTasks)) {
    filteredTasks.forEach(function (task) {
      const taskItem = document.createElement("div");
      taskItem.classList.add("task-item");
      taskItem.id = "task-" + task.id;
      taskItem.draggable = "true";
      taskItem.addEventListener("dragstart", dragStart);
      taskItem.addEventListener("dragover", dragOver);
      taskItem.addEventListener("drop", drop);

      // Create and append the reminder text

      if (task.priority === "high") {
        taskItem.classList.add("high-priority");
        const reminderText = document.createElement("div");
        reminderText.textContent = "Important";
        reminderText.classList.add("reminder");
        taskItem.appendChild(reminderText);

        setTimeout(() => {
          taskItem.removeChild(reminderText);
        }, 5000);
      }

      //display subtasks
      let subtaskList;
      if (task.subtasks) {
        subtaskList = document.createElement("div");
        subtaskList.textContent="SubTasks: \n"
        subtaskList.classList.add("subtask-list");
        task.subtasks.forEach(function (subtask) {
          const subtaskItem = document.createElement("div");
          subtaskItem.style.display="flex";
          subtaskItem.classList.add("subtask-item");

          const subtaskTextElem = document.createElement("div");
          subtaskTextElem.textContent = subtask.title;
          subtaskTextElem.classList.add("subtask-text");

          const subtaskCheckbox = document.createElement("input");
          subtaskCheckbox.type = "checkbox";
          subtaskCheckbox.checked = subtask.done;
          subtaskCheckbox.addEventListener("change", () => {
            subtask.done = subtaskCheckbox.checked;
            saveNotes();
            renderTasks();
          });

          subtaskItem.appendChild(subtaskCheckbox);
          subtaskItem.appendChild(subtaskTextElem);
          // subtaskList.textContent="SubTasks: \n"
          subtaskList.appendChild(subtaskItem);
          
          subtaskList.style.marginLeft="20px";
          subtaskList.style.marginBottom="20px";
        });
        // taskItem.appendChild(subtaskList);
      }
      var subTaskInput = document.createElement("input");
      subTaskInput.type = "text";
      subTaskInput.placeholder = "Enter subtask";
      var addSubtaskButton = document.createElement("button");
      addSubtaskButton.classList.add("subTask-button", "btn");
      addSubtaskButton.textContent = "Add SubTask";

      addSubtaskButton.addEventListener("click", function () {

        const subtaskTitle = subTaskInput.value.trim();

        if (subtaskTitle !== "") {
          addSubtask(task.id, subtaskTitle);
          subTaskInput.value = ""; 
        }
      });

      //display tags
      let tagsContainer;
      if (task.tags && task.tags.length > 0) {
         tagsContainer = document.createElement("div");
         tagsContainer.textContent="TAGS:   ";
         tagsContainer.style.fontWeight="bold";
         tagsContainer.style.whiteSpace="pre-wrap";
        tagsContainer.classList.add("tags");
        task.tags.forEach(tag => {
          const tagElem = document.createElement("span");
          if(tag!=""){
          tagElem.textContent = `${tag}.     `;
          }
          tagsContainer.appendChild(tagElem);
        });
        taskItem.appendChild(tagsContainer);
      }

      //display task title

      var taskTextElem = document.createElement("div");
      taskTextElem.classList.add("task-text");
      taskTextElem.textContent = task.id + ". " + `Title: ${task.title}                                                                                                                                                                                                                                                             DueDate: ${task.dueDate}         Category: ${task.category}       Priority: ${task.priority}\n`;

      //display taskcontent
      let check_content = document.createElement("div");
      check_content.style.display="flex";
      check_content.style.marginBottom="20px";
      let contentelem = document.createElement("div");
      // contentelem.style.marginLeft = "20px";
      contentelem.textContent = task.content;


      //edit button for each task

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.classList.add("edit-button", "btn");
      editButton.addEventListener("click", function () {
        showEditForm(task); // Call the showEditForm() function when the button is clicked
      });

      //checkbox for each task to mark done/undone

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      checkbox.addEventListener("change", () => {
        task.done = checkbox.checked;
        renderTasks();
        saveNotes();
      });

      //delete button for each task

      var deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button", "btn");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", function () {
        deleteTask(task.id);
      });



      taskItem.appendChild(taskTextElem);
      check_content.appendChild(checkbox);
      check_content.appendChild(contentelem);
      // taskItem.appendChild(contentelem);
      // taskItem.appendChild(checkbox);
      taskItem.appendChild(check_content);
      taskItem.appendChild(subtaskList);

      let subtaskfield = document.createElement("div");
      subtaskfield.style.display = "flex";
      subtaskfield.style.marginTop = "10px";
      subtaskfield.style.marginBottom = "10px";
      subtaskfield.style.marginLeft = "20px";
      subtaskfield.appendChild(subTaskInput);
      subtaskfield.appendChild(addSubtaskButton);
      taskItem.appendChild(subtaskfield);

      let edit_delete = document.createElement("div");
      edit_delete.style.display = "flex";
      edit_delete.style.marginTop = "10px";
      edit_delete.style.alignSelf = "end";
      edit_delete.appendChild(editButton);    
      edit_delete.appendChild(deleteButton);
      taskItem.appendChild(edit_delete);
      
      taskList.appendChild(taskItem);
    });
  } else {
    console.error('Tasks array is invalid');
  }
}

//delete all function

deleteButton.addEventListener("click", function () {
  const contt = document.getElementById("container");
  const adding_task = document.getElementById("abc");
    contt.style.display="none";
    adding_task.style.display="flex";
  tasks = [];
  count = 0;
  renderTasks();
  saveNotes();
  logActivity(`Deleted all tasks`);
});

//Save button on enter

taskContent.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    saveButton.click();
  }
});

