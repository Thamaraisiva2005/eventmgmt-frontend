const BASE_URL = "https://eventmgmt-api.onrender.com";

/* ================= REGISTER ================= */
function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!name || !email || !phone || !password || !confirmPassword) {
    alert("All fields are required");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, phone, password })
  })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Registration failed");
      return data;
    })
    .then(data => {
      alert(data.msg);
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
}


/* ================= LOGIN ================= */
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(async res => {
      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || "Login failed");

      return data;
    })
    .then(data => {
      alert(data.msg);

      // 🔐 Save token & role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      if (data.user.role === "admin") {
        window.location.href = "Dashboard.html";
      } else {
        window.location.href = "events.html";
      }
    })
    .catch(err => alert(err.message));
}


/* ================= RESET PASSWORD ================= */
function resetPassword() {
  const email = document.getElementById("email").value.trim();
  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!email || !newPassword || !confirmPassword) {
    alert("All fields are required");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword })
  })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Reset failed");

      alert(data.msg);
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
}
