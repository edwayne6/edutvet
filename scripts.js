import config from './config.json';

// Initialize Supabase
const SUPABASE_URL = "https://frtueyicmjftwtsrmxfi.supabase.co"; // Your Supabase URL
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZydHVleWljbWpmdHd0c3JteGZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MTY0NzcsImV4cCI6MjA2MDM5MjQ3N30.kKEvq1WvSM4FXArdNjGxXERslO29o_p4KnbOfMyGvqc"; // Your Supabase API Key
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Form Validation for Signup and Login
document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      const inputs = form.querySelectorAll("input[required]");
      let isValid = true;

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add("border-red-500");
          input.nextElementSibling?.classList.add("text-red-500");
        } else {
          input.classList.remove("border-red-500");
          input.nextElementSibling?.classList.remove("text-red-500");
        }
      });

      if (!isValid) {
        e.preventDefault();
        alert("Please fill in all required fields.");
      }
    });
  });
});

// Handle Sign Up Form Submission
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      if (!passwordRegex.test(password)) {
        alert("Password must be at least 8 characters long and include both letters and numbers.");
        return;
      }

      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.msg);
          window.location.href = "/login.html";
        } else {
          alert(result.msg);
        }
      } catch (error) {
        alert("An error occurred. Please try again.");
        console.error(error);
      }
    });
  }
});

// Handle Login Form Submission
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.msg);
          window.location.href = "/dashboard.html"; // Redirect to dashboard or home page
        } else {
          alert(result.msg);
        }
      } catch (error) {
        alert("An error occurred. Please try again.");
        console.error(error);
      }
    });
  }
});

// Handle Upload Form Submission
document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  if (uploadForm) {
    uploadForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const fileInput = document.getElementById("file");
      const formData = new FormData();
      formData.append("file", fileInput.files[0]);
      formData.append("upload_preset", "edutvet"); // Replace with your unsigned upload preset

      try {
        const response = await fetch("https://api.cloudinary.com/v1_1/dnlb4ucpu/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (data.secure_url) {
          alert("Document uploaded successfully!");
          console.log("Uploaded file URL:", data.secure_url);
          uploadForm.reset();
        } else {
          alert("Error uploading document. Please try again.");
        }
      } catch (err) {
        alert("Error uploading document. Please try again.");
        console.error(err);
      }
    });
  }
});

// Simple Slider for Featured Documents
let currentSlide = 0;
const slides = document.querySelectorAll(".featured-slide");
const totalSlides = slides.length;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("hidden", i !== index);
  });
}

document.getElementById("prevSlide").addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
});

document.getElementById("nextSlide").addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
});

// API Call Example for Document Search
async function searchDocuments(query) {
  try {
    const response = await fetch(`${config.api.baseUrl}/search?query=${query}`);
    if (!response.ok) throw new Error("Failed to fetch documents");

    const documents = await response.json();
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = "";

    documents.forEach((doc) => {
      const docElement = `
        <div class="bg-gray-100 p-4 rounded shadow">
          <h4 class="font-bold text-lg mb-2">${doc.title}</h4>
          <p class="text-sm mb-2">By ${doc.author} • ${doc.category}</p>
          <a href="${doc.link}" class="text-blue-600 hover:underline">Download</a>
        </div>
      `;
      resultsContainer.innerHTML += docElement;
    });
  } catch (error) {
    console.error(error);
    alert("An error occurred while searching for documents.");
  }
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  const query = e.target.value.trim();
  if (query.length > 2) searchDocuments(query);
});

// Local Document Filtering
const documents = [
  { title: "Crop Protection Guide", author: "Jane Doe", category: "Agriculture", link: "#" },
  { title: "TVET Curriculum Outline", author: "Edwin Chesaro", category: "Curriculum", link: "#" },
  { title: "Lesson Plan Template", author: "Edwin Chesaro", category: "Teaching Aids", link: "#" },
];

function filterDocuments() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const resultsContainer = document.getElementById("searchResults");
  resultsContainer.innerHTML = ""; // Clear previous results

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(query) || 
    doc.author.toLowerCase().includes(query) || 
    doc.category.toLowerCase().includes(query)
  );

  if (filteredDocs.length === 0) {
    resultsContainer.innerHTML = "<p class='text-gray-500'>No documents found.</p>";
    return;
  }

  filteredDocs.forEach(doc => {
    const docElement = `
      <div class="bg-gray-100 p-4 rounded shadow">
        <h4 class="font-bold text-lg mb-2">${doc.title}</h4>
        <p class="text-sm mb-2">By ${doc.author} • ${doc.category}</p>
        <a href="${doc.link}" class="text-blue-600 hover:underline">Download</a>
      </div>
    `;
    resultsContainer.innerHTML += docElement;
  });
}

// Handle Reset Password Form Submission
document.addEventListener("DOMContentLoaded", () => {
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  if (resetPasswordForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
      alert("Invalid or missing token. Please try resetting your password again.");
      window.location.href = "/index.html";
      return;
    }

    resetPasswordForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newPassword = document.getElementById("newPassword").value;

      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        alert("Password must be at least 8 characters long and include both letters and numbers.");
        return;
      }

      try {
        const response = await fetch("/api/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.msg);
          window.location.href = "/login.html";
        } else {
          alert(result.msg);
        }
      } catch (error) {
        alert("An error occurred. Please try again later.");
        console.error(error);
      }
    });
  }
});

// Handle Password Visibility Toggle
document.addEventListener("DOMContentLoaded", () => {
  const togglePasswordButtons = document.querySelectorAll("#togglePassword");
  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const passwordInput = button.previousElementSibling;
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        button.textContent = "Hide";
      } else {
        passwordInput.type = "password";
        button.textContent = "Show";
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelector(".slides");
  const slideCount = document.querySelectorAll(".slide").length;
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");

  let currentIndex = 0;

  // Function to update the slider position
  function updateSliderPosition() {
    slides.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  // Move to the next slide
  function nextSlide() {
    currentIndex = (currentIndex + 1) % slideCount; // Loop back to the first slide
    updateSliderPosition();
  }

  // Move to the previous slide
  function prevSlide() {
    currentIndex = (currentIndex - 1 + slideCount) % slideCount; // Loop back to the last slide
    updateSliderPosition();
  }

  // Event listeners for navigation buttons
  prevButton.addEventListener("click", prevSlide);
  nextButton.addEventListener("click", nextSlide);

  // Auto-slide every 3 seconds
  setInterval(nextSlide, 3000);
});

// Google Login
document.addEventListener("DOMContentLoaded", () => {
  const googleLoginButton = document.getElementById("googleLogin");

  if (googleLoginButton) {
    googleLoginButton.addEventListener("click", async () => {
      try {
        const { user, session, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
        });

        if (error) {
          console.error("Google login failed:", error.message);
          alert("Google login failed. Please try again.");
          return;
        }

        // Redirect to dashboard after successful login
        if (user) {
          alert("Login successful!");
          window.location.href = "dashboard.html";
        }
      } catch (err) {
        console.error("An error occurred during Google login:", err);
        alert("An error occurred. Please try again.");
      }
    });
  }
});

// Check Authentication on Page Load
document.addEventListener("DOMContentLoaded", async () => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // Redirect to login page if not authenticated
    if (!window.location.pathname.includes("login.html")) {
      window.location.href = "login.html";
    }
  }
});

// Logout
document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout");

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout failed:", error.message);
        alert("Logout failed. Please try again.");
        return;
      }

      alert("Logged out successfully!");
      window.location.href = "login.html";
    });
  }
});