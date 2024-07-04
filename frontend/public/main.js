document.addEventListener('DOMContentLoaded', () => {
    const newTaskTextInput = document.getElementById('new-task-text');
    const newTaskDateInput = document.getElementById('new-task-date');
    const addTaskButton = document.querySelector('.add-task-button');
    const todosListBody = document.querySelector('.todos-list-body');
    const prioritySelect = document.getElementById('priority-select');
    const categorySelect = document.getElementById('category-select');
    const newCategoryNameInput = document.getElementById('new-category-name');
    const deleteCategorySelect = document.getElementById('delete-category-select');
    const logoutButton = document.getElementById('logout-button');
    const themeToggle = document.getElementById('theme-toggle');

    // Load tasks and categories
    loadTasks();
    loadCategories();

    // Add task event listener
    addTaskButton.addEventListener('click', () => {
        const taskText = newTaskTextInput.value.trim();
        const taskDate = newTaskDateInput.value;
        const taskPriority = prioritySelect.value;
        const taskCategory = categorySelect.value;

        if (taskText === '' || taskDate === '' || taskPriority === '' || taskCategory === '') {
            showAlert('Please fill in all fields', 'error');
            return;
        }

        const newTask = {
            id: Date.now(),
            text: taskText,
            date: taskDate,
            priority: taskPriority,
            category: taskCategory,
            completed: false,
        };

        saveTask(newTask);
        appendTask(newTask);
        showAlert('Task added successfully', 'success');
        newTaskTextInput.value = '';
        newTaskDateInput.value = '';
        prioritySelect.value = '';
        categorySelect.value = '';
    });

    // Function to append task to the table
    function appendTask(task) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${task.text}</td>
            <td>${task.date}</td>
            <td>${task.priority}</td>
            <td>${task.category}</td>
            <td>
                <button class="btn btn-xs ${task.completed ? 'btn-success' : 'btn-warning'}">${task.completed ? 'Completed' : 'Pending'}</button>
            </td>
            <td>
                <button class="btn btn-danger btn-xs">Delete</button>
            </td>
        `;

        // Add event listener for status toggle
        const statusButton = tr.querySelector('.btn-warning, .btn-success');
        statusButton.addEventListener('click', () => toggleTaskStatus(task.id, statusButton));

        // Add event listener for delete
        const deleteButton = tr.querySelector('.btn-danger');
        deleteButton.addEventListener('click', () => deleteTask(task.id, tr));

        todosListBody.appendChild(tr);
    }

    // Function to toggle task status
    function toggleTaskStatus(taskId, statusButton) {
        const tasks = getTasks();
        const task = tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            saveTasks(tasks);
            statusButton.textContent = task.completed ? 'Completed' : 'Pending';
            statusButton.className = `btn btn-xs ${task.completed ? 'btn-success' : 'btn-warning'}`;
        }
    }

    // Function to delete task
    function deleteTask(taskId, taskRow) {
        let tasks = getTasks();
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks(tasks);
        taskRow.remove();
        showAlert('Task deleted successfully', 'success');
    }

    // Function to show alert message
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} mb-4`;
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 3000);
    }

    // Function to save task
    function saveTask(task) {
        const tasks = getTasks();
        tasks.push(task);
        saveTasks(tasks);
    }

    // Function to get tasks from localStorage
    function getTasks() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    // Function to save tasks to localStorage
    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to load tasks from localStorage
    function loadTasks() {
        const tasks = getTasks();
        tasks.forEach(task => appendTask(task));
    }

    // Function to add category
    function addCategory() {
        const newCategoryName = newCategoryNameInput.value.trim();
        if (newCategoryName === '') {
            showAlert('Please enter a category name', 'error');
            return;
        }

        const categories = getCategories();
        if (categories.includes(newCategoryName)) {
            showAlert('Category already exists', 'error');
            return;
        }

        categories.push(newCategoryName);
        saveCategories(categories);
        loadCategories();
        showAlert('Category added successfully', 'success');
        newCategoryNameInput.value = '';
    }

    // Function to delete category
    function deleteCategory() {
        const categoryToDelete = deleteCategorySelect.value;
        if (categoryToDelete === '') {
            showAlert('Please select a category to delete', 'error');
            return;
        }

        let categories = getCategories();
        categories = categories.filter(category => category !== categoryToDelete);
        saveCategories(categories);
        loadCategories();
        showAlert('Category deleted successfully', 'success');
    }

    // Function to get categories from localStorage
    function getCategories() {
        return JSON.parse(localStorage.getItem('categories')) || [];
    }

    // Function to save categories to localStorage
    function saveCategories(categories) {
        localStorage.setItem('categories', JSON.stringify(categories));
    }

    // Function to load categories into dropdowns
    function loadCategories() {
        const categories = getCategories();
        categorySelect.innerHTML = '<option value="" disabled selected>Category</option>';
        deleteCategorySelect.innerHTML = '<option value="" disabled selected>Select Category</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);

            const deleteOption = document.createElement('option');
            deleteOption.value = category;
            deleteOption.textContent = category;
            deleteCategorySelect.appendChild(deleteOption);
        });
    }

    // Function to show add category form
    function showAddCategoryForm() {
        document.getElementById('add-category-form').style.display = 'block';
        document.getElementById('delete-category-form').style.display = 'none';
    }

    // Function to show delete category form
    function showDeleteCategoryForm() {
        document.getElementById('delete-category-form').style.display = 'block';
        document.getElementById('add-category-form').style.display = 'none';
        loadCategories();
    }

    // Function to filter tasks by priority
    function filterByPriority(priority) {
        const tasks = getTasks();
        const filteredTasks = tasks.filter(task => task.priority === priority);
        todosListBody.innerHTML = '';
        filteredTasks.forEach(task => {
            appendTask(task);
        });
    }

    // Function to set theme
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Initial theme setup from local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // Handle theme toggle button
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    // Handle logout button
    logoutButton.addEventListener('click', () => {
        // Add your logout functionality here
        alert('Logging out...');
    });

    function toggleTheme() {
        const theme = document.documentElement.getAttribute("data-theme");
        if (theme === "dark") {
            document.documentElement.setAttribute("data-theme", "light");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
        }
    }
});
