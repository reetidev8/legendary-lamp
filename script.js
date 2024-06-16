document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const completedTaskList = document.getElementById('completed-task-list');
    const clearTasksButton = document.getElementById('clear-tasks');
    const searchInput = document.getElementById('search-input');
    const filterTasks = document.getElementById('filter-tasks');

    loadTasks();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value;
        addTask(taskText);
        taskInput.value = '';
        saveTasks();
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const li = e.target.parentElement;
            if (e.target.classList.contains('complete')) {
                completeTask(li);
            } else if (e.target.classList.contains('delete')) {
                deleteTask(li);
            } else if (e.target.classList.contains('edit')) {
                editTask(li);
            }
        }
    });

    completedTaskList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const li = e.target.parentElement;
            deleteTask(li);
        }
    });

    clearTasksButton.addEventListener('click', () => {
        taskList.innerHTML = '';
        completedTaskList.innerHTML = '';
        saveTasks();
    });

    searchInput.addEventListener('input', filterTasksList);
    filterTasks.addEventListener('change', filterTasksList);

    function addTask(taskText) {
        const li = document.createElement('li');
        li.textContent = taskText;
        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.classList.add('complete');
        li.appendChild(completeButton);
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit');
        li.appendChild(editButton);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete');
        li.appendChild(deleteButton);
        li.classList.add('new-task');
        taskList.appendChild(li);
        setTimeout(() => li.classList.remove('new-task'), 500);
    }

    function completeTask(li) {
        li.classList.add('completed');
        li.querySelector('.complete').remove(); // Remove complete button
        li.querySelector('.edit').remove(); // Remove edit button
        completedTaskList.appendChild(li);
        saveTasks();
    }

    function deleteTask(li) {
        li.remove();
        saveTasks();
    }

    function editTask(li) {
        const newTaskText = prompt('Edit task:', li.firstChild.textContent);
        if (newTaskText) {
            li.firstChild.textContent = newTaskText;
            saveTasks();
        }
    }

    function filterTasksList() {
        const filter = filterTasks.value;
        const searchText = searchInput.value.toLowerCase();

        document.querySelectorAll('#task-list li').forEach(li => {
            const taskText = li.firstChild.textContent.toLowerCase();
            const matchesFilter = (filter === 'all') ||
                                  (filter === 'active' && !li.classList.contains('completed')) ||
                                  (filter === 'completed' && li.classList.contains('completed'));
            const matchesSearch = taskText.includes(searchText);
            li.style.display = (matchesFilter && matchesSearch) ? '' : 'none';
        });

        document.querySelectorAll('#completed-task-list li').forEach(li => {
            const taskText = li.firstChild.textContent.toLowerCase();
            const matchesSearch = taskText.includes(searchText);
            li.style.display = (filter === 'all' && matchesSearch) ? '' : 'none';
        });
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({ text: li.firstChild.textContent, completed: false });
        });
        completedTaskList.querySelectorAll('li').forEach(li => {
            tasks.push({ text: li.firstChild.textContent, completed: true });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            if (task.completed) {
                const li = document.createElement('li');
                li.textContent = task.text;
                li.classList.add('completed');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete');
                li.appendChild(deleteButton);
                completedTaskList.appendChild(li);
            } else {
                const li = document.createElement('li');
                li.textContent = task.text;
                const completeButton = document.createElement('button');
                completeButton.textContent = 'Complete';
                completeButton.classList.add('complete');
                li.appendChild(completeButton);
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit');
                li.appendChild(editButton);
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete');
                li.appendChild(deleteButton);
                taskList.appendChild(li);
            }
        });
    }
});
