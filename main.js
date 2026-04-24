import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {
    // Select the button directly
    const addBtn = document.querySelector('.Add-New-Task button') || document.querySelector('.btn-add-task'); 
    const taskListContainer = document.querySelector('.Your-Tasks'); 

    if (addBtn) {
        console.log("Add button found!"); // Check your console (F12) for this message
        
        addBtn.addEventListener("click", async function (e) {
            e.preventDefault();

            // Select inputs based on your UI layout
            const taskInput = document.querySelector('.Add-New-Task input[type="text"]');
            const categorySelect = document.querySelector('.Add-New-Task select:nth-of-type(1)');
            const dateInput = document.querySelector('.Add-New-Task input[type="date"]');
            const prioritySelect = document.querySelector('.Add-New-Task select:nth-of-type(2)');

            const taskTitle = taskInput ? taskInput.value.trim() : "";

            if (taskTitle !== "") {
                try {
                    console.log("Attempting to save to Firebase...");
                    
                    // Add to Firestore
                    await addDoc(collection(window.db, "tasks"), {
                        title: taskTitle,
                        category: categorySelect ? categorySelect.value : "General",
                        dueDate: dateInput ? dateInput.value : "N/A",
                        priority: prioritySelect ? prioritySelect.value : "Medium",
                        status: "pending",
                        createdAt: serverTimestamp()
                    });

                    console.log("Task saved successfully!");
                    
                    // Clear inputs
                    if (taskInput) taskInput.value = "";
                    
                    // Reload the tasks list
                    loadTasks();
                } catch (error) {
                    console.error("Firebase Error:", error);
                    alert("Firebase Error: Check console.");
                }
            } else {
                alert("Please enter a task name!");
            }
        });
    } else {
        console.error("Add button NOT found. Check your HTML classes.");
    }

    // --- FETCH TASKS ---
    async function loadTasks() {
        if (!taskListContainer) return;
        
        try {
            const q = query(collection(window.db, "tasks"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            
            // This clears the old placeholder tasks you see in your screenshot
            taskListContainer.innerHTML = '<h3>Your Tasks</h3><select><option>Show All</option></select>'; 

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const taskHTML = `
                    <div class="task-card" style="border-bottom: 1px solid #eee; padding: 10px; margin-bottom: 5px;">
                        <strong>${data.title}</strong>
                        <p style="font-size: 0.8rem; color: #666;">
                            ${data.category} | ${data.priority} | Due: ${data.dueDate}
                        </p>
                    </div>
                `;
                taskListContainer.insertAdjacentHTML('beforeend', taskHTML);
            });
        } catch (error) {
            console.error("Load Error:", error);
        }
    }

    // Initial load
    if (window.location.pathname.includes("dashboard.html")) {
        loadTasks();
    }
});
