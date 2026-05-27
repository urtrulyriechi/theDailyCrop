// ===== USERS =====
const users = [
  {
    username: "rie",
    password: "rie",
  },
  {
    username: "chi",
    password: "chi",
  },
];

// ===== ELEMENTS =====
const loginForm = document.getElementById("login-form");

const loginBox = document.getElementById("login-box");
const accountBox = document.getElementById("account-box");

const displayUser = document.getElementById("display-user");

const logoutBtn = document.getElementById("logout-btn");

// ===== CHECK LOGIN =====
const currentUser = localStorage.getItem("currentUser");

if (currentUser) {
  loginBox.style.display = "none";
  accountBox.style.display = "block";

  displayUser.textContent = currentUser;
}

// ===== LOGIN =====
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const validUser = users.find(
      (user) => user.username === username && user.password === password,
    );

    if (validUser) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("currentUser", username);

      window.location.href = "home.html";
    } else {
      alert("Invalid username or password.");
    }
  });
}

// ===== LOGOUT =====
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");

    window.location.href = "login.html";
  });
}
