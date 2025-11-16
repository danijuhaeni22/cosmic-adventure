// toggle show/hide password
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  togglePassword.textContent = isPassword ? "hide" : "show";
});

// LOGIN LOGIC
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const loginError = document.getElementById("loginError");

// credential demo – bisa kamu ganti sendiri
const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD = "password123";

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // validasi sederhana
  if (!email || !password) {
    loginError.textContent = "Email dan password wajib diisi.";
    return;
  }

  // cek cred demo
  const isValid =
    email.toLowerCase() === DEMO_EMAIL.toLowerCase() &&
    password === DEMO_PASSWORD;

  if (!isValid) {
    loginError.textContent = "Email atau password salah.";
    return;
  }

  // clear error & redirect ke halaman home
  loginError.textContent = "";
  window.location.href = "home.html";
});
