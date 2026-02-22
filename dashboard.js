function initDashboard() {
    checkAuth();

    const user = JSON.parse(localStorage.getItem("boostlyUser"));
    document.getElementById("welcomeUser").innerText =
        "Welcome, " + user.name + " 👋";

    loadTasks();
    updateAnalytics();
}

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const category = document.getElementById("categorySelect").value;

    if (!taskInput.value) return;

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.push({
        text: taskInput.value,
        category: category,
        completed: false,
        date: new Date().toISOString()
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskInput.value = "";

    loadTasks();
    updateAnalytics();
}

function loadTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = task.completed ? "completed-task" : "";

        li.innerHTML = `
            <div class="task-info">
                <strong>${task.text}</strong>
                <span class="category">${task.category}</span>
            </div>

            <div class="task-actions">
                <button onclick="toggleComplete(${index})">✔</button>
                <button onclick="editTask(${index})">✏</button>
                <button onclick="deleteTask(${index})">❌</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

function toggleComplete(index) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks[index].completed = !tasks[index].completed;

    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
}

function editTask(index) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const newText = prompt("Edit task:", tasks[index].text);

    if (newText !== null) {
        tasks[index].text = newText;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        loadTasks();
    }
}

function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(index, 1);

    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
    updateAnalytics();
}

function updateAnalytics() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const today = new Date();
    let daily = 0, weekly = 0, monthly = 0;

    tasks.forEach(task => {
        const taskDate = new Date(task.date);
        const diffDays = (today - taskDate) / (1000 * 60 * 60 * 24);

        if (diffDays <= 1) daily++;
        if (diffDays <= 7) weekly++;
        if (diffDays <= 30) monthly++;
    });

    document.getElementById("dailyCount").innerText = daily;
    document.getElementById("weeklyCount").innerText = weekly;
    document.getElementById("monthlyCount").innerText = monthly;
}
