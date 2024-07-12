let todos = [];
let tasks = [];
document.addEventListener('DOMContentLoaded', function () {
    fetchTasksFromDatabase();
    loadTodos();
    todos.forEach(task => scheduleNotification(task));
});
function requestNotificationPermission() {
            if (Notification.permission !== "granted") {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        console.log("Notification permission granted.");
                    } else {
                        console.log("Notification permission denied.");
                    }
                });
            }
        }
function addTask() {
    const taskText = document.getElementById('new-task-text').value;
    const taskDate = document.getElementById('new-task-date').value;
    const taskTime = document.getElementById('new-task-time').value;
    //alert(taskTime);
    const taskPriority = document.getElementById('priority-select').value;
    const taskCategory = document.getElementById('category-select').value;

    if (taskText && taskDate && taskPriority && taskCategory &&taskTime) {
        const newTask = {
            text: taskText,
            date: taskDate,
            time: taskTime,
            priority: taskPriority,
            category: taskCategory,
            status: 'Pending'
        };
        todos.push(newTask);
        saveTodos();
        scheduleNotification(newTask);

            document.getElementById("new-task-text").value = "";
            document.getElementById("new-task-date").value = "";
            document.getElementById("new-task-time").value = "";
            document.getElementById("priority-select").value = "";
            document.getElementById("category-select").value = "";
        tasks.push(newTask);
        renderTasks(tasks);
        
        saveTaskToDatabase(newTask);
        fetchTasks();
    } else {
        alert('Please fill in all fields.');
    }
}

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos() {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
    }
}
function scheduleNotification(task) {
    const taskDateTime = new Date(`${task.date}T${task.time}`);
    const timeUntilNotification = taskDateTime.getTime() - Date.now();

    console.log(`Scheduling notification for task: ${task.text} at ${taskDateTime} which is in ${timeUntilNotification} ms`);

    if (timeUntilNotification > 0) {
        setTimeout(() => {
            showNotification(task);
        }, timeUntilNotification);
    }
}

function showNotification(task) {
    if (Notification.permission === "granted") {
        const notification = new Notification("TaskMaster", {
            body: `Reminder: ${task.text} is due now!`,
            icon: "res/favicon.ico"
        });

        const notificationSound = document.getElementById("notification-sound");
        notificationSound.play();
    } else {
        console.log("Notification permission not granted.");
    }
}

requestNotificationPermission();
function fetchTasks() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'fetch_tasks.php', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                tasks = JSON.parse(xhr.responseText);
                renderTasks(tasks);
                renderTrashDropdown(tasks);
            } else {
                console.error('Failed to fetch tasks.');
            }
        }
    };
    xhr.send();
}

function renderTasks(tasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Clear existing content
    tasks.forEach((task, index) => {
        if (task.status !== 'deleted') {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${task.task}</span>
                <button onclick="deleteTask(${index})">Delete</button>
            `;
            taskList.appendChild(li);
        }
    });
}

function moveTaskToTrash(index) {
    const task = tasks[index];
    tasks.splice(index, 1);
    renderTasks(tasks);

    // Move task to trash in the database
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'move_to_trash.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Task moved to trash successfully.');
                renderTrashDropdown(tasks);
            } else {
                console.error('Failed to move task to trash.');
            }
        }
    };
    xhr.send(`task=${encodeURIComponent(task.task)}`);
}

// Call fetchTasks when the page loads
//window.onload = fetchTasks;

function renderTasks(taskList) {
    const tableBody = document.getElementById('todos-list-body');
    tableBody.innerHTML = '';

    taskList.forEach((task, index) => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${task.task}</td>
            <td>${task.due_date}</td>
            <td>${task.due_time}</td>
            <td>${task.priority}</td>
            <td>${task.category}</td>
            <td>${task.status}</td>
            <td>
            <div class = "task-buttons">
                <button class="btn btn-primary" onclick="updateTaskStatus(${index}, 'Completed')">Complete</button>
                <button class="btn btn-error" onclick="deleteTask(${index})">Delete</button>
            </div>
            </td>
        `;
        tableBody.appendChild(newRow);
    });
}
function deleteTask(index) {
    const task = tasks[index];

    // Update task status to 'deleted' in the database
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'delete_task.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if (response.status === 'success') {
                    console.log(response.message);
                    tasks.splice(index, 1); // Remove task from local array
                    renderTasks(tasks); // Re-render tasks list
                } else {
                    console.error(response.message);
                }
            } else {
                console.error('Failed to delete task.');
            }
        }
    };
    xhr.send(`task=${encodeURIComponent(task.task)}`);
}

function updateTaskStatus(index, status) {
    const task = tasks[index];
    task.status = status;
    renderTasks(tasks);

    // Update status in the database
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'update_task.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Task status updated successfully.');
            } else {
                console.error('Failed to update task status.');
            }
        }
    };
    xhr.send(`task=${encodeURIComponent(task.task)}&status=${encodeURIComponent(status)}`);
}



function moveToTrash(index) {
    const task = tasks[index];
    tasks.splice(index, 1);
    renderTasks(tasks);

    // Move task to trash in the database
    moveTaskToTrashInDatabase(task);
}

function deleteTaskFromDatabase(task) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'delete_task.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Task deleted successfully from database.');
            } else {
                console.error('Failed to delete task from database.');
            }
        }
    };
    xhr.send(`task=${task.text}`);
}

function saveTaskToDatabase(task) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'save_task.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Task saved successfully.');
            } else {
                console.error('Failed to save task.');
            }
        }
    };
    xhr.send(`task=${task.text}&due_date=${task.date}&due_time=${task.time}&priority=${task.priority}&category=${task.category}&status=${task.status}`);
}

function updateTaskInDatabase(task) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'update_task.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Task status updated successfully.');
            } else {
                console.error('Failed to update task status.');
            }
        }
    };
    xhr.send(`task=${task.text}&status=${task.status}`);
}

function moveTaskToTrashInDatabase(task) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'move_to_trash.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Task moved to trash successfully.');
                // After moving to trash, delete task from database
                deleteTaskFromDatabase(task);
            } else {
                console.error('Failed to move task to trash.');
            }
        }
    };
    xhr.send(`task=${task.text}`);
}

function fetchTasksFromDatabase() {
    fetch('fetch_tasks.php', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        tasks = data;
         // Update tasks array with fetched data
        renderTasks(tasks); // Render tasks in the HTML table
    })
    .catch(error => console.error('Error fetching tasks:', error));
}

function filterByPriority(priority) {
    const filteredTasks = tasks.filter(task => task.priority === priority);
    renderTasks(filteredTasks);
}

function filterByCategory(category) {
    const filteredTasks = tasks.filter(task => task.category === category);
    renderTasks(filteredTasks);
}
function filterByStatus(status) {
    const filteredTasks = tasks.filter(task => task.status === status);
    renderTasks(filteredTasks);
}
function filterTodos(status) {
    let filteredTasks = [];
    if (status === 'Pending') {
        filteredTasks = tasks.filter(task => task.status.lower() === 'Pending');
    } else if (status === 'Completed') {
        filteredTasks = tasks.filter(task => task.status.lower() === 'Completed');
    } else {
        filteredTasks = tasks; // Show all tasks
    }
    renderTasks(filteredTasks);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
}