document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const priorityInput = document.getElementById('priorityInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = parseInt(priorityInput.value);

        if (!taskText) return alert("Task cannot be empty!");

        const task = { text: taskText, completed: false, dueDate, priority };
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        tasks.push(task);
        tasks = sortTasks(tasks);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        renderTasks();
        taskInput.value = "";
        dueDateInput.value = "";
        priorityInput.value = "3"; // Reset to default (Low)
    }

    function createTaskElement(task) {
        const listItem = document.createElement('li');
        listItem.className = `list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'list-group-item-success' : ''}`;

        listItem.innerHTML = `
            <span class="editable task-text" contenteditable="true" style="text-decoration: ${task.completed ? 'line-through' : 'none'}">${task.text}</span>
            <input type="date" class="form-control form-control-sm editable due-date" value="${task.dueDate}">
            <select class="form-select form-select-sm editable priority">
                <option value="1" ${task.priority === 1 ? 'selected' : ''}>High</option>
                <option value="2" ${task.priority === 2 ? 'selected' : ''}>Medium</option>
                <option value="3" ${task.priority === 3 ? 'selected' : ''}>Low</option>
            </select>
            <div>
                <button class="btn btn-sm btn-success done-button">Done</button>
                <button class="btn btn-sm btn-danger delete-button">Delete</button>
            </div>
        `;

        if (task.dueDate && new Date(task.dueDate) < new Date()) {
            listItem.classList.add('list-group-item-danger'); // Highlight overdue tasks
        }

        listItem.querySelector('.task-text').addEventListener('blur', () => updateTask(task, listItem));
        listItem.querySelector('.due-date').addEventListener('change', () => updateTask(task, listItem));
        listItem.querySelector('.priority').addEventListener('change', () => updateTask(task, listItem));
        listItem.querySelector('.done-button').addEventListener('click', () => toggleDone(task, listItem));
        listItem.querySelector('.delete-button').addEventListener('click', () => deleteTask(task));

        return listItem;
    }

    function sortTasks(tasks) {
        return tasks.sort((a, b) => a.priority - b.priority); // High → Medium → Low
    }

    function renderTasks() {
        taskList.innerHTML = "";
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = sortTasks(tasks);

        tasks.forEach(task => {
            taskList.appendChild(createTaskElement(task));
        });
    }

    function updateTask(task, listItem) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(t => {
            if (t.text === task.text) {
                t.text = listItem.querySelector('.task-text').textContent;
                t.dueDate = listItem.querySelector('.due-date').value;
                t.priority = parseInt(listItem.querySelector('.priority').value);
            }
            return t;
        });
        tasks = sortTasks(tasks);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function toggleDone(task, listItem) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(t => {
            if (t.text === task.text) t.completed = !t.completed;
            return t;
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    function deleteTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(t => t.text !== task.text);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    renderTasks();
});
