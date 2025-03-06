async function login() {
  const email = document.getElementById("email").value;  // Use email for login
  const password = document.getElementById("password").value;

  // Simple validation
  if (email === "" || password === "") {
    alert("Please fill in both fields.");
    return;
  }

  try {
    // Send POST request to the server using email
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })  // Sending email to server
    });

    const result = await response.json();

    if (response.ok && result.success) {
      alert("Login successful!");
      // Redirect to dashboard or another page if login is successful
      window.location.href = "index.html";
    } else {
      alert(result.message || "Invalid email or password. Please try again.");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    alert("An error occurred. Please try again later.");
  }
}

document.getElementById("forgotPassword").onclick = function (event) {
  event.preventDefault();
  toggleResetPassword();
};

function toggleResetPassword() {
  const modal = document.getElementById("resetPasswordModal");
  modal.style.display = modal.style.display === "none" ? "block" : "none";
}

function sendResetLink() {
  const resetEmail = document.getElementById("resetEmail").value;
  if (resetEmail === "") {
    alert("Please enter your email.");
  } else {
    // Simulate sending a password reset link
    alert("A password reset link has been sent to " + resetEmail);
    toggleResetPassword(); // Close modal after sending
  }
}
