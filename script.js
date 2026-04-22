document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.input-area');
  const taskInput = document.getElementById('task-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');

  const STORAGE_KEY = 'todo-list-tasks';
  let tasks = loadTasks();

  renderTasks();

  addTaskBtn.addEventListener('click', addTask);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    addTask();
  });

  taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTask();
    }
  });

  taskList.addEventListener('click', (event) => {
    const deleteBtn = event.target.closest('.delete-btn');
    if (deleteBtn) {
      const li = deleteBtn.closest('li');
      deleteTask(Number(li.dataset.index));
      return;
    }

    const li = event.target.closest('li');
    if (!li) return;
    toggleTask(Number(li.dataset.index));
  });

  function loadTasks() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
      console.error('Failed to parse saved tasks', error);
      return [];
    }
  }

  function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
      alert('Please enter a task before adding.');
      return;
    }

    tasks.push({ text, completed: false });
    taskInput.value = '';
    renderTasks();
  }

  function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
  }

  function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
  }

  function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
      const li = document.createElement('li');
      li.dataset.index = index;
      li.className = task.completed ? 'checked' : '';

      const textSpan = document.createElement('span');
      textSpan.className = 'task-text';
      textSpan.textContent = task.text;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.setAttribute('aria-label', `Delete ${task.text}`);
      deleteBtn.innerHTML = '&times;';

      li.appendChild(textSpan);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });

    saveTasks();
  }
});
