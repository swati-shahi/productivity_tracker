import { collection, addDoc, getDocs, serverTimestamp, query, orderBy, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

let chartInstance = null;

/* ================= INIT DASHBOARD ================= */
async function initDashboard() {
    // 1. Setup Button Listeners (This replaces onclick)
    const addBtn = document.querySelector(".primary-btn");
    if (addBtn) {
        addBtn.addEventListener("click", addTask);
    }

    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("isLoggedIn");
            window.location.href = "login.html";
        });
    }

    // 2. Display Name
    const user = JSON.parse(localStorage.getItem("boostlyUser"));
    if (user && document.getElementById("usernameDisplay")) {
        document.getElementById("usernameDisplay").innerText = user.name;
    }

    // 3. Load Data from Firebase
    refreshDashboard();
}

/* ================= ADD TASK TO FIREBASE ================= */
async function addTask() {
    const taskInput = document.getElementById("taskInput");
    const category = document.getElementById("categorySelect").value;
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("prioritySelect").value;

    if (!taskInput.value.trim()) return;

    try {
        // Save to Firestore
        await addDoc(collection(window.db, "tasks"), {
            text: taskInput.value,
            category: category,
            dueDate: dueDate,
            priority: priority,
            completed: false,
            createdAt: serverTimestamp()
        });

        taskInput.value = "";
        refreshDashboard(); // Refresh UI
    } catch (error) {
        console.error("Error adding task: ", error);
    }
}

/* ================= LOAD TASKS FROM FIREBASE ================= */
async function loadTasks(filteredCategory = "All") {
    const taskList = document.getElementById("taskList");
    if (!taskList) return;
    taskList.innerHTML = "Loading...";

    try {
        const q = query(collection(window.db, "tasks"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        taskList.innerHTML = "";

        querySnapshot.forEach((docSnap) => {
            const task = docSnap.data();
            const id = docSnap.id;

            if (filteredCategory !== "All" && task.category !== filteredCategory) return;

            const li = document.createElement("li");
            li.className = task.completed ? "completed-task" : "";

            li.innerHTML = `
                <div>
                    <strong>${task.text}</strong><br>
                    <small>${task.category} | ${task.priority} | Due: ${task.dueDate || "N/A"}</small>
                </div>
                <div>
                    <button class="complete-btn" data-id="${id}" data-status="${task.completed}">✔</button>
                    <button class="delete-btn" data-id="${id}">❌</button>
                </div>
            `;
            taskList.appendChild(li);
        });

        // Add event listeners to the new buttons
        document.querySelectorAll(".complete-btn").forEach(btn => btn.onclick = () => toggleComplete(btn.dataset.id, btn.dataset.status));
        document.querySelectorAll(".delete-btn").forEach(btn => btn.onclick = () => deleteTask(btn.dataset.id));

        updateAnalytics(querySnapshot);
    } catch (error) {
        console.error("Error loading tasks: ", error);
    }
}

/* ================= FIREBASE ACTIONS ================= */
async function toggleComplete(id, currentStatus) {
    const taskRef = doc(window.db, "tasks", id);
    await updateDoc(taskRef, { completed: currentStatus === "false" });
    refreshDashboard();
}

async function deleteTask(id) {
    await deleteDoc(doc(window.db, "tasks", id));
    refreshDashboard();
}

function refreshDashboard() {
    loadTasks();
}

/* ================= ANALYTICS & CHART ================= */
function updateAnalytics(querySnapshot) {
    let total = 0;
    let completed = 0;

    querySnapshot.forEach((doc) => {
        total++;
        if (doc.data().completed) completed++;
    });

    document.getElementById("totalTasks").innerText = total;
    document.getElementById("completedTasks").innerText = completed;
    document.getElementById("pendingTasks").innerText = total - completed;
    document.getElementById("dailyCount").innerText = total;
    document.getElementById("weeklyCount").innerText = completed;
    
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    document.getElementById("monthlyCount").innerText = percent + "%";

    updateChart(completed, total - completed);
}

function updateChart(completed, pending) {
    const ctx = document.getElementById("progressChart");
    if (!ctx) return;
    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: "pie",
        data: {
            labels: ["Completed", "Pending"],
            datasets: [{
                data: [completed, pending],
                backgroundColor: ["#4CAF50", "#FF5252"]
            }]
        }
    });
}

// Global scope helper for the dropdown filter
window.filterTasks = () => {
    const selected = document.getElementById("filterSelect").value;
    loadTasks(selected);
};

window.toggleDarkMode = () => document.body.classList.toggle("dark-mode");

window.addEventListener("DOMContentLoaded", initDashboard);
