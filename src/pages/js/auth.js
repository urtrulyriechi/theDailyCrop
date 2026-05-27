// ===== AUTH GUARD =====

const loggedIn = localStorage.getItem("loggedIn");

const currentPage = window.location.pathname;

// Allow login page
const isLoginPage = currentPage.includes("login.html");

// If not logged in and NOT login page
if (!loggedIn && !isLoginPage) {
  window.location.href = "login.html";
}
