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
    const response = await fetch(`https://api.edutvet.com/search?query=${query}`);
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