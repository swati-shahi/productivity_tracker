let chart;

/* ================= INIT DASHBOARD ================= */
function initDashboard() {
    checkAuth();

    const user = JSON.parse(localStorage.getItem("boostlyUser"));

    if (user) {
        document.getElementById("welcomeUser").innerText =
            "Welcome, " + user.name + " 👋";

        // If you added upgraded welcome card
        const usernameDisplay = document.getElementById("usernameDisplay");
        if (usernameDisplay) {
            usernameDisplay.innerText = user.name;
        }
    }

    loadTasks();
    updateAnalytics();
    updateWelcomeStats();
    createChart();
}

/* ================= ADD TASK ================= */
function addTask() {
    const taskInput = document.getElementById("taskInput");
    const category = document.getElementById("categorySelect").value;
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("prioritySelect").value;

    if (!taskInput.value.trim()) return;

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.push({
        text: taskInput.value,
        category,
        dueDate,
        priority,
        completed: false,
        date: new Date().toISOString()
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskInput.value = "";

    refreshDashboard();
}

/* ================= LOAD TASKS ================= */
function loadTasks(filteredCategory = "All") {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (filteredCategory !== "All") {
        tasks = tasks.filter(task => task.category === filteredCategory);
    }

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = task.completed ? "completed-task" : "";

        li.innerHTML = `
            <div>
                <strong>${task.text}</strong>
                <br>
                <small>${task.category} | ${task.priority} | Due: ${task.dueDate || "N/A"}</small>
            </div>

            <div>
                <button onclick="toggleComplete(${index})">✔</button>
                <button onclick="deleteTask(${index})">❌</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

/* ================= FILTER ================= */
function filterTasks() {
    const selected = document.getElementById("filterSelect").value;
    loadTasks(selected);
}

/* ================= TOGGLE COMPLETE ================= */
function toggleComplete(index) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks[index].completed = !tasks[index].completed;

    localStorage.setItem("tasks", JSON.stringify(tasks));

    refreshDashboard();
}

/* ================= DELETE TASK ================= */
function deleteTask(index) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.splice(index, 1);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    refreshDashboard();
}

/* ================= REFRESH ALL ================= */
function refreshDashboard() {
    loadTasks();
    updateAnalytics();
    updateWelcomeStats();
    createChart();
}

/* ================= ANALYTICS SECTION ================= */
function updateAnalytics() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const completed = tasks.filter(task => task.completed).length;

    document.getElementById("dailyCount").innerText = tasks.length;
    document.getElementById("weeklyCount").innerText = completed;

    document.getElementById("monthlyCount").innerText =
        tasks.length > 0
            ? Math.round((completed / tasks.length) * 100) + "%"
            : "0%";
}

/* ================= WELCOME CARD STATS ================= */
function updateWelcomeStats() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    const totalEl = document.getElementById("totalTasks");
    const completedEl = document.getElementById("completedTasks");
    const pendingEl = document.getElementById("pendingTasks");

    if (totalEl) totalEl.innerText = total;
    if (completedEl) completedEl.innerText = completed;
    if (pendingEl) pendingEl.innerText = pending;
}

/* ================= CHART ================= */
function createChart() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.length - completed;

    const ctx = document.getElementById("progressChart");

    if (!ctx) return;

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Completed", "Pending"],
            datasets: [{
                data: [completed, pending],
                backgroundColor: ["#4CAF50", "#FF5252"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

/* ================= DARK MODE ================= */
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
