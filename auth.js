// -------------------- SIGNUP --------------------
function signupUser(event) {
    event.preventDefault();

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    const messageBox = document.getElementById("message");

    if (!name || !email || !password) {
        showMessage("Please fill all fields", "error");
        return;
    }

    const user = { name, email, password };
    localStorage.setItem("boostlyUser", JSON.stringify(user));

    showMessage("Account created successfully! Redirecting...", "success");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
}


// -------------------- LOGIN --------------------
function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const storedUser = JSON.parse(localStorage.getItem("boostlyUser"));

    if (!storedUser) {
        showMessage("No account found. Please sign up first.", "error");
        return;
    }

    if (email === storedUser.email && password === storedUser.password) {
        localStorage.setItem("isLoggedIn", "true");

        showMessage("Login successful! Redirecting...", "success");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1500);
    } else {
        showMessage("Invalid email or password", "error");
    }
}


// -------------------- MESSAGE FUNCTION --------------------
function showMessage(text, type) {
    const messageBox = document.getElementById("message");
    messageBox.innerText = text;
    messageBox.className = type;
}


// -------------------- AUTH CHECK --------------------
function checkAuth() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
        window.location.href = "login.html";
    }
}


// -------------------- LOGOUT --------------------
function logoutUser() {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "login.html";
}
