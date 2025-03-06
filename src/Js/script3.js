function toggleTerms() {
  const modal = document.getElementById("termsModal");
  modal.style.display = modal.style.display === "none" ? "block" : "none";
}

function checkTerms() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match! Please try again.");
  } else {
    toggleTerms(); // Show terms and conditions modal if passwords match
  }
}

function confirmTerms() {
  if (document.getElementById("acceptTerms").checked) {
    toggleTerms(); // Hide modal

    // Collect form data
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const domain = document.getElementById("domain").value;
    const resume = document.getElementById("resume").files[0];

    const userData = {
      name,
      email,
      phone,
      password,
      domain,
      resume
    };

    // Make sure a resume is uploaded
    if (!resume) {
      alert("Please upload your resume.");
      return;
    }

    // Call the backend to register the user
    registerUser(userData);
  } else {
    alert("You must agree to the terms.");
  }
}

function registerUser(userData) {
  const formData = new FormData();
  formData.append("name", userData.name);
  formData.append("email", userData.email);
  formData.append("phone", userData.phone);
  formData.append("password", userData.password);
  formData.append("domain", userData.domain);
  formData.append("resume", userData.resume);

  fetch("http://localhost:3000/signup", {
    method: "POST",
    body: formData,
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.message === "User registered successfully") {
      alert("Registration successful!");
      window.location.href = "login.html"; // Redirect to login page
    } else {
      alert("Registration failed: " + data.message);
    }
  })
  .catch((error) => {
    alert("Error: " + error);
  });
}
